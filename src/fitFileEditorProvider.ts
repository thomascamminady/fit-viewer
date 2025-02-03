import * as vscode from 'vscode';
import { decodeFitFile } from './fitParser.js';  // ✅ Fix extension

export class FitFileEditorProvider implements vscode.CustomReadonlyEditorProvider {
    
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        console.log("📂 Registering FitFileEditorProvider...");
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
        console.log("🔧 FitFileEditorProvider constructor called...");
    }

    public async openCustomDocument(
        uri: vscode.Uri,
        _openContext: vscode.CustomDocumentOpenContext,
        _token: vscode.CancellationToken
    ): Promise<vscode.CustomDocument> {
        console.log("📄 Opening FIT file:", uri.fsPath);
        return { uri, dispose: () => {} };
    }

    public async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        console.log("🖥️ Resolving custom editor for:", document.uri.fsPath);
        webviewPanel.webview.options = { enableScripts: true };

        const fileData = await vscode.workspace.fs.readFile(document.uri);
        console.log("📥 File data loaded, decoding FIT file...");

        const data = await decodeFitFile(fileData);
        console.log("✅ Decoded FIT file data:", data);

        webviewPanel.webview.html = this.getHtmlForWebview(data);
    }

    private getHtmlForWebview(data: any): string {
        console.log("🖼️ Generating HTML for webview...");
        return `
            <html>
            <head>
                <script>
                    window.onload = () => {
                        document.getElementById('data').textContent = JSON.stringify(${JSON.stringify(data, null, 2)}, null, 2);
                    };
                </script>
            </head>
            <body>
                <h2>FIT File Data</h2>
                <pre id="data"></pre>
            </body>
            </html>
        `;
    }
}