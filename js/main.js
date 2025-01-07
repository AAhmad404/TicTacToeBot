/**
 * Main file
 */

// Run when the document is loaded.
$(document).ready(function() {
    const bot = new TicTacToeBot();
    const board = [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ];

    const SQUARES = ["#game-square-one", "#game-square-two", "#game-square-three", 
                     "#game-square-four", "#game-square-five", "#game-square-six", 
                     "#game-square-seven", "#game-square-eight", "#game-square-nine"];

    const INFO_MESSAGES = {
        thinking: 'thinking...',
        resetInfo: 'Reset to update bot setting.',
        playerInfo: 'Reset to update player.',
        botWon: 'The Bot Won.',
        draw: 'It\'s a draw!',
        userWon: 'You Won!',
        cantPick: 'You can\'t pick this square.',
        turn: 'It\'s your turn!',
        empty: ''
    };

    let currentPlayer;
    let userPlayer;
    let botPlayer;
    let level;

    // EventListeners for all Tic-Tac-Toe Squares
    SQUARES.forEach((square, index) => {
        $(square).click(function() { playMove([Math.floor(index / 3), index % 3]); });
    });
    $("#reset-button").click(resetGame);
    $("#level-select").change(() => { $("#info").html(INFO_MESSAGES.resetInfo); });
    $("#player-select").change(() => { $("#info").html(INFO_MESSAGES.playerInfo); });

    /**
     * Main function to initialize player/bot information.
     * 
     * @returns {void}
     */
    function main() {
        updatePlayers();
        if (userPlayer == O && level != 0) playBotMove();
    } 
    main();

    /**
     * Updates player and bot information based on the selected level and player.
     * 
     * @returns {void}
     */
    function updatePlayers() {
        // Update for level
        switch ($('#level-select').val()) {
            case OFF:
                level = 0;
                break;
            case EASY:
                level = 1;
                break;
            case MEDIUM:
                level = 2;
                break;
            case UNDEFEATED:
                level = 3;
                break;
            default:
                throw new Error('Invalid bot level.');
        }

        currentPlayer = X;
        if (level === 0) {
            $('#player-select').hide();
            return;
        }

        $('#player-select').show();
        playerSelect = $('#player-select').val();

        if (playerSelect == RANDOM) {
            // Randomize the starting player.
            userPlayer = Math.floor(Math.random() * 2) === 0 ? O : X;
            botPlayer = userPlayer === X ? O : X;
        } else {
            userPlayer = playerSelect;
            botPlayer = userPlayer === X ? O : X;
        }

        if (userPlayer === X && level !== 0) $("#info").html(INFO_MESSAGES.turn);
    }

    /**
     * Locks or unlocks all game squares on the Tic-Tac-Toe board.
     * 
     * @param {boolean} lock - If true, locks the game squares; if false, unlocks them.
     * @returns {void}
     */
    function boardLock(lock) {
        SQUARES.forEach((square, index) => {
            $(square).prop("disabled", lock);
        });
    }

    /**
     * Resets the Tic-Tac-Toe game to its initial state.
     * 
     * @returns {void}
     */
    function resetGame() {
        $("#info").html(INFO_MESSAGES.empty);

        SQUARES.forEach((square, index) => {
            $(square).html(EMPTY);
        });

        for (let i = 0; i < MAX_ROW; i++) {
            for (let j = 0; j < MAX_COLUMN; j++) {
                board[i][j] = EMPTY;
            }
        }
        currentPlayer = X;
        updatePlayers();
        boardLock(false);

        if (userPlayer == O && level != 0) playBotMove();
    }

    /**
     * Determines if either 'X' or 'O' has won the game.
     * 
     * @returns {boolean} - Return true if a player has won, otherwise return false.
     */
    function isWon() {
        const players = [X, O];

        for (let i = 0; i < 2; i++) {
            const player = players[i];
            for (let j = 0; j < MAX_ROW; j++) {
                if (board[j][0] == player && board[j][1] == player && board[j][2] == player)
                    return true;
            }

            for (let j = 0; j < MAX_COLUMN; j++) {
                if (board[0][j] == player && board[1][j] == player && board[2][j] == player)
                    return true;
            }
            if (board[0][0] == player && board[1][1] == player && board[2][2] == player)
                return true;

            if (board[0][2] == player && board[1][1] == player && board[2][0] == player)
                return true;
        }

        return false;
    }

    /**
     * Checks if the game has ended in a draw.
     * 
     * @returns {boolean} - True if the game has ended in a draw, false otherwise.
     */
    function isDraw() {
        for (let i = 0; i < MAX_COLUMN; i++)
            for (let j = 0; j < MAX_ROW; j++)
                if (board[i][j] == EMPTY) return false;
        return true;
    }

    /**
     * Swaps the current player's turn between X and O.
     * 
     * @returns {void}
     */
    function swapTurn() {
        currentPlayer = currentPlayer == X ? O : X; 
    }

    /**
     * Updates the Tic Tac Toe board with the current player's move.
     * 
     * @param {Array} move - The coordinates of the move to be made. Represented as [rowIndex, colIndex].
     * @throws {Error} Throws an error if the provided move is invalid.
     * @returns {void}
     */
    function updateBoard(move) {
        const squareNum = move[0] * 3 + (move[1] + 1);

        if (squareNum < 0 || squareNum > 9)
            throw new Error('Invalid Move.');

        $(SQUARES[squareNum - 1]).html(currentPlayer);
    }

    /**
     * Finds and plays the bot the move on the Tic-Tac-Toe board.
     * 
     * @returns {void}
     */
    function playBotMove() {
        $("#info").html(INFO_MESSAGES.thinking);
        boardLock(true);
        const move = bot.getMove(board, currentPlayer, level);

        $("#reset-button").prop("disabled", true);
        setTimeout(function() {
            $("#info").html(INFO_MESSAGES.empty);

            board[move[0]][move[1]] = currentPlayer;
            updateBoard(move);

            if (isWon()) {
                $("#info").html(INFO_MESSAGES.botWon);
            } else if (isDraw()) {
                $("#info").html(INFO_MESSAGES.draw);
            } else {
                boardLock(false);
                swapTurn();
            }

            $("#reset-button").prop("disabled", false);
        }, 250);
    }

    /**
     * Plays a move on the Tic-Tac-Toe board.
     * 
     * @param {Array} move - The coordinates of the move to be made. Represented as [rowIndex, colIndex].
     * @returns {void}
     */
    function playMove(move) {
        if (board[move[0]][move[1]] == EMPTY) {

            board[move[0]][move[1]] = currentPlayer;
            updateBoard(move);

            boardLock(true);
            if (isWon()) {
                $("#info").html($('#level-select').val() == 'Bot Off' ? `${currentPlayer} Won!` : INFO_MESSAGES.userWon);
            } else if (isDraw()) {
                $("#info").html(INFO_MESSAGES.draw);
            } else if (level != 0) {
                swapTurn();
                playBotMove();
            } else {
                boardLock(false);
                swapTurn();
            }
        } else {
            $("#info").html(INFO_MESSAGES.cantPick);
        }
    }
});
