"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
var fitFileEditorProvider_1 = require("./fitFileEditorProvider");
function activate(context) {
    console.log("Activating FIT Viewer extension...");
    context.subscriptions.push(fitFileEditorProvider_1.FitFileEditorProvider.register(context));
}
function deactivate() {
    console.log("Deactivating FIT Viewer extension...");
}
