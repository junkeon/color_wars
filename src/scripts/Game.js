import { INVALID_MOVE } from "boardgame.io/core";

const BOARD_SIZE = 5;

export const ColorWar = {
  setup: () => ({
    boardSize: BOARD_SIZE,
    cells: Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0)),
  }),

  phases: {
    init: {
      moves: { initializeCell },
      start: true,
      endIf: ({ G }) => {
        const cells = getPlayerCells(G, "1");
        return cells.length === 1;
      },
      next: "spread",
    },
    spread: {
      moves: { selectCell },
    },
  },

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  endIf: ({ G, ctx }) => {
    const playerID = ctx.currentPlayer;
    const cells = getPlayerCells(G, playerID);
    if (cells.length === 0 && ctx.turn > 2) {
      return { winner: playerID === "1" ? "0" : "1" };
    }
  },

  ai: {
    enumerate: (G, ctx, playerID) => {
      let possibleMoves = [];
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (ctx.turn <= 2) {
            possibleMoves.push({ move: "selectCell", args: `${i}-${j}` });
          }
        }
      }

      if (ctx.turn > 2) {
        const cells = getPlayerCells(G, playerID);
        for (let cell of cells) {
          possibleMoves.push({
            move: "selectCell",
            args: `${cell[0]}-${cell[1]}`,
          });
        }
      }

      return possibleMoves;
    },
  },
};

function initializeCell({ G, playerID }, id) {
  const [x, y] = id.split("-").map(Number);

  if (G.cells[x][y] !== 0) {
    console.log(`${x}, ${y} is not empty`);
    return INVALID_MOVE;
  }

  G.cells[x][y] = playerID === "1" ? 3 : -3;
}

function selectCell({ G, playerID }, id) {
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

function getPlayerCells(G, playerID) {
  const cells = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
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

function updateCell(G, x, y, value) {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
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

function getCellsToSpread(G, playerID) {
  const cells = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function spreadPlayerCells(G, playerID) {
  while (true) {
    const cells = getCellsToSpread(G, playerID);
    if (cells.length === 0) {
      break;
    }
    for (let cell of cells) {
      const [x, y] = cell;
      updateCell(G, x, y, 0);

      const value = playerID === "1" ? 1 : -1;
      updateCell(G, x - 1, y, value);
      updateCell(G, x + 1, y, value);
      updateCell(G, x, y - 1, value);
      updateCell(G, x, y + 1, value);
    }
  }
}
