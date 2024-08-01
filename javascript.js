// Game Board Object
const gameBoard = (function() {
    const boardArray = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined]
    ];

    const updateBoard = function(row, column, player) {
        boardArray[row][column] = player;

        gameFlow.checkWin(row, column, player);
        gameFlow.updatePlays();
        gameFlow.playersTurn();
    };

    const restartBoard = function() {
        boardArray[0] = [undefined, undefined, undefined];
        boardArray[1] = [undefined, undefined, undefined];
        boardArray[2] = [undefined, undefined, undefined];
        gameFlow.restartPlays();
        gameFlow.playersTurn();
    };

    return {boardArray, updateBoard, restartBoard};
})();

// Game Flow Object
const gameFlow = (function() {
    let plays = 0;

    const checkWin = function(row, column, player) {
        if(plays === 9) {
            return undefined;
        }

        const boardArray = gameBoard.boardArray;

        const win = ((boardArray[row][0] === player && boardArray[row][1] === player && boardArray[row][2] === player) ||
                    (boardArray[0][column] === player && boardArray[1][column] === player && boardArray[2][column] === player) ||
                    (boardArray[0][0] === player && boardArray[1][1] === player && boardArray[2][2] === player) ||
                    (boardArray[0][2] === player && boardArray[1][1] === player && boardArray[2][0] === player));
        if (win === true) {
            updateScores(player);
        }
        return win;
    };

    const updatePlays = () => plays++;

    const restartPlays = () => plays = 0;

    const playersTurn = function() {
        const playersTurn = document.querySelector("#turn-display");
        
        if(plays % 2 === 0) {
            playersTurn.innerText = `${playerOne.name}'s Turn!`;
            return playerOne;
        } else {
            playersTurn.innerText = `${playerTwo.name}'s Turn!`;
            return playerTwo;
        }
    };

    const updateScores = function(player) {
            let winDisplay = document.querySelector("#display-win p");
            winDisplay.innerText = `${playersTurn().name} Won!`

            if(player === playerOne) {
                playerOne.updateWins();
                let playerOneScoreDisplay = document.querySelector("#score-display div:nth-child(1) p:nth-child(2)");
                playerOneScoreDisplay.innerText = `${playerOne.getWins()}`;
            } else {
                playerTwo.updateWins();
                let playerTwoScoreDisplay = document.querySelector("#score-display div:nth-child(2) p:nth-child(2)");
                playerTwoScoreDisplay.innerText = `${playerTwo.getWins()}`;
            }
    };

    return {checkWin, updatePlays, restartPlays, playersTurn};
})();

// Create Player Function Factory
function createPlayer(name) {
    let wins = 0;

    const getWins = () => wins;
    const updateWins = () => wins++;

    return {name, getWins, updateWins};
}

let playerForm = document.querySelector("#player-creation");
playerForm.showModal();

let playerOne;
let playerTwo;

let submitPlayers = document.querySelector("#submit");
let playerOneInput = document.querySelector("#player-one");
let playerTwoInput = document.querySelector("#player-two");
submitPlayers.addEventListener("click", (e) => {
    if(playerOneInput.value == "") {
        playerOneInput.value = "Player One";
    }
    if(playerTwoInput.value == "") {
        playerTwoInput.value = "Player Two";
    }

    playerOne = createPlayer(playerOneInput.value);
    playerTwo = createPlayer(playerTwoInput.value);

    let playerOneDisplay = document.querySelector("#player-display div:nth-child(1) p");
    playerOneDisplay.innerText = `Player One: ${playerOne.name}`;
    let playerTwoDisplay = document.querySelector("#player-display div:nth-child(2) p");
    playerTwoDisplay.innerText = `Player Two: ${playerTwo.name}`;

    let playerOneScoreDisplay = document.querySelector("#score-display div:nth-child(1) p:nth-child(1)");
    playerOneScoreDisplay.innerText = `Player One: ${playerOne.name}`;
    let playerTwoScoreDisplay = document.querySelector("#score-display div:nth-child(2) p:nth-child(1)");
    playerTwoScoreDisplay.innerText = `Player Two: ${playerTwo.name}`;

    gameFlow.playersTurn();

    playerForm.close();
    e.preventDefault();
});

let spaces = document.querySelectorAll("td");
for(let i = 0; i < spaces.length; i++) {
    spaces[i].addEventListener("click", (e) => {
        console.log(gameFlow.gameOver);
        let img = document.createElement("img");
        if(gameFlow.playersTurn() === playerOne) {
            img.setAttribute("src", "images\\o.png");
            gameBoard.updateBoard(Math.floor(i/3), i%3, playerOne);
        } else {
            img.setAttribute("src", "images\\x.png");
            gameBoard.updateBoard(Math.floor(i/3), i%3, playerTwo);
        }
        spaces[i].appendChild(img);
    });
}

let restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
    gameBoard.restartBoard();
    for(let i = 0; i < spaces.length; i++) { 
        spaces[i].innerHTML = "";
    }
});