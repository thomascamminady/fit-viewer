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
              <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
              <script src="https://cdn.datatables.net/2.2.1/js/jquery.dataTables.min.js"></script>
              <script src="https://unpkg.com/arquero"></script>
              <link rel="stylesheet" href="https://cdn.datatables.net/2.2.1/css/jquery.dataTables.min.css">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 10px;
                  font-size: 13px;
                }
                h2 {
                  margin-bottom: 10px;
                }
                .table-section {
                  border: 1px solid #ddd;
                  padding: 8px;
                  background: #f9f9f9;
                  margin-bottom: 8px;
                  border-radius: 4px;
                }
                .table-header {
                  font-size: 16px;
                  font-weight: bold;
                  cursor: pointer;
                  background: #e0e0e0;
                  padding: 8px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  border-radius: 4px;
                  transition: background 0.3s;
                }
                .table-header:hover {
                  background: #d6d6d6;
                }
                .copy-btn {
                  font-size: 12px;
                  padding: 4px 8px;
                  background: #007acc;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  margin-right: 10px;
                }
                .copy-btn:hover {
                  background: #005fa3;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 12px;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 4px;
                  text-align: left;
                }
                th {
                  background: #eee;
                }
                tr:nth-child(even) {
                  background: #f2f2f2;
                }
                tr:hover {
                  background: #d0eaff !important;
                  transition: background 0.2s;
                }
                .table-content {
                  display: none;
                  padding: 8px;
                  overflow-x: auto;
                  transition: max-height 0.3s ease-out;
                }
              </style>
              <script>
                window.onload = () => {
                  window.addEventListener("message", (event) => {
                    const message = event.data;
                    if (message.type === "fitData") {
                      displayTables(message.data);
                    }
                  });
              
                  function displayTables(dataFrames) {
                    const aq = window.aq;
                    const container = document.getElementById("tables");
                    container.innerHTML = "";
              
                    // Ensure recordMesgs appears first
                    const keys = Object.keys(dataFrames);
                    keys.sort((a, b) => (a === "recordMesgs" ? -1 : b === "recordMesgs" ? 1 : 0));
              
                    keys.forEach((key, index) => {
                      const table = aq.from(dataFrames[key]);
                      renderTable(container, key, table, index);
                    });
                  }
              
                  function renderTable(container, title, table, index) {
                    const tableId = "datatable_" + index;
                    const section = document.createElement("div");
                    section.classList.add("table-section");
              
                    // Create header container with left and right parts
                    const header = document.createElement("div");
                    header.classList.add("table-header");
              
                    // Left side: Title
                    const leftSpan = document.createElement("span");
                    leftSpan.textContent = title;
              
                    // Right side: container for copy button and toggle icon
                    const rightContainer = document.createElement("div");
                    rightContainer.style.display = "flex";
                    rightContainer.style.alignItems = "center";
                    rightContainer.style.gap = "10px";
              
                    // Copy as CSV Button
                    const copyButton = document.createElement("button");
                    copyButton.textContent = "Copy as CSV";
                    copyButton.classList.add("copy-btn");
                    copyButton.onclick = (event) => {
                      event.stopPropagation();
                      copyTableAsCSV(table, title);
                    };
              
                    // Toggle Icon
                    const icon = document.createElement("span");
                    icon.textContent = "➕";
              
                    rightContainer.appendChild(copyButton);
                    rightContainer.appendChild(icon);
              
                    header.appendChild(leftSpan);
                    header.appendChild(rightContainer);
              
                    header.onclick = () => {
                      const content = document.getElementById(tableId + "_content");
                      const currentDisplay = window.getComputedStyle(content).display;
                      const isVisible = currentDisplay === "block";
                      content.style.display = isVisible ? "none" : "block";
                      icon.textContent = isVisible ? "➕" : "➖";
                    };
              
                    // Content (table container)
                    const content = document.createElement("div");
                    content.classList.add("table-content");
                    content.id = tableId + "_content";
                    if (title === "recordMesgs") {
                      content.style.display = "block";
                      icon.textContent = "➖";
                    }
              
                    // Table element: Use toHTML with no row limit
                    const tableElement = document.createElement("table");
                    tableElement.id = tableId;
                    tableElement.classList.add("display");
                    // Pass { limit: Infinity } to display all rows
                    tableElement.innerHTML = table.toHTML({ limit: Infinity });
              
                    content.appendChild(tableElement);
                    section.appendChild(header);
                    section.appendChild(content);
                    container.appendChild(section);
              
                    // Initialize DataTables.js with paging disabled (to show all rows)
                    $(document).ready(function () {
                      setTimeout(() => {
                        $("#" + tableId).DataTable({
                          paging: false,
                          searching: true,
                          ordering: true,
                          autoWidth: true,
                        });
                      }, 100);
                    });
                  }
              
                  function copyTableAsCSV(table, title) {
                    // Flatten cells if needed (as before)
                    const rows = table.objects().map(row => {
                      const newRow = {};
                      Object.keys(row).forEach(key => {
                        const cell = row[key];
                        newRow[key] = (typeof cell === 'object' && cell !== null) ? JSON.stringify(cell) : cell;
                      });
                      return newRow;
                    });
                    const flattenedTable = window.aq.from(rows);
                    const csvString = flattenedTable.toCSV({ header: true });
                    navigator.clipboard.writeText(csvString)
                      .then(() => console.log("Copied CSV to clipboard!"))
                      .catch(err => console.error("Failed to copy CSV:", err));
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