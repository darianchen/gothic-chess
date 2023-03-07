import Piece from "./Piece";
import whitePawn from '../assets/Images/white_pawn.png';
import blackPawn from '../assets/Images/black_pawn.png';
import Queen from "./Queen";
import Empress from "./Empress";
import Princess from "./Princess";
import Rook from "./Rook";
import Bishop from "./Bishop";
import Knight from "./Knight";


class Pawn extends Piece {
    constructor(color,board,position, hasMoved){
        super(color,board,position, hasMoved);
        if(color==='white'){
            this.image = whitePawn;
        } else {
            this.image = blackPawn;
        }
        this.prevPos = position;
        this.letter = '';
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
        if(!this.hasMoved && !this.board[row+forwardDir][col] && !this.board[row+2*forwardDir][col]) moves.push([row+2*forwardDir,col]);
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

        return moves;
    }

    // just for pawns, so they can have prevpos and promotion
    move(newPosition, promotion = true, ai = false){
        const [oldRow, oldCol] = this.position;
        const [newRow, newCol] = newPosition;

        if(newRow===0 || newRow===7){
            this.board[this.position[0]][this.position[1]] = null;
            let type;
            const pieces = ['q','e','p','r','b','k'];

            if(promotion && !ai){
                while(!pieces.includes(type)){
                    type = prompt('Select a new piece: Queen, Empress, Princess, Rook, Bishop, or Knight', 'Queen')[0].toLowerCase();
                } 
            }  else if(promotion && ai){
                type = pieces[Math.floor(Math.random()*pieces.length)];
            }      

            switch(type){   
                case 'q': new Queen(this.color,this.board,[newRow,newCol]); break;
                case 'e': new Empress(this.color,this.board,[newRow,newCol]); break;
                case 'p': new Princess(this.color,this.board,[newRow,newCol]); break;
                case 'r': new Rook(this.color,this.board,[newRow,newCol]); break;
                case 'b': new Bishop(this.color,this.board,[newRow,newCol]); break;
                case 'k': new Knight(this.color,this.board,[newRow,newCol]); break;
            }

        } else {
            this.prevPos = this.position; // this is the added line
            const prevDestination = this.board[newRow][newCol];
            const oldPosition = this.position;
            const oldHasMoved = this.hasMoved;
            this.board[newRow][newCol] = this; // destination
            this.board[oldRow][oldCol] = null; // origin
            this.position = newPosition;
            this.hasMoved = true;
            if(this.inCheck()) { 
                this.board[oldRow][oldCol] = this;
                this.position = oldPosition;
                this.board[newRow][newCol] = prevDestination;
                this.hasMoved = oldHasMoved;
                return false; 
            }
            if(oldCol !== newCol && !prevDestination){
                this.board[oldRow][newCol].delete();
            }
        }
        return [true, false]; // return true if legal move?
        // return false for castling
    }
}

export default Pawn;