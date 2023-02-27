import './index.css';
import whiterook from '../../assets/whiterook.png';
import blackknight from '../../assets/blackknight.png';

function Board (){

    const rook = {icon: whiterook};
    const knight = {icon: blackknight}
    const testBoard = [
        [null,null,null,null,null,null,null,null,null,null,],
        [null,rook,null,null,rook,null,null,null,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
        [null,null,knight,null,null,null,null,knight,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
    ];

    const column = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    const row = [1, 2, 3, 4, 5, 6, 7, 8];
    const colors = ['white','black'];

    let theBoard = testBoard;


    console.log(rook.icon)
    return(
        <>
            <h1>This is the Board</h1>
            <div>
                {theBoard.map((theRow,rowIdx)=>{
                    return <div className="row" key={rowIdx}>
                        {theRow.map( (theCol,colIdx)=>{
                            return <div className="tile" id={colors[(rowIdx+colIdx)%2]} key={colIdx}>
                                {theBoard[rowIdx][colIdx] ? <img src={theBoard[rowIdx][colIdx].icon}></img> : ''}
                            </div>
                        })}
                    </div>
                })}
            </div>
        </>
    )

}


export default Board;