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

    tokens: Array<{
        type: SqlTokens,
        text: string
    }> = [];

    startpos = 0;
    position = 0;

    constructor(statement: string) {
        this.statement = statement;
    }

    tokenize(): void {
        for (let c = 0; c < this.statement.length; c++) {
            const char = this.statement[c];
            if (c !== 0) this.advance();

            // Is it whitespace?
            if (this.selected().length === 1 && SqlWhitespaces.includes(char)) {
                this.skip();

                // Handle end of statement
            } else if (this.peek(1) === undefined) {
                // Is it nothing
                if (this.selected() === "") {
                    this.skip();
                    // Is it a string
                } else if (this.selected()[0].match(/"/)) {
                    // Is it the end of the string?
                    if (char.match(/"/)) {
                        this.cut(SqlTokens.Identifier);
                    } else SqlException("Unterminated string literal");
                    // Is it a space
                } else if (this.selected().length === 1 && char.match(/\s/)) {
                    this.skip();
                    // Is it a keyword
                } else if (SqlKeywords.includes(this.selected().toLowerCase())) {
                    this.cut(SqlTokens.Keyword);
                    // Otherwise, an identifier
                } else {
                    this.cut(SqlTokens.Identifier);
                }

                // Is it an operator?
            } else if (SqlOperators.includes(this.selected().toLowerCase())) {
                this.cut(SqlTokens.Operator);

                // Handle whitespace
            } else if (this.peek(1).match(/\s/)) {
                // Is the space in a string?
                if (this.selected()[0].match(/"/)
                ) {
                    // Is it the end of the string?
                    if (char.match(/"/)) {
                        this.cut(SqlTokens.Delimiter);
                    } else continue;
                    // Is the space empty?
                } else if (this.selected().length === 1) {
                    this.skip();
                    // Is selected a keyword?
                } else if (SqlKeywords.includes(this.selected().toLowerCase())) {
                    this.cut(SqlTokens.Keyword);
                    // Otherwise, an identifier
                } else {
                    this.cut(SqlTokens.Identifier);
                }
            }
        }
        console.log(this.tokens);
    }

    advance(): void {
        this.position++;
    }

    skip(): void {
        this.startpos = this.position + 1;
    }

    peek(index: number): string {
        return this.statement[this.position + index] ?? undefined;
    }

    selected(): string {
        return this.statement.substring(this.startpos, this.position + 1);
    }

    cut(tokenType: SqlTokens): void {
        this.tokens.push({
            type: tokenType,
            text: this.statement.substring(this.startpos, this.position + 1)
        });

        this.startpos = this.position + 1;
    }
}