class Piece {
    constructor(color, board, position, hasMoved=false){
        this.color = color;
        this.board = board;
        this.position = position
        this.board[position[0]][position[1]] = this;
        this.hasMoved = hasMoved;
    }

    outOfBounds(r,c){
        return r<0||c<0||r>7||c>9;
    }

    move(newPosition,board=this.board){
        let castle = false;
        // kingside
        if(this.isKing && !this.hasMoved && newPosition[1] - this.position[1] === 3) {
            board[newPosition[0]][9].move([newPosition[0],7]); // change the position of the rook
            castle = true;
        // queenside
        } else if(this.isKing && !this.hasMoved && newPosition[1] === 2) {
            board[newPosition[0]][0].move([newPosition[0],3]); // change the position of the rook
            castle = true;
        }

        // we should get rid of all this
        const [oldRow, oldCol] = this.position;
        const [newRow, newCol] = newPosition;
        const prevDestination = board[newRow][newCol];
        const oldPosition = this.position;
        const oldHasMoved = this.hasMoved;
        board[newRow][newCol] = this; // destination
        board[oldRow][oldCol] = null; // origin
        this.position = newPosition;
        this.hasMoved = true;
        if(this.inCheck()) { 
            board[oldRow][oldCol] = this;
            this.position = oldPosition;
            board[newRow][newCol] = prevDestination;
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

    inCheck(targetRow,targetCol, board=this.board){
        if(!targetRow||!targetCol){
            for(let row = 0; row < 8; row++){
                for(let col = 0; col < 10; col++){
                    if(board[row][col] && board[row][col].color === this.color && board[row][col].isKing){
                        targetRow = row;
                        targetCol = col;
                    }
                }
            }
        };

        for(let row = 0; row < 8; row++){
            for(let col = 0; col < 10; col++){
                const piece = board[row][col];

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

    // constructors = {
    //     '': Pawn,
    //     'R': Rook,
    //     'N': Knight,
    //     'B': Bishop,
    //     'E': Empress,
    //     'K': King,
    //     'P': Princess,
    //     'Q': Queen,
    // }

    // filterMoves(moves){
    //     const filtered = [];

    //     for(let move of moves){
    //         const boardCopy = new Array(board.length).fill().map(()=> new Array(board[0].length).fill(null));
    //         for(let r=0;r<board.length;r++){
    //             for(let c=0;c<board[0].length;c++){
    //                 if(board[r][c]){
    //                     let pieceCopy = {...board[r][c]};
                        
    //                     boardCopy[r][c] = new constructors[pieceCopy.letter](pieceCopy.color,theBoard,[r,c],pieceCopy.hasMoved);
    //                 }
    //             }
    //         }

    //         const pieceCopy = boardCopy[this.position[0]][this.position[1]];
    //         pieceCopy.move(move[0],move[1],boardCopy);
    //         if(!pieceCopy.inCheck(null,null,boardCopy)) filtered.push(move);
    //     }

    //     return filtered;
    // }

}

export default Piece;