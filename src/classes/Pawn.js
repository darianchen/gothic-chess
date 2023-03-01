import Piece from "./Piece";
import whitePawn from '../assets/Images/white_pawn.png';
import blackPawn from '../assets/Images/black_pawn.png';

class Pawn extends Piece {
    constructor(color,board,position){
        super(color,board,position);
        if(color==='white'){
            this.image = whitePawn;
        } else {
            this.image = blackPawn;
        }
    }

    notIntoCheck(r,c){
        // loop through this.board
        // check every enemy piece
        // see if enemy piece can attack king
    }

    availableMoves() {
        const [row, col] = this.position;
        const moves = [];
        const forwardDir = this.color === "white" ? -1 : 1; // the direction in which the pawn moves forward
        // const startRow = this.color === "white" ? 6 : 1; // the row on which the pawn starts
        // const newRow = row + forwardDir;
        // const doubleNextRow = row + 2 * forwardDir;
        if(!this.board[row+forwardDir][col]) moves.push([row+forwardDir,col]);
        if(!this.hasMoved && !this.board[row+2*forwardDir][col]) moves.push([row+2*forwardDir,col]);
        if(this.board[row+forwardDir][col+1]&&this.board[row+forwardDir][col+1].color!==this.color) moves.push([row+forwardDir,col+1]);
        if(this.board[row+forwardDir][col-1]&&this.board[row+forwardDir][col-1].color!==this.color) moves.push([row+forwardDir,col-1]);

        return moves;
    }
}

export default Pawn;