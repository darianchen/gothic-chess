import Piece from "./Piece";
import whiteKing from '../assets/Images/white_king.png';
import blackKing from '../assets/Images/black_king.png';

class King extends Piece {
    constructor(color,board,position){
        super(color,board,position);
        if(color==='white'){
            this.image = whiteKing;
        } else {
            this.image = blackKing;
        }
        this.isKing = true;
    }

    availableMoves() {
        const [row, col] = this.position;
        const moves = [];

        const dirs = [[0,1],[0,-1],[-1,0],[1,0],[-1,1],[-1,-1],[1,1],[1,-1]];

        const check = (r,c,dir) => {
            const [newRow,newCol] = [r+dir[0],c+dir[1]];
            if(this.outOfBounds(newRow,newCol)) return;
            if(this.board[newRow][newCol]){
                if(this.board[newRow][newCol].color !== this.color) moves.push([newRow,newCol]);
            }
            else{
                moves.push([newRow, newCol]);
            }            
        };

        for(let dir of dirs) check(row,col,dir);

        // add castling to moves
        return moves;
    }
}

export default King;