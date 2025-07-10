import * as vscode from 'vscode';
import { FitFileEditorProvider } from './fitFileEditorProvider.js';

/**
 * Extension activation function called when the extension is first activated.
 * Registers the FIT file editor provider.
 *
 * @param context - The extension context provided by VS Code
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('✅ FIT Viewer extension activated');
  context.subscriptions.push(FitFileEditorProvider.register(context));
}

/**
 * Extension deactivation function called when the extension is deactivated.
 * Currently performs cleanup logging.
 */
export function deactivate() {
  console.log('❌ FIT Viewer extension deactivated');
}
