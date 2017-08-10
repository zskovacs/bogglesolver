import { Trie } from "./trie";
import { Board } from "./board";

export class Boggle {
    /**
     * Creates a Boggle board with the specified number of columns and
     * rows inside the given div element.
     */
    createBoard(rows: number, cols: number, div: JQuery): Board {
        var board = new Board(rows, cols);

        var count = 0;
        for (var r = 0; r < rows; r++) {
            var row = $('<div class="row"></div>');
            for (var c = 0; c < cols; c++) {
                var cell = $('<input type="text" ' +
                    'id="cell' + (count++) + '" ' +
                    'class="cell" ' +
                    'maxlength="1" ' +
                    'data-row="' + r + '" ' +
                    'data-col="' + c + '" ' +
                    '/>');

                row.append(cell);
            }
            div.append(row);
        }

        function onCellChanged() {
            var row = $(this).data('row'), col = $(this).data('col');
            board.charAt(row, col, ($(this).val() as string).toUpperCase());
        };

        // Update model when cell letter changed
        $('.boggle-board .cell').keyup(onCellChanged)
            .change(onCellChanged);
        $('.boggle-board .cell').keyup(function () {
        });

        return board;
    }

    /**
     * Solves a Boggle board using the given trie as a dictionary.
     */
    solve(board: Board, trie: Trie): string[] {
        var rows = board.getNumRows();
        var cols = board.getNumCols();

        var charStack = new Array<string>();
        var words = new Array<string>();

        function findWords(row: number, col: number, node: Trie) {

            if (visited[row][col])
                return;
            if (!node || !node.has(board.charAt(row, col)))
                return;

            node = node.next(board.charAt(row, col));

            charStack.push(board.charAt(row, col));
            visited[row][col] = true;

            for (var dx = -1; dx <= 1; dx++) {
                var c = col + dx;
                if (c < 0 || c >= cols) continue;

                for (var dy = -1; dy <= 1; dy++) {
                    var r = row + dy;
                    if (r < 0 || r >= rows) continue;
                    if (dx == 0 && dy == 0) continue;

                    findWords(r, c, node);
                }
            }

            if (node.isEndOfWord) {
                var s = "";
                for (var i = 0; i < charStack.length; i++) {
                    s = s + charStack[i];
                }
                words.push(s);
            }

            visited[row][col] = false;
            charStack.pop();
        };

        var visited: boolean[][] = new Array(rows);
        for (var row = 0; row < rows; row++) {
            visited[row] = new Array(cols);
            for (var col = 0; col < cols; col++) {
                visited[row][col] = false;
            }
        }

        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                findWords(r, c, trie);
            }
        }
        return words;
    };
};