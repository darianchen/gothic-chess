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

        // castling
        // check if piece is king
        // check if other piece is rook
        // check if king has moved
        // check if king is in check
        // check if rook has moved
        // check if squares between are empty
        // check if squares king moving through are in check
        // finally, move king and rook

        const isUnderAttack = this.isUnderAttack.bind(this);
        const color = this.color === 'white' ? 'black' : 'white';
        // kingside 
        if(this.isKing && !this.hasMoved && this.board[row][9] && !this.board[row][9].hasMoved && this.board[row][9].isRook
        && !this.board[row][6] && !this.board[row][7] && !this.board[row][8]
        && isUnderAttack(row,6, color)
        && isUnderAttack(row,7,color)
        && isUnderAttack(row,8,color)
        ){
           moves.push([row,8]);
        } 
        // queenside
        else if(this.isKing && !this.hasMoved && this.board[row][0] && !this.board[row][0].hasMoved && this.board[row][0].isRook
        && !this.board[row][1] && !this.board[row][2] && !this.board[row][3] && !this.board[row][4]
        && isUnderAttack(row,2,color)
        && isUnderAttack(row,3,color)
        && isUnderAttack(row,4,color)){
            moves.push([row,2]);
        }
        return moves;
        }

        isUnderAttack(row, col, color) {
            // check if the specified position is being attacked by a piece of the specified color
            for (let r = 0; r < 8; r++) {
              for (let c = 0; c < 10; c++) {
                const piece = this.board[r][c];
                if (piece && piece.color !== color) {
                  if (piece instanceof King) {
                    // Kings can only move one square in any direction and cannot move into check
                    const kingDirs = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [-1,-1], [1,-1], [-1,1]];
                    for (let [dr, dc] of kingDirs) {
                      const [newRow, newCol] = [r + dr, c + dc];
                      if (!this.outOfBounds(newRow, newCol) && this.board[newRow][newCol] === this) {
                        return true;
                      }
                    }
                  } else {
                    const moves = piece.availableMoves();
                    if (moves.some(move => move[0] === row && move[1] === col)) {
                      return true;
                    }
                  }
                }
              }
            }
            return false;
        }                      
};

export default King;