class Piece {
    constructor(color, board, position, image){
        this.color = color;
        this.board = board;
        this.position = position;
        this.image = image;
    }

    move(newPosition){
        const [oldRow, oldCol] = this.position;
        const [newRow, newCol] = newPosition;
        this.board[newRow][newCol] = this;
        this.board[oldRow][oldCol] = null;
        this.position = newPosition;
    }

    delete(){
        const[row, col] = this.position;
        this.board[row][col] = null;
    }
}

export default Piece;