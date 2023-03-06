function MoveLog(props) {
    let moveLog = props.moveLog;
    // let turn = props.turn;

    const moves = moveLog.map((row,id)=>{
        return <tr key={id}>
            <td>{row[0]}</td>
            <td>{row[1]}</td>
            <td>{row[2]}</td>
        </tr>
    });

    return(<>
        {/* <h1>Turn {turn} of {moveLog.length}</h1> */}
        <table>
            <thead>
                <tr><th>Move</th><th>White</th><th>Black</th></tr>
            </thead>
            <tbody>
                {moves}
            </tbody>
        </table>
    </>)

}

export default MoveLog;