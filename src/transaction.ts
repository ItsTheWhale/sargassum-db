import { Parser } from "./sql.ts";

export class Transaction {
    statements: string[] = [];

    constructor() {

    }

    addStatement(statement: string): void {
        this.statements.push(statement);
    }

    commit(): boolean {
        console.log('comit')
        console.log(this.statements);
        for (const statement of this.statements) {
            const parser = new Parser(statement);
            parser.tokenize();
        }
        return true;
    }
}