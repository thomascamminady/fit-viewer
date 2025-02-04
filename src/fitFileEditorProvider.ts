import * as vscode from 'vscode';
import { decodeFitFile } from './fitParser';
import { parseMessages } from './parseMessages';
import * as path from 'path';
import * as fs from 'fs';

export class FitFileEditorProvider implements vscode.CustomReadonlyEditorProvider {

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        console.log("Registering FitFileEditorProvider...");
        return vscode.window.registerCustomEditorProvider(
            FitFileEditorProvider.viewType,
            new FitFileEditorProvider(context),
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        );
    }

    private static readonly viewType = 'fitViewer.fitEditor';

    constructor(private readonly context: vscode.ExtensionContext) {
        console.log("FitFileEditorProvider constructor called...");
    }

    public async openCustomDocument(
        uri: vscode.Uri,
        _openContext: vscode.CustomDocumentOpenContext,
        _token: vscode.CancellationToken
    ): Promise<vscode.CustomDocument> {
        console.log("Opening FIT file:", uri.fsPath);
        return { uri, dispose: () => { } };
    }

    public async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        console.log("Resolving custom editor for:", document.uri.fsPath);
        webviewPanel.webview.options = { enableScripts: true };

        const workspaceFs = vscode.workspace.fs;
        const fileData = await workspaceFs.readFile(document.uri);
        const rawMessages = await decodeFitFile(fileData);
        const tables = await parseMessages(rawMessages);

        // Construct path to the HTML file that was copied to out/media/
        const htmlPath = path.join(this.context.extensionPath, 'out', 'media', 'webview.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        webviewPanel.webview.html = htmlContent;

        // Listen for the 'ready' message from the webview
        webviewPanel.webview.onDidReceiveMessage(message => {
            if (message.type === "ready") {
                // Now that the webview is ready, send the fitData
                webviewPanel.webview.postMessage({ type: "fitData", data: tables });
            }
        });
    }
}