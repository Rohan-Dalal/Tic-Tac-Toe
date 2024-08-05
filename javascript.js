// Game Board Object
const gameBoard = (function() {
    let freezeBoard = false;

    const boardArray = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined]
    ];

    const updateBoard = function(row, column, player, space) {
        if(!freezeBoard && !boardArray[row][column]){
            boardArray[row][column] = player;
            let img = document.createElement("img");
            img.setAttribute("src", player.image);
            space.appendChild(img);

            if(gameFlow.checkWin(row, column, player)) {
                freezeBoard = true;
            } else {
                gameFlow.updatePlays();
                gameFlow.playersTurn();
            }
        }
    };

    const restartBoard = function() {
        boardArray[0] = [undefined, undefined, undefined];
        boardArray[1] = [undefined, undefined, undefined];
        boardArray[2] = [undefined, undefined, undefined];

        winDisplay.innerText = "Who Will Win?!";
        
        gameFlow.restartPlays();
        gameFlow.playersTurn();

        freezeBoard = false;
    };

    return {boardArray, updateBoard, restartBoard};
})();

// Game Flow Object
const gameFlow = (function() {
    let plays = 1;

    const checkWin = function(row, column, player) {
        const boardArray = gameBoard.boardArray;

        const win = ((boardArray[row][0] === player && boardArray[row][1] === player && boardArray[row][2] === player) ||
                    (boardArray[0][column] === player && boardArray[1][column] === player && boardArray[2][column] === player) ||
                    (boardArray[0][0] === player && boardArray[1][1] === player && boardArray[2][2] === player) ||
                    (boardArray[0][2] === player && boardArray[1][1] === player && boardArray[2][0] === player));
        if (win === true) {
            updateScores(player);
        }
        if(plays !== 9) {
            return win;
        }
        winDisplay.innerText = "Tie :(";
    };

    const updatePlays = () => plays++;

    const restartPlays = () => plays = 1;

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
            winDisplay.innerText = `${playersTurn().name} Won!`

            if(player === playerOne) {
                playerOne.updateWins();
                let playerOneScoreDisplay = document.querySelector("#score-displays div:nth-child(1) p:nth-child(2)");
                playerOneScoreDisplay.innerText = `${playerOne.getWins()}`;
            } else {
                playerTwo.updateWins();
                let playerTwoScoreDisplay = document.querySelector("#score-displays div:nth-child(2) p:nth-child(2)");
                playerTwoScoreDisplay.innerText = `${playerTwo.getWins()}`;
            }
    };

    return {checkWin, updatePlays, restartPlays, playersTurn};
})();

// Create Player Function Factory
function createPlayer(name, image) {
    let wins = 0;

    const getWins = () => wins;
    const updateWins = () => wins++;

    return {name, getWins, updateWins, image};
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

playerOne = createPlayer(playerOneInput.value, "images\\o.png");
playerTwo = createPlayer(playerTwoInput.value, "images\\x.png");

let playerOneDisplay = document.querySelector("#player-displays div:nth-child(1) p");
playerOneDisplay.innerText = `Player One: ${playerOne.name}`;
let playerTwoDisplay = document.querySelector("#player-displays div:nth-child(2) p");
playerTwoDisplay.innerText = `Player Two: ${playerTwo.name}`;

let playerOneScoreDisplay = document.querySelector("#score-displays div:nth-child(1) p:nth-child(1)");
playerOneScoreDisplay.innerText = `Player One: ${playerOne.name}`;
let playerTwoScoreDisplay = document.querySelector("#score-displays div:nth-child(2) p:nth-child(1)");
playerTwoScoreDisplay.innerText = `Player Two: ${playerTwo.name}`;

gameFlow.playersTurn();

playerForm.close();
e.preventDefault();
});

let restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
for(let i = 0; i < spaces.length; i++) { 
    spaces[i].innerHTML = "";
}
gameBoard.restartBoard();
});

let spaces = document.querySelectorAll("td");
for(let i = 0; i < spaces.length; i++) {
    spaces[i].addEventListener("click", (e) => {
        gameBoard.updateBoard(Math.floor(i/3), i%3, gameFlow.playersTurn(), spaces[i]);
    });
}

let winDisplay = document.querySelector("#display-win");