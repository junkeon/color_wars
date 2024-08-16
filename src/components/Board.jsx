import React, { useEffect, useState } from "react";

import redDots1 from "../assets/images/dots/redDots1.png";
import redDots2 from "../assets/images/dots/redDots2.png";
import redDots3 from "../assets/images/dots/redDots3.png";
import redDots4 from "../assets/images/dots/redDots4.png";

import blueDots1 from "../assets/images/dots/blueDots1.png";
import blueDots2 from "../assets/images/dots/blueDots2.png";
import blueDots3 from "../assets/images/dots/blueDots3.png";
import blueDots4 from "../assets/images/dots/blueDots4.png";



export function ColorWarBoard({ ctx, G, moves }) {
  const [history, setHistory] = useState([]);

  const redCellImages = [redDots1, redDots2, redDots3, redDots4];
  const blueCellImages = [blueDots1, blueDots2, blueDots3, blueDots4];

  useEffect(() => {
    setHistory(G.history);
  }, [G.history]);

  useEffect(() => {
    if (history.length > 0) {
      const timer = setTimeout(() => {
        setHistory((prevHistory) => prevHistory.slice(1));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [history]);

  const onClick = (id) => {
    if (ctx.phase === "init") {
      moves.initializeCell(id);
    } else {
      moves.selectCell(id);
    }
  };

  const renderWinner = () => {
    if (ctx.gameover && history.length === 0) {
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
    width: "150px",
    height: "150px",
    lineHeight: "150px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "50px",
    margin: "10px",
    boxSizing: "border-box",
  };

  const renderCell = (cells, i, j, isPlayerable) => {
    const cellValue = cells[i][j];
    const isCurrentPlayerCell = (cellValue > 0 && ctx.currentPlayer === "1") || (cellValue < 0 && ctx.currentPlayer === "0");
    const cellColor = cellValue > 0 ? "red" : "blue";
    const borderWidth = isCurrentPlayerCell && history.length === 0 ? "3px" : "1px";

    return (
      <td key={`${i}-${j}`}>
        <div
          style={{ ...cellStyle, color: cellColor, borderWidth, cursor: isPlayerable ? "pointer" : "default" }}
          onClick={() => isPlayerable ? onClick(`${i}-${j}`) : null}
        >
          {cellValue === 0 ? (
            ""
          ) : (
            cellValue > 0 ? (
              <img src={redCellImages[Math.min(Math.abs(cellValue) - 1, 4)]} alt="dots" width="90%" height="90%" />
            ) : (
              <img src={blueCellImages[Math.min(Math.abs(cellValue) - 1, 4)]} alt="dots" width="90%" height="90%" />
            )
          )}
        </div>
      </td>
    );
  };

  const [board, setBoard] = useState([]);

  useEffect(() => {
    const renderBoard = () => {
      let tbody = [];
      const cellsData = history.length > 0 ? history[0] : G.cells;

      for (let i = 0; i < G.boardSize; i++) {
        let cells = [];
        for (let j = 0; j < G.boardSize; j++) {
          cells.push(renderCell(cellsData, i, j, history.length === 0));
        }
        tbody.push(<tr key={i}>{cells}</tr>);
      }

      setBoard(tbody);
    };

    renderBoard();
  }, [G, history]);

  return (
    <div style={{ backgroundColor: "#e0e0e0", padding: "30px", borderRadius: "40px", boxShadow: "0 15px 12px rgba(0, 0, 0, 0.6)" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", flexDirection: "column" }}>
        <table id="board" style={{ borderCollapse: "collapse", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", backgroundColor: "#fff", borderRadius: "10px", overflow: "hidden" }}>
          <tbody>{board}</tbody>
        </table>
        <div style={{ marginTop: "30px", fontSize: "28px", fontWeight: "bold", color: "#444", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
          {renderWinner()}
        </div>
      </div>
    </div>
  );
}