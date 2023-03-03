class Piece {
    constructor(color, board, position){
        this.color = color;
        this.board = board;
        this.position = position
        this.board[position[0]][position[1]] = this;
        this.hasMoved = false;
    }

    outOfBounds(r,c){
        return r<0||c<0||r>7||c>9;
    }

    move(newPosition){
        let castle = false;
        // kingside
        if(this.isKing && !this.hasMoved && newPosition[1] === 8) {
            this.board[newPosition[0]][9].move([newPosition[0],7]); // change the position of the rook
            castle = true;
        // queenside
        } else if(this.isKing && !this.hasMoved && newPosition[1] === 2) {
            this.board[newPosition[0]][0].move([newPosition[0],3]); // change the position of the rook
            castle = true;
        }
        const [oldRow, oldCol] = this.position;
        const [newRow, newCol] = newPosition;
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
        return [true, castle]; // return true if legal move?
        // return false for castling
    }

    delete(){
        const[row, col] = this.position;
        this.board[row][col] = null;
    }

    canMove(newPos) {
        const moves = this.availableMoves();
        return moves.some(move => move[0] === newPos[0] && move[1] === newPos[1]);
    }

    inCheck(targetRow,targetCol){
        if(targetRow === undefined || targetCol === undefined){
            for(let row = 0; row < 8; row++){
                for(let col = 0; col < 10; col++){
                    if(this.board[row][col] && this.board[row][col].color === this.color && this.board[row][col].isKing){
                        targetRow = row;
                        targetCol = col;
                    }
                }
            }
        };

        for(let row = 0; row < 8; row++){
            for(let col = 0; col < 10; col++){
                const piece = this.board[row][col];

                if (piece && piece.color !== this.color && piece.availableMoves(true).some(move => {
                    const [r, c] = move;
                    return r === targetRow && c === targetCol;
                  })) {
                    return true;
                  }
            }
        };
        return false;
    }
}

export default Piece;