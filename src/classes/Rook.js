import Piece from "./Piece";
import whiterook from '../assets/Images/white_rook.png';
import blackrook from '../assets/Images/black_rook.png';

class Rook extends Piece {
    constructor(color,board,position){
        super(color,board,position);
        if(color==='white'){
            this.image = whiterook;
        } else {
            this.image = blackrook;
        }
    }

    availableMoves() {
        const [row, col] = this.position;
        const moves = [];

        // Check moves to the top of the board
        const checkUp = (row, col) => {
            if (row < 0) return;
            const piece = this.board[row][col];
            if (!piece || piece.color !== this.color) {
                moves.push([row, col]);
            }
            if (!piece) {
                checkUp(row - 1, col);
            }
        };
        checkUp(row - 1, col);

        // Check moves to the bottom of the board
        const checkDown = (row, col) => {
            if (row >= this.board.length) return;
            const piece = this.board[row][col];
            if (!piece || piece.color !== this.color) {
                moves.push([row, col]);
            }
            if (!piece) {
                checkDown(row + 1, col);
            }
        };
        checkDown(row + 1, col);

        // Check moves to the left of the board
        const checkLeft = (row, col) => {
            if (col < 0) return;
            const piece = this.board[row][col];
            if (!piece || piece.color !== this.color) {
                moves.push([row, col]);
            }
            if (!piece) {
                checkLeft(row, col - 1);
            }
        };
        checkLeft(row, col - 1);

        // Check moves to the right of the board
        const checkRight = (row, col) => {
            if (col >= this.board[0].length) return;
            const piece = this.board[row][col];
            if (!piece || piece.color !== this.color) {
                moves.push([row, col]);
            }
            if (!piece) {
                checkRight(row, col + 1);
            }
        };
        checkRight(row, col + 1);

        return moves;
    }

    canMove(newPos) {
        const moves = this.availableMoves();
        return moves.some(move => move[0] === newPos[0] && move[1] === newPos[1]);
    }
}

export default Rook;