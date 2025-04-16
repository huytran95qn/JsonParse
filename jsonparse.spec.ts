const cases = [
    // Primitives
    { input: 'true', expected: true },
    { input: 'false', expected: false },
    { input: 'null', expected: null },
    { input: '123', expected: 123 },
    { input: '-123.45', expected: -123.45 },
    { input: '0.001', expected: 0.001 },
    { input: '1e3', expected: 1000 },
    { input: '"hello"', expected: 'hello' },
    { input: '"with \\"quotes\\""', expected: 'with "quotes"' },
    { input: '"escaped \\\\ slash"', expected: 'escaped \\ slash' },
    { input: '"unicode \\u2764"', expected: 'unicode ❤' },

    // Arrays
    { input: '[]', expected: [] },
    { input: '[1, 2, 3]', expected: [1, 2, 3] },
    { input: '[true, false, null]', expected: [true, false, null] },
    { input: '["a", "b", "c"]', expected: ['a', 'b', 'c'] },
    { input: '[ [1], [2, 3] ]', expected: [[1], [2, 3]] },

    // Objects
    { input: '{}', expected: {} },
    { input: '{"a":1}', expected: { a: 1 } },
    { input: '{"a":1,"b":2}', expected: { a: 1, b: 2 } },
    { input: '{"nested":{"x":10}}', expected: { nested: { x: 10 } } },
    { input: '{"arr":[1,2,3],"obj":{"y":true}}', expected: { arr: [1, 2, 3], obj: { y: true } } },
    { input: '{ " spaced " : " ok " }', expected: { ' spaced ': ' ok ' } },

    // Full mixed object
    {
        input: `{
            "a": true,
            "b": false,
            "c": 0,
            "d": null,
            "e": "str",
            "f": "{\\"a\\": 1, \\"b\\": 2}"
        }`,
        expected: {
            a: true,
            b: false,
            c: 0,
            d: null,
            e: "str",
            f: '{"a": 1, "b": 2}'
        }
    }
];

const invalidCases = [
    '',                          // empty input
    'tru',                       // incomplete true
    'nulll',                     // typo
    '{',                         // unterminated object
    '[1, 2,',                    // unterminated array
    '{"key":value}',             // unquoted string
    '{"key": "value"',           // missing closing brace
    '{"key": "value",}',         // trailing comma
    '{"key": "value" "another"}',// missing comma
    '"unterminated string',      // string not closed
    '{bad: "json"}',             // unquoted key
    '01',                        // leading zero
    '1.',                        // trailing dot
    '1e',                        // incomplete exponent
    '["mismatch": "value"]'      // invalid syntax
];
