

function Board (){
let board = [];
const column = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const row = [1, 2, 3, 4, 5, 6, 7, 8];

const renderBoard = () => {
    for(let i = row.length - 1; i >= 0; i--){
        let tempRow = []
        for(let j = 0; j < column.length - 1; j++){
            tempRow.push(`${column[j]}${column[i]}`);
        }
        board.push(tempRow);
    }
    return board
}

renderBoard()
return(
    <div>
        {board}
    </div>
)
}


export default Board;