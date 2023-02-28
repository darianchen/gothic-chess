import Piece from "./Piece";
import whiteKing from '../assets/Images/white_king.png';
import blackKing from '../assets/Images/black_king.png';

class Knight extends Piece {
    constructor(color,board,position){
        super(color,board,position);
        if(color==='white'){
            this.image = whiteKing;
        } else {
            this.image = blackKing;
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

        const dirs = [[1,1],[1,0],[1,-1],[0,1],[0,-1],[-1,1],[-1,0],[-1,-1],];

        const check = (r,c,dir) => {
            const [newRow,newCol] = [r+dir[0],c+dir[1]];
            if(!this.outOfBounds(newRow,newCol)) moves.push([newRow,newCol]);
        };

        for(let dir of dirs) check(row,col,dir);

        // add castling to moves


        return moves;
    }

    canMove(newPos) {
        const moves = this.availableMoves();
        return moves.some(move => move[0] === newPos[0] && move[1] === newPos[1]);
    }
}

export default King;