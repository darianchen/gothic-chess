class Piece {
    constructor(color, board, position){
        this.color = color;
        this.board = board;
        this.position = position

        this.board[position[0]][position[1]] = this;
    }

    move(newPosition){
        const [oldRow, oldCol] = this.position;
        const [newRow, newCol] = newPosition;
        this.board[newRow][newCol] = this;
        this.board[oldRow][oldCol] = null;
        this.position = newPosition;

        return true; // return true if legal move?
    }

    delete(){
        const[row, col] = this.position;
        this.board[row][col] = null;
    }
}

export default Piece;