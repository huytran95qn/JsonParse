/**
 * Parses a JSON string and returns the corresponding JavaScript object.
 * This is a custom implementation similar to JSON.parse().
 * 
 * @param str - The JSON string to parse.
 * @returns The parsed JavaScript value.
 */
function jsonParse<T>(str: string): T {
    const n = str.length;
    let i = 0;

    // Utility: Check if a character is considered whitespace
    const isWhitespace = (c: string) =>
        c === ' ' || c === '\n' || c === '\r' || c === '\t';

    // Skips whitespace characters
    const skipWhitespace = () => {
        while (i < n && isWhitespace(str[i])) {
            i++;
        }
    };

    // Parses the literal 'true'
    const parseTrue = (): boolean => {
        if (str.slice(i, i + 4) !== "true") throw new Error("Invalid token: expected true");
        i += 4;
        return true;
    };

    // Parses the literal 'false'
    const parseFalse = (): boolean => {
        if (str.slice(i, i + 5) !== "false") throw new Error("Invalid token: expected false");
        i += 5;
        return false;
    };

    // Parses the literal 'null'
    const parseNull = (): null => {
        if (str.slice(i, i + 4) !== "null") throw new Error("Invalid token: expected null");
        i += 4;
        return null;
    };

    // Parses a JSON string, including escape sequences
    const parseString = (): string => {
        let s = "";

        if (str[i] !== '"') {
            debugger
            console.log(str[i])
            throw new Error("Expected '\"' at beginning of string")
        };
        i++; // Skip opening quote

        while (i < n) {
            const c = str[i];
            if (c === `"`) {
                i++; // Skip closing quote
                break;
            }

            if (c === "\\") {
                i++;
                const escapeChar = str[i];
                switch (escapeChar) {
                    case '"': s += '"'; break;
                    case '\\': s += '\\'; break;
                    case '/': s += '/'; break;
                    case 'b': s += '\b'; break;
                    case 'f': s += '\f'; break;
                    case 'n': s += '\n'; break;
                    case 'r': s += '\r'; break;
                    case 't': s += '\t'; break;
                    case 'u':
                        const hex = str.slice(i + 1, i + 5);
                        if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
                            throw new Error("Invalid Unicode escape");
                        }
                        s += String.fromCharCode(parseInt(hex, 16));
                        i += 4;
                        break;
                    default:
                        throw new Error(`Invalid escape character: \\${escapeChar}`);
                }
            } else {
                s += c;
            }
            i++;
        }

        return s;
    };

    // Parses a number (integer or floating point, with optional exponent)
    const parseNumber = (): number => {
        let s = "";
        if (str[i] === '-') {
            s += '-';
            i++;
        }

        while (i < n && /[0-9]/.test(str[i])) {
            s += str[i++];
        }

        if (str[i] === '.') {
            s += str[i++];
            while (i < n && /[0-9]/.test(str[i])) {
                s += str[i++];
            }
        }

        if (str[i] === 'e' || str[i] === 'E') {
            s += str[i++];
            if (str[i] === '+' || str[i] === '-') {
                s += str[i++];
            }
            while (i < n && /[0-9]/.test(str[i])) {
                s += str[i++];
            }
        }

        const num = parseFloat(s);
        if (isNaN(num)) throw new Error(`Invalid number: ${s}`);
        return num;
    };

    // Parses a JSON array
    const parseArray = (): any[] => {
        const arr: any[] = [];
        i++; // Skip opening '['

        skipWhitespace();
        while (i < n && str[i] !== ']') {
            arr.push(parseValue());
            skipWhitespace();
            if (str[i] === ',') {
                i++;
                skipWhitespace();
            } else if (str[i] !== ']') {
                throw new Error("Expected ',' or ']'");
            }
        }

        if (str[i] !== ']') throw new Error("Expected closing ']'");
        i++; // Skip closing ']'
        return arr;
    };

    // Parses a JSON object (key-value pairs)
    const parseObject = (): Record<string, any> => {
        const obj: Record<string, any> = {};
        i++; // Skip opening '{'

        skipWhitespace();
        while (i < n && str[i] !== '}') {
            const key = parseString();
            skipWhitespace();
            if (str[i] !== ':') throw new Error("Expected ':' after key");
            i++; // Skip ':'

            skipWhitespace();
            obj[key] = parseValue();
            skipWhitespace();

            if (str[i] === "!" || str[i] == "@") {
                i++;
                continue;
            }
            if (str[i] === ',') {
                i++;
                skipWhitespace();
            } else if (str[i] !== '}') {
                throw new Error("Expected ',' or '}'");
            }
        }

        if (str[i] !== '}') throw new Error("Expected closing '}'");
        i++; // Skip closing '}'
        return obj;
    };

    // Parses any valid JSON value (object, array, string, number, boolean, or null)
    const parseValue = (): any => {
        skipWhitespace();
        if (i >= n) throw new Error("Unexpected end of input");

        const c = str[i];
        switch (c) {
            case "@":
            case "!": {
                i++;
                return parseValue()
            }
            case '{': return parseObject();
            case '[': return parseArray();
            case '"': return parseString();
            case 't': return parseTrue();
            case 'f': return parseFalse();
            case 'n': return parseNull();
            default:  return parseNumber();
        }
    };

    // Start parsing from the root value
    skipWhitespace();
    const result = parseValue();
    skipWhitespace();

    if (i < n) throw new Error("Unexpected trailing characters");

    return result;
}
