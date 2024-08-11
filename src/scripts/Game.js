import { INVALID_MOVE } from "boardgame.io/core";

const BOARD_SIZE = 5;

export const TicTacToe = {
  setup: () => ({
    boardSize: BOARD_SIZE,
    cells: Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0)),
  }),

  moves: {
    clickCell: ({ G, playerID }, id) => {
      const [x, y] = id.split("-").map(Number);
      const cells = getCells(G, playerID);

      if (cells.length === 0) {
        if (G.cells[x][y] !== 0) {
          console.log(`${x}, ${y} is not empty`);
          return INVALID_MOVE;
        }

        G.cells[x][y] = playerID === "1" ? 3 : -3;
      } else {
        if (
          (playerID === "1" && G.cells[x][y] <= 0) ||
          (playerID === "0" && G.cells[x][y] >= 0)
        ) {
          console.log(`${x}, ${y} is not in ${playerID}'s cells`);
          return INVALID_MOVE;
        }

        G.cells[x][y] += playerID === "1" ? 1 : -1;
      }

      spreadCells(G, playerID);
    },
  },

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  endIf: ({ G, ctx }) => {
    const playerID = ctx.currentPlayer;
    const cells = getCells(G, playerID);
    if (cells.length === 0 && ctx.turn > 2) {
      return { winner: playerID === "1" ? "0" : "1" };
    }
  },

  ai: {
    enumerate: (G, ctx, playerID) => {
      let moves = [];
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (ctx.turn <= 2) {
            moves.push({ move: "clickCell", args: `${i}-${j}` });
          }
        }
      }

      if (ctx.turn > 2) {
        const cells = getCells(G, playerID);
        for (let cell of cells) {
          moves.push({ move: "clickCell", args: `${cell[0]}-${cell[1]}` });
        }
      }

      return moves;
    },
  },
};

function getCells(G, playerID) {
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

function processCell(G, x, y, value) {
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

function getFourCells(G, playerID) {
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

async function spreadCells(G, playerID) {
  while (true) {
    const cells = getFourCells(G, playerID);
    if (cells.length === 0) {
      break;
    }
    for (let cell of cells) {
      const [x, y] = cell;
      processCell(G, x, y, 0);

      const value = playerID === "1" ? 1 : -1;
      processCell(G, x - 1, y, value);
      processCell(G, x + 1, y, value);
      processCell(G, x, y - 1, value);
      processCell(G, x, y + 1, value);
    }
  }
}
