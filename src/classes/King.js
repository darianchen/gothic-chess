import Piece from "./Piece";
import whiteKing from '../assets/Images/white_king.png';
import blackKing from '../assets/Images/black_king.png';
import whiteKingChecked from '../assets/Images/white_king_check.png';
import blackKingChecked from '../assets/Images/black_king_check.png';

class King extends Piece {
    constructor(color,board,position){
        super(color,board,position);
        if(color==='white'){
            this.image = whiteKing;
        } else {
            this.image = blackKing;
        }
        this.isKing = true;
        this.letter = 'K';
    }

    availableMoves(skipCastle = false) {
        this.image = (this.color === 'white' && this.image === whiteKingChecked) ? whiteKing :
        (this.color === 'black' && this.image === blackKingChecked) ? blackKing :this.image;

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

        if(!skipCastle){
            for(let side of [-1,1]){
                const rookCol = side === -1 ? 0 : 9
                if(!this.hasMoved && this.board[row][rookCol] && !this.board[row][rookCol].hasMoved){
                    let canCastle = true;
                    for(let colChange = 0; colChange < 4; colChange++) 
                    if(this.inCheck(row,col + (colChange * side))) canCastle = false;
                    if(canCastle) moves.push([row, col + (3 * side)]);
                }
            }
        };        
        return moves;
    }              
};

export default King;