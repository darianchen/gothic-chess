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
        const [oldRow, oldCol] = this.position;
        const [newRow, newCol] = newPosition;
        this.board[newRow][newCol] = this;
        this.board[oldRow][oldCol] = null;
        this.position = newPosition;
        this.hasMoved = true;

        return true; // return true if legal move?
    }

    delete(){
        const[row, col] = this.position;
        this.board[row][col] = null;
    }
}

export default Piece;