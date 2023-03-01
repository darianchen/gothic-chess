import Piece from "./Piece";
import whitePawn from '../assets/Images/white_pawn.png';
import blackPawn from '../assets/Images/black_pawn.png';

class Pawn extends Piece {
    constructor(color,board,position){
        super(color,board,position);
        if(color==='white'){
            this.image = whitePawn;
        } else {
            this.image = blackPawn;
        }
    }

    notIntoCheck(r,c){
        // loop through this.board
        // check every enemy piece
        // see if enemy piece can attack king
    }
}

export default Pawn;