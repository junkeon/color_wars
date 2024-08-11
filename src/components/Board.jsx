import React from "react";

export function ColorWarBoard({ ctx, G, moves }) {

  const onClick = (id) => {
    if (ctx.phase === "init") {
      moves.initializeCell(id);
    } else {
      moves.selectCell(id);
    }
  };

  const renderWinner = () => {
    if (ctx.gameover) {
      return (
        <div id="winner">
          {ctx.gameover.winner !== undefined ? `Winner: ${ctx.gameover.winner}` : "Draw!"}
        </div>
      );
    }
    return null;
  };

  const cellStyle = {
    border: "1px solid #555",
    borderRadius: "20px",
    width: "150px", // 150px inner border
    height: "150px", // 150px inner border
    lineHeight: "150px", // 150px inner border
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "50px",
    margin: "10px",
    boxSizing: "border-box", // include border in the element's total width and height

  };

  const renderCell = (i, j) => {
    const cellValue = G.cells[i][j];
    const isCurrentPlayerCell = (cellValue > 0 && ctx.currentPlayer === "1") || (cellValue < 0 && ctx.currentPlayer === "0");
    const cellColor = cellValue > 0 ? "red" : "blue";
    const borderWidth = isCurrentPlayerCell ? "3px" : "1px";

    return (
      <td key={`${i}-${j}`}>
        <div
          style={{ ...cellStyle, color: cellColor, borderWidth, cursor: "pointer" }}
          onClick={() => onClick(`${i}-${j}`)}
        >
          {cellValue === 0 ? "" : cellValue}
        </div>
      </td>
    );
  };

  const renderBoard = () => {
    let tbody = [];
    for (let i = 0; i < G.boardSize; i++) {
      let cells = [];
      for (let j = 0; j < G.boardSize; j++) {
        cells.push(renderCell(i, j));
      }
      tbody.push(<tr key={i}>{cells}</tr>);
    }
    return tbody;
  };

  return (
    <div style={{ backgroundColor: "#e0e0e0", padding: "30px", borderRadius: "40px", boxShadow: "0 15px 12px rgba(0, 0, 0, 0.6)" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", flexDirection: "column" }}>
        <table id="board" style={{ borderCollapse: "collapse", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", backgroundColor: "#fff", borderRadius: "10px", overflow: "hidden" }}>
          <tbody>{renderBoard()}</tbody>
        </table>
        <div style={{ marginTop: "30px", fontSize: "28px", fontWeight: "bold", color: "#444", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
          {renderWinner()}
        </div>
      </div>
    </div>
  );
}
