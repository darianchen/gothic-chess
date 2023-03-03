import Piece from "./Piece";
import whiteKnight from '../assets/Images/white_knight.png';
import blackKnight from '../assets/Images/black_knight.png';

class Knight extends Piece {
    constructor(color,board,position){
        super(color,board,position);
        if(color==='white'){
            this.image = whiteKnight;
        } else {
            this.image = blackKnight;
        }
        this.letter = 'N';
    }

    availableMoves() {
        const [row, col] = this.position;
        const moves = [];

        const dirs = [[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,1],[-2,-1]];

        const check = (r,c,dir) => {
            const [newRow,newCol] = [r+dir[0],c+dir[1]];
            if(this.outOfBounds(newRow,newCol)) return;
            if(this.board[newRow][newCol]){
                if(this.board[newRow][newCol].color !== this.color) moves.push([newRow,newCol]);
            }
            else {
                moves.push([newRow, newCol]);
            }
        };

        for(let dir of dirs) check(row,col,dir);

        return moves;
    }
}

export default Knight;