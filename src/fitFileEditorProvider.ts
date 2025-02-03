import * as vscode from 'vscode';
import { decodeFitFile } from './fitParser';
import { parseMessages } from './parseMessages';

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
        return { uri, dispose: () => {} };
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

        console.log("Decoded FIT file data:", rawMessages);

        // ✅ Ensure we correctly await the dynamic import
        const tables = await parseMessages(rawMessages);

        webviewPanel.webview.html = this.getHtmlForWebview();
        webviewPanel.webview.postMessage({ type: "fitData", data: tables });
    }

    private getHtmlForWebview(): string {
        return `
            <html>
            <head>
                <script src="https://unpkg.com/arquero"></script>
                <script>
                    window.onload = () => {
                        window.addEventListener("message", event => {
                            const message = event.data;
                            if (message.type === "fitData") {
                                displayTables(message.data);
                            }
                        });

                        function displayTables(dataFrames) {
                            const aq = window.aq;
                            const container = document.getElementById("tables");

                            Object.keys(dataFrames).forEach(key => {
                                const table = aq.from(dataFrames[key]);
                                renderTable(container, key, table);
                            });
                        }

                        function renderTable(container, title, table) {
                            const tableDiv = document.createElement("div");
                            tableDiv.style.marginBottom = "20px";
                            
                            const heading = document.createElement("h3");
                            heading.textContent = title;
                            
                            const htmlTable = table.toHTML(); // Convert Arquero Table to HTML
                            tableDiv.appendChild(heading);
                            tableDiv.innerHTML += htmlTable;
                            
                            container.appendChild(tableDiv);
                        }
                    };
                </script>
            </head>
            <body>
                <h2>FIT File Data</h2>
                <div id="tables"></div>
            </body>
            </html>
        `;
    }
}