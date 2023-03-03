import Piece from "./Piece";
import whiteBishop from '../assets/Images/white_bishop.png';
import blackBishop from '../assets/Images/black_bishop.png';

class Bishop extends Piece {
    constructor(color,board,position){
        super(color,board,position);
        if(color==='white'){
            this.image = whiteBishop;
        } else {
            this.image = blackBishop;
        }
        this.letter = 'B';
    }

    availableMoves() {
        const [row, col] = this.position;
        const moves = [];

        const dirs = [[1,1],[1,-1],[-1,1],[-1,-1]];

        const check = (r,c,dir) => {
            const [newRow,newCol] = [r+dir[0],c+dir[1]];
            if(this.outOfBounds(newRow,newCol)) return;
            if(this.board[newRow][newCol]){
                if(this.board[newRow][newCol].color !== this.color) moves.push([newRow,newCol]);
                return;
            } else {
                moves.push([newRow,newCol]);
                check(newRow,newCol,dir);
            }
        };

        for(let dir of dirs) check(row,col,dir);

        return moves;
    }
}

export default Bishop;