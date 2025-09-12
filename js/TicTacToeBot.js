/*
 * TicTacToeBot class
 */

import { X, O, EMPTY, MAX_ROW, MAX_COLUMN } from "./constants.js";

export default class TicTacToeBot {
  /**
   * Evaluates the current state of a Tic-Tac-Toe board and returns the result.
   *
   * @param {Array} board - The array representing the current state of the Tic Tac Toe board.
   * @returns {number} Returns 1 if player X wins, -1 if player O wins, or 0 if there is no winner.
   */
  #evaluateGame(board) {
    let players = [X, O];

    // Check to see if either 'O'  or 'X' has won.
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < MAX_ROW; j++) {
        if (
          board[j][0] == players[i] &&
          board[j][1] == players[i] &&
          board[j][2] == players[i]
        ) {
          return players[i] == X ? 1 : -1;
        }
      }

      for (let j = 0; j < MAX_ROW; j++) {
        if (
          board[0][j] == players[i] &&
          board[1][j] == players[i] &&
          board[2][j] == players[i]
        )
          return players[i] == X ? 1 : -1;
      }
      if (
        board[0][0] == players[i] &&
        board[1][1] == players[i] &&
        board[2][2] == players[i]
      ) {
        return players[i] == X ? 1 : -1;
      }
      if (
        board[0][2] == players[i] &&
        board[1][1] == players[i] &&
        board[2][0] == players[i]
      ) {
        return players[i] == X ? 1 : -1;
      }
    }

    // Nor 'X' or 'O' won the game.
    return 0;
  }

  /**
   * Retrieves the coordinates of valid moves on the Tic Tac Toe board.
   *
   * @param {array} board - The current state of the Tic Tac Toe board.
   * @returns {array} An array of coordinate pairs representing valid moves.
   *                  Each coordinate pair is represented as [rowIndex, colIndex].
   *                  Returns an empty array if the game has been won or there are no valid moves.
   * @example
   * If [0, 1], [1, 2], and [2, 0] are valid moves.
   * Returns [[0, 1], [1, 2], [2, 0]].
   */
  #getValidMoves(board) {
    // Check to see if the game is won by 'X' or 'O'.
    if (this.#evaluateGame(board) == 1 || this.#evaluateGame(board) == -1) {
      // console.log(board[0][0] + '|', board[0][1] + '|', board[0][2], '\n' + board[1][0] + '|', board[1][1] + '|', board[1][2], '\n' + board[2][0] + '|', board[2][1] + '|', board[2][2], '\nwon', this.#evaluteGame(board));
      return [];
    }

    // Find valid moves
    let validMoves = [];
    for (let i = 0; i < MAX_COLUMN; i++)
      for (let j = 0; j < MAX_ROW; j++)
        if (board[i][j] == EMPTY) validMoves.push([i, j]);
    return validMoves;
  }

  /**
   * Makes a move on the Tic Tac Toe board for the current player.
   *
   * @param {array} board - The current state of the Tic Tac Toe board.
   * @param {array} move - The coordinates of the move to be made. Represented as [rowIndex, colIndex].
   * @param {string} currentPlayer - The symbol representing the current player ('X' or 'O').
   *
   * @returns {void}
   *
   * @example
   * this.#makeMove(board, [0, 0], 'X');
   * X |  |
   *   |  |
   *   |  |
   */
  #makeMove(board, move, currentPlayer) {
    board[move[0]][move[1]] = currentPlayer;
  }

  /**
   * Makes a move on the Tic Tac Toe board for the current player.
   *
   * @param {array} board - The current state of the Tic Tac Toe board.
   * @param {array} move - The coordinates of the move to be made. Represented as [rowIndex, colIndex].
   *
   * @returns {void}
   *
   * @example
   * this.#undoMove(board, [0, 0]);
   *   |  |
   *   |  |
   *   |  |
   */
  #undoMove(board, move) {
    board[move[0]][move[1]] = EMPTY;
  }

  /**
   * Return a random bot more (level 1)
   *
   * @param {array} board - The current state of the Tic-Tac-Toe board.
   *
   * @returns {array} - The coordinates of the random move to be made. Represented as [rowIndex, colIndex].
   *
   * @example
   * // Get a random move for the bot at level one difficulty.
   * let move = this.#getLevelOneMove(board);
   */
  #getLevelOneMove(board) {
    let validMoves = this.#getValidMoves(board);
    let move = Math.floor(Math.random() * (validMoves.length - 1));
    return validMoves[move];
  }

  /**
   * Determines the best move for the bot at level two difficulty using the minimax algorithm
   * with the alpha-beta pruning optimization searching at depth 4.
   *
   * @see minimax()
   *
   * @param {array} board - The current state of the Tic-Tac-Toe board.
   * @param {string} currentPlayer - The symbol representing the current player (X or O).
   *
   * @returns {array} - The coordinates of the best move to be made. Represented as [rowIndex, colIndex].
   *
   * @example
   * // Get the best move for the bot at level two difficulty.
   * let move = this.#getLevelTwoMove(board, currentPlayer);
   *
   */
  #getLevelTwoMove(board, currentPlayer) {
    let validMoves = this.#getValidMoves(board);
    let moves = [];
    let bestEval = currentPlayer == X ? -Infinity : Infinity;

    if (currentPlayer == X) {
      validMoves.forEach((move) => {
        this.#makeMove(board, move, currentPlayer);

        let evalutation = this.#minimax(board, 4, O, -Infinity, Infinity);
        if (evalutation > bestEval) {
          moves = [];
          moves.push(move);
          bestEval = evalutation;
        } else if (evalutation == bestEval) {
          moves.push(move);
        }
        this.#undoMove(board, move);
      });
    } else {
      validMoves.forEach((move) => {
        this.#makeMove(board, move, currentPlayer);
        let evalutation = this.#minimax(board, 4, X, -Infinity, Infinity);
        if (evalutation < bestEval) {
          moves = [];
          moves.push(move);
          bestEval = evalutation;
        } else if (evalutation == bestEval) {
          moves.push(move);
        }
        this.#undoMove(board, move);
      });
    }
    console.log("Best eval: ", bestEval);
    let move = Math.floor(Math.random() * (moves.length - 1));
    return moves[move];
  }

  /**
   * Determines the best move for the bot at level three difficulty using the minimax algorithm
   * with the alpha-beta pruning optimization searching at depth infinity.
   *
   * @see minimax()
   *
   * @param {array} board - The current state of the Tic-Tac-Toe board.
   * @param {string} currentPlayer - The symbol representing the current player (X or O).
   *
   * @returns {array} - The coordinates of the best move to be made. Represented as [rowIndex, colIndex].
   *
   * @example
   * // Get the best move for the bot at level two difficulty.
   * let move = this.#getLevelTwoMove(board, currentPlayer);
   *
   */
  #getLevelThreeMove(board, currentPlayer) {
    let validMoves = this.#getValidMoves(board);
    let moves = [];
    let bestEval = currentPlayer == X ? -Infinity : Infinity;

    if (currentPlayer == X) {
      validMoves.forEach((move) => {
        this.#makeMove(board, move, currentPlayer);

        let evalutation = this.#minimax(
          board,
          Infinity,
          O,
          -Infinity,
          Infinity,
        );
        if (evalutation > bestEval) {
          moves = [];
          moves.push(move);
          bestEval = evalutation;
        } else if (evalutation == bestEval) {
          moves.push(move);
        }
        this.#undoMove(board, move);
      });
    } else {
      validMoves.forEach((move) => {
        this.#makeMove(board, move, currentPlayer);
        let evalutation = this.#minimax(
          board,
          Infinity,
          X,
          -Infinity,
          Infinity,
        );
        if (evalutation < bestEval) {
          moves = [];
          moves.push(move);
          bestEval = evalutation;
        } else if (evalutation == bestEval) {
          moves.push(move);
        }
        this.#undoMove(board, move);
      });
    }
    console.log("Best eval: ", bestEval);
    let move = Math.floor(Math.random() * (moves.length - 1));
    return moves[move];
  }

  /**
   * Executes the minimax algorithm with alpha-beta pruning to determine the best move for the bot.
   *
   * @see {@link https://en.wikipedia.org/wiki/Minimax Minimax Algorithm on Wikipedia}
   * @see {@link https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning Alpha–beta pruning Algorithm on Wikipedia}
   *
   * @param {array} board - The current state of the Tic-Tac-Toe board.
   * @param {number} depth - The depth of the search tree to explore.
   * @param {string} currentPlayer - The symbol representing the current player (X or O).
   * @param {number} alpha - The alpha value for alpha-beta pruning.
   * @param {number} beta - The beta value for alpha-beta pruning.
   *
   * @returns {number} - The evaluation score of the best move.
   *
   */
  #minimax(board, depth, currentPlayer, alpha, beta) {
    let validMoves = this.#getValidMoves(board);
    if (validMoves.length == 0 || depth == 0) {
      return this.#evaluateGame(board);
    }

    let bestEval = currentPlayer == X ? -Infinity : Infinity;

    if (currentPlayer == X) {
      for (const move of validMoves) {
        this.#makeMove(board, move, X);
        let evalutation = this.#minimax(board, depth - 1, O, alpha, beta);
        this.#undoMove(board, move);

        bestEval = Math.max(bestEval, evalutation);
        alpha = Math.max(alpha, evalutation);

        if (beta <= alpha) break;
      }
    } else {
      for (const move of validMoves) {
        this.#makeMove(board, move, O);
        let evalutation = this.#minimax(board, depth - 1, X, alpha, beta);
        this.#undoMove(board, move);

        bestEval = Math.min(bestEval, evalutation);
        beta = Math.min(beta, evalutation);

        if (beta <= alpha) break;
      }
    }
    return bestEval;
  }

  /**
   * Return a move for the bot based on the specified level of difficulty 1, 2, or 3.
   *
   * @param {array} board - The current state of the Tic-Tac-Toe board.
   * @param {string} currentPlayer - The symbol representing the current player ('X' or 'O').
   * @param {number} level - The level of difficulty for the bot. Should be 1, 2, or 3.
   *
   * @returns {array} - The coordinates of the move to be made. Represented as [rowIndex, colIndex].
   *
   * @throws {Error} - If an invalid bot level is provided.
   *
   * @example
   * // Determine the move to be made by the bot at level 2 difficulty.
   * let move = this.getMove(board, 'X', 2);
   */
  getMove(board, currentPlayer, level) {
    switch (level) {
      case 1:
        // Returns a random move.
        return this.#getLevelOneMove(board);
      case 2:
        // Returns evaluated at a depth of 4.
        return this.#getLevelTwoMove(board, currentPlayer);
      case 3:
        return this.#getLevelThreeMove(board, currentPlayer);
      default:
        // Returns evaluated at a depth of infinity (one of bests move).
        throw Error("Invalid Bot level.");
    }
  }
}
