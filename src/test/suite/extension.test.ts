import * as assert from 'assert';
import * as vscode from 'vscode';
import { decodeFitFile } from '../../fitParser';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('thomascamminady.fit-viewer'));
  });

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension(
      'thomascamminady.fit-viewer'
    );
    if (extension) {
      await extension.activate();
      assert.ok(extension.isActive);
    }
  });

  test('decodeFitFile should handle invalid input gracefully', async () => {
    const invalidBuffer = new Uint8Array([1, 2, 3, 4, 5]);
    const result = await decodeFitFile(invalidBuffer);
    assert.ok(result.error, 'Should return error for invalid FIT file');
  });
});
