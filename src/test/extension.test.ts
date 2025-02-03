import * as vscode from 'vscode';
import * as assert from 'node:assert';
import { suite, test } from 'mocha';  // ✅ Fix missing Mocha types

suite('Extension Test Suite', () => {
    test('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(4));  // ✅ Sample test
    });
});