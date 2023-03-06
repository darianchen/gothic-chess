import Piece from "./Piece";
import whitePrincess from '../assets/Images/white_princess.png';
import blackPrincess from '../assets/Images/black_princess.png';

class Princess extends Piece {
    constructor(color,board,position, hasMoved){
        super(color,board,position, hasMoved);
        if(color==='white'){
            this.image = whitePrincess;
        } else {
            this.image = blackPrincess;
        }
        this.letter = 'P';
    }

    availableMoves() {
        const [row, col] = this.position;
        const moves = [];

        const dirs = [[1,1],[1,-1],[-1,1],[-1,-1], [1,2],[2,1],[1,-2],[-2,1],[-1,2],[2,-1],[-2,-1],[-1,-2]];
        
        const check = (r,c,dir) => {
            const [newRow,newCol] = [r+dir[0],c+dir[1]];
            if(this.outOfBounds(newRow,newCol)) return;
            if(this.board[newRow][newCol]){
                if(this.board[newRow][newCol].color !== this.color) moves.push([newRow,newCol]);
                return;
            }
            else if (dir.some(d => Math.abs(d) === 2)) {
                moves.push([newRow,newCol]);
            } 
            else {
                moves.push([newRow,newCol]);
                check(newRow,newCol,dir);
            }
        };

        for(let dir of dirs) check(row,col,dir);

        return moves;
    }
}

export default Princess;