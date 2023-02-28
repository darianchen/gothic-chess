import Piece from "./Piece";
import whiterook from '../assets/whiterook.png';
import blackknight from '../assets/blackknight.png';

class Rook extends Piece {
    constructor(color,board,position){
        super(color,board,position);
        if(color==='white'){
            this.image = whiterook;
        } else {
            // this is for testing, darian please fix
            this.image = blackknight;
        }
    }

    availableMoves(){
        // returns an array of squares this piece can move to
    }

    canMove(newPos){
        // returns boolean whether this piece can move to new position
        return true;
    }
}

export default Rook;