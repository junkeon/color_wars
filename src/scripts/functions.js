import { INVALID_MOVE } from "boardgame.io/core";

export function initializeCell({ G, playerID }, id) {
  const [x, y] = id.split("-").map(Number);

  if (G.cells[x][y] !== 0) {
    console.log(`${x}, ${y} is not empty`);
    return INVALID_MOVE;
  }

  G.cells[x][y] = playerID === "1" ? 3 : -3;
}

export function selectCell({ G, playerID }, id) {
  G.history = [];

  const [x, y] = id.split("-").map(Number);

  if (
    (playerID === "1" && G.cells[x][y] <= 0) ||
    (playerID === "0" && G.cells[x][y] >= 0)
  ) {
    console.log(`${x}, ${y} is not in ${playerID}'s cells`);
    return INVALID_MOVE;
  }

  G.cells[x][y] += playerID === "1" ? 1 : -1;

  spreadPlayerCells(G, playerID);
}

export function getPlayerCells(G, playerID) {
  const cells = [];
  for (let i = 0; i < G.boardSize; i++) {
    for (let j = 0; j < G.boardSize; j++) {
      if (
        (playerID === "1" && G.cells[i][j] > 0) ||
        (playerID === "0" && G.cells[i][j] < 0)
      ) {
        cells.push([i, j]);
      }
    }
  }
  return cells;
}

export function getCellsToSpread(G, playerID) {
  const cells = [];
  for (let i = 0; i < G.boardSize; i++) {
    for (let j = 0; j < G.boardSize; j++) {
      if (
        (playerID === "1" && G.cells[i][j] >= 4) ||
        (playerID === "0" && G.cells[i][j] <= -4)
      ) {
        cells.push([i, j]);
      }
    }
  }
  return cells;
}

export function updateCell(G, x, y, value) {
  if (x < 0 || x >= G.boardSize || y < 0 || y >= G.boardSize) {
    return;
  }

  if (value === 0) {
    G.cells[x][y] = 0;
  } else if (G.cells[x][y] === 0) {
    G.cells[x][y] = value;
  } else {
    G.cells[x][y] =
      value > 0
        ? Math.abs(G.cells[x][y]) + value
        : -Math.abs(G.cells[x][y]) + value;
  }
}

export async function spreadPlayerCells(G, playerID) {
  G.history.push(JSON.parse(JSON.stringify(G.cells)));
  while (true) {
    const cells = getCellsToSpread(G, playerID);
    if (cells.length === 0) {
      break;
    }
    G.history.push(JSON.parse(JSON.stringify(G.cells)));
    for (let cell of cells) {
      const [x, y] = cell;
      updateCell(G, x, y, 0);

      const value = playerID === "1" ? 1 : -1;
      updateCell(G, x - 1, y, value);
      updateCell(G, x + 1, y, value);
      updateCell(G, x, y - 1, value);
      updateCell(G, x, y + 1, value);
    }
    G.history.push(JSON.parse(JSON.stringify(G.cells)));
  }
}

export function getPossibleMoves(G, ctx, playerID) {
  let possibleMoves = [];
  for (let i = 0; i < G.boardSize; i++) {
    for (let j = 0; j < G.boardSize; j++) {
      if (ctx.phase === "init") {
        possibleMoves.push({ move: "initializeCell", args: `${i}-${j}` });
      }
    }
  }

  if (ctx.phase === "spread") {
    const cells = getPlayerCells(G, playerID);
    for (let cell of cells) {
      possibleMoves.push({
        move: "selectCell",
        args: `${cell[0]}-${cell[1]}`,
      });
    }
  }

  return possibleMoves;
}
