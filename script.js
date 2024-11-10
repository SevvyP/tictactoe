/*
 ** The Gameboard represents the gameboard for the Tic Tac Toe game.
 ** It is a 3x3 grid of Cells, and we expose a few methods for interacting with the gameboard.
 */
function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // create the 2d array of Cells
  // 0,0 represents the top left corner of the board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // get the current state of the board
  const getBoard = () => board;

  // make a move on the board
  const makeMove = (row, column, player) => {
    const cell = board[row][column];
    // if the cell is filled, prevent the move
    if (cell.getValue() !== 0) {
      throw new Error("Select an empty cell!");
    }
    // otherwise, update the cell with the player's token
    cell.addToken(player);
  };

  // print the board to console for debugging
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, makeMove, printBoard };
}

/*
 ** a Cell represents a single square on the gameboard, and can have a value of:
 ** 0: empty
 ** 1: player 1 - X
 ** 2: player 2 - O
 */
function Cell() {
  let value = 0;

  // change the value of the cell to the given player
  const addToken = (player) => {
    value = player;
  };

  // get the current value of the cell
  const getValue = () => value;

  return { addToken, getValue };
}

/*
 ** The GameController is responsible for managing the game state and logic.
 */
function GameController(playerOneName, playerTwoName) {
  const currentBoard = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];

  let currentPlayer = players[0];

  // flipCoin can be utilized to randomize the starting player if desired
  const flipCoin = () => {
    const result = Math.random() < 0.5 ? 0 : 1;
    currentPlayer = players[result];
  };

  // switch player turn, to be used after each move
  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const getCurrentPlayer = () => currentPlayer;

  const setPlayerNames = (playerOneName, playerTwoName) => {
    players[0].name = playerOneName;
    players[1].name = playerTwoName;
  };

  const printNewRound = () => {
    currentBoard.printBoard();
    console.log(`${currentPlayer.name}'s turn`);
  };

  const isWinState = () => {
    const board = currentBoard.getBoard();
    const size = board.length;

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      for (let columnIndex = 0; columnIndex < size; columnIndex++) {
        const cell = board[rowIndex][columnIndex];

        // check for horizontal win
        if (columnIndex <= size - 3) {
          if (
            cell.getValue() === currentPlayer.token &&
            cell.getValue() === board[rowIndex][columnIndex + 1].getValue() &&
            cell.getValue() === board[rowIndex][columnIndex + 2].getValue()
          ) {
            return true;
          }
        }

        // check for vertical win
        if (rowIndex <= size - 3) {
          if (
            cell.getValue() === currentPlayer.token &&
            cell.getValue() === board[rowIndex + 1][columnIndex].getValue() &&
            cell.getValue() === board[rowIndex + 2][columnIndex].getValue()
          ) {
            return true;
          }
        }

        // check for diagonal win (top-left to bottom-right)
        if (rowIndex <= size - 3 && columnIndex <= size - 3) {
          if (
            cell.getValue() === currentPlayer.token &&
            cell.getValue() ===
              board[rowIndex + 1][columnIndex + 1].getValue() &&
            cell.getValue() === board[rowIndex + 2][columnIndex + 2].getValue()
          ) {
            return true;
          }
        }

        // check for diagonal win (bottom-left to top-right)
        if (rowIndex >= 2 && columnIndex <= size - 3) {
          if (
            cell.getValue() === currentPlayer.token &&
            cell.getValue() ===
              board[rowIndex - 1][columnIndex + 1].getValue() &&
            cell.getValue() === board[rowIndex - 2][columnIndex + 2].getValue()
          ) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const isDrawState = () => {
    const board = currentBoard.getBoard();
    return board.every((row) => row.every((cell) => cell.getValue() !== 0));
  };

  // initial message
  printNewRound();

  return {
    flipCoin,
    getCurrentPlayer,
    setPlayerNames,
    switchPlayer,
    isWinState,
    isDrawState,
    getBoard: currentBoard.getBoard,
    makeMove: currentBoard.makeMove,
  };
}

function ScreenController() {
  let game = GameController("Player 1", "Player 2");
  const turn = document.querySelector(".turn");
  const board = document.querySelector(".board");
  const error = document.querySelector(".error");
  const intro = document.querySelector(".intro");
  const winner = document.querySelector(".winner");

  const startGame = () => {
    // form for player name selection
    intro.appendChild(document.createElement("h1")).textContent = "Tic Tac Toe";

    const form = document.createElement("form");
    form.appendChild(document.createElement("label")).textContent =
      "Player 1 Name: ";
    const playerOneInput = document.createElement("input");
    playerOneInput.defaultValue = "Player 1";
    form.appendChild(playerOneInput);

    form.appendChild(document.createElement("label")).textContent =
      "Player 2 Name: ";

    const playerTwoInput = document.createElement("input");
    playerTwoInput.defaultValue = "Player 2";
    form.appendChild(playerTwoInput);
    intro.appendChild(form);

    // button to randomize starting player
    const randomizeBtn = document.createElement("button");
    randomizeBtn.addEventListener("click", () => {
      game.flipCoin();
    });
    randomizeBtn.textContent = "Randomize Starting Player";

    // button to start the game and make the board visible
    const startBtn = document.createElement("button");
    startBtn.addEventListener("click", () => {
      board.classList.toggle("active");
      intro.setAttribute("style", "display: none");
      game.setPlayerNames(playerOneInput.value, playerTwoInput.value);
      updateScreen();
    });
    startBtn.textContent = "Start Game";

    intro.appendChild(randomizeBtn);
    intro.appendChild(startBtn);
  };

  const updateScreen = () => {
    // clear the board
    board.textContent = "";
    error.textContent = "";

    // set the turn message
    currentPlayer = game.getCurrentPlayer();
    turn.textContent = `${currentPlayer.name}'s turn`;

    // render the board
    const currentBoard = game.getBoard();
    currentBoard.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent =
          cell.getValue() == 0 ? "" : cell.getValue() == 1 ? "X" : "O";
        cellButton.addEventListener("click", (e) => {
          const row = parseInt(e.target.dataset.row);
          const column = parseInt(e.target.dataset.column);
          try {
            game.makeMove(row, column, currentPlayer.token);
            if (game.isWinState()) {
              displayWinnerScreen(currentPlayer.token);
              return;
            }
            if (game.isDrawState()) {
              displayWinnerScreen(0);
              return;
            }
            game.switchPlayer();
            updateScreen();
          } catch (err) {
            error.textContent = err.message;
          }
        });
        board.appendChild(cellButton);
      });
    });
  };

  // once the game is won, display the winner screen
  const displayWinnerScreen = (player) => {
    board.textContent = "";
    turn.textContent = "";
    board.classList.toggle("active");
    const winText = document.createElement("h1");
    winText.textContent =
      player == 0 ? "It's a draw!" : `${game.getCurrentPlayer().name} wins!`;
    winner.appendChild(winText);
    restartBtn = document.createElement("button");
    restartBtn.textContent = "Restart";
    restartBtn.addEventListener("click", () => {
      winner.textContent = "";
      game = GameController("Player 1", "Player 2");
      intro.style.display = "";
      intro.textContent = "";
      startGame();
    });
    winner.appendChild(restartBtn);
  };

  startGame();
}

ScreenController();
