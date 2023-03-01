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
        this.prevPos = position;
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

        // regular moves
        if(!this.board[row+forwardDir][col]) moves.push([row+forwardDir,col]);
        if(!this.hasMoved && !this.board[row+2*forwardDir][col]) moves.push([row+2*forwardDir,col]);
        if(this.board[row+forwardDir][col+1]&&this.board[row+forwardDir][col+1].color!==this.color) moves.push([row+forwardDir,col+1]);
        if(this.board[row+forwardDir][col-1]&&this.board[row+forwardDir][col-1].color!==this.color) moves.push([row+forwardDir,col-1]);

        // en passant
        for(let side of [1,-1]){
            if(this.outOfBounds(row,col+side) || !this.board[row][col+side]) continue;
            let other = this.board[row][col+side];
            if(other.color!==this.color && other.prevPos && other.prevPos[0]===row+2*forwardDir){
                moves.push([row+forwardDir,col+side]);
            }
        }

        // promotion

        return moves;
    }

    // just for pawns, sothey can have prevpos
    move(newPosition){
        const [oldRow, oldCol] = this.position;
        const [newRow, newCol] = newPosition;
        this.board[newRow][newCol] = this;
        this.board[oldRow][oldCol] = null;
        this.prevPos = this.position; // this is the added line
        this.position = newPosition;
        this.hasMoved = true;

        return true; // return true if legal move?
    }
}

export default Pawn;