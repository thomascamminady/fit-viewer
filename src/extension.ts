import * as vscode from 'vscode';
import { FitFileEditorProvider } from './fitFileEditorProvider.js';  // ✅ Fix extension

export function activate(context: vscode.ExtensionContext) {
    console.log("✅ FIT Viewer extension activated");
    context.subscriptions.push(FitFileEditorProvider.register(context));
}

export function deactivate() {
    console.log("❌ FIT Viewer extension deactivated");
}