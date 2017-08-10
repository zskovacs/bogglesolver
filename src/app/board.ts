export class Board {
    private rows: number;
    private cols: number;
    private board: string[][];

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;

        this.board = new Array(rows);

        for (var i = 0; i < rows; i++) {
            this.board[i] = new Array(cols);
            for (var j = 0; j < cols; j++) {
                this.board[i][j] = '';
            }
        };
    }

    public getNumRows(): number {
        return this.rows;
    };

    public getNumCols(): number {
        return this.cols;
    };

    public charAt(row: number, col: number, val?: string): string {
        if (val != undefined) {
            this.board[row][col] = val.toUpperCase();
        }
        return this.board[row][col];
    };
}