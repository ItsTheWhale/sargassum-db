export function SqlException(message: string) {
    console.warn(message);
}

export enum SqlTokens {
    Delimiter = "delimiter",
    Keyword = "keyword",
    Identifier = "identifier",
    NumericConstant = "numericconstant",
    Operator = "operator"
}

export const SqlKeywords = [
    "add",
    "all",
    "alter",
    "and",
    "any",
    "as",
    "asc",
    "backup",
    "between",
    "case",
    "check",
    "column",
    "constraint",
    "create",
    "database",
    "default",
    "delete",
    "desc",
    "distinct",
    "drop",
    "exec",
    "exists",
    "foreign",
    "from",
    "full",
    "group",
    "having",
    "in",
    "index",
    "inner",
    "insert",
    "is",
    "join",
    "left",
    "like",
    "limit",
    "not",
    "or",
    "order",
    "outer",
    "primary",
    "procedure",
    "right",
    "rownum",
    "select",
    "set",
    "table",
    "top",
    "truncate",
    "union",
    "unique",
    "update",
    "values",
    "view",
    "where"
];

export const SqlOperators = [
    "+",
    "-",
    "*",
    "/",
    "%",
    "&",
    "|",
    "^",
    "=",
    ">",
    "<",
    ">=",
    "<=",
    "<>",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "&=",
    "^-=",
    "|*="
];

export const SqlWhitespaces = [
    ' ',
    '\t',
    '\n'
];

export class Parser {
    statement = "";

    error = false;

    tokens: Array<{
        type: SqlTokens,
        text: string
    }> = [];

    constructor(statement: string) {
        this.statement = statement;
    }

    tokenize(): void {
        const statement = this.statement;

        let tokens: Array<{
            type: SqlTokens,
            text: string
        }> = [];

        let startpos = 0;
        let position = 0;


        function advance(): void {
            position++;
        }

        function skip(): void {
            startpos = position + 1;
        }

        function peek(index: number): string {
            return statement[position + index] ?? undefined;
        }

        function selected(): string {
            return statement.substring(startpos, position + 1);
        }

        function cut(tokenType: SqlTokens): void {
            tokens.push({
                type: tokenType,
                text: statement.substring(startpos, position + 1)
            });

            startpos = position + 1;
        }

        for (let c = 0; c < statement.length; c++) {
            if (this.error) break;

            const char = statement[c];
            if (c !== 0) advance();

            // Is it whitespace?
            if (selected().length === 1 && SqlWhitespaces.includes(char)) {
                skip();

                // Handle end of statement
            } else if (peek(1) === undefined) {
                // Is it nothing
                if (selected() === "") {
                    skip();
                    // Is it a string
                } else if (selected()[0].match(/"/)) {
                    // Is it the end of the string?
                    if (char.match(/"/)) {
                        cut(SqlTokens.Identifier);
                    } else {
                        SqlException("Unterminated string literal");
                        this.error = true;
                    }
                    // Is it a space
                } else if (selected().length === 1 && char.match(/\s/)) {
                    skip();
                    // Is it a keyword
                } else if (SqlKeywords.includes(selected().toLowerCase())) {
                    cut(SqlTokens.Keyword);
                    // Otherwise, an identifier
                } else {
                    cut(SqlTokens.Identifier);
                }

                // Is it an operator?
            } else if (SqlOperators.includes(selected().toLowerCase())) {
                cut(SqlTokens.Operator);

                // Handle whitespace
            } else if (peek(1).match(/\s/)) {
                // Is the space in a string?
                if (selected()[0].match(/"/)
                ) {
                    // Is it the end of the string?
                    if (char.match(/"/)) {
                        cut(SqlTokens.Delimiter);
                    } else continue;
                    // Is the space empty?
                } else if (selected().length === 1) {
                    skip();
                    // Is selected a keyword?
                } else if (SqlKeywords.includes(selected().toLowerCase())) {
                    cut(SqlTokens.Keyword);
                    // Otherwise, an identifier
                } else {
                    cut(SqlTokens.Identifier);
                }
            }
        }
        this.tokens = tokens;
    }

    eval(): void {
        this.tokenize();
        console.log(this.tokens);
    }
}