export class Transaction {
    statements: string[] = [];

    constructor() {

    }

    addStatement(statement: string): void {
        this.statements.push(statement);
    }

    commit(): boolean {
        return true;
    }
}