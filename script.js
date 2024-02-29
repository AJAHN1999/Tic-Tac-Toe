const cell = function () {
    let Token = undefined;
    let value;

    const getValue = () => value;
    const setValue = function (count) {
        value = count;
    }
    const getToken = () => { return Token; }
    const setToken = (playerT) => {
        Token = playerT;
    }
    return {
        getValue,
        setValue,
        getToken,
        setToken,
    };
};


const gameBoard = function () {
    const board = [];
    const rows = 3;
    const columns = 3;
    let count = 0;


    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            const eachCell = cell();
            board[i][j] = eachCell;
            eachCell.setValue(count);
            count++;
        }
    }



    const getBoard = () => { return board };
    const boardCopy = getBoard().map(row => row.slice());

    const printBoard = function () {

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                boardCopy[i][j] = board[i][j].getToken();
            }
        }
        console.log(boardCopy);
    }


    const updateBoard = function ([row, col], playerToken) {
        if (board[row][col].getToken() === undefined) {
            board[row][col].setToken(playerToken);
            console.log(boardCopy);
            return board[row][col].getValue();
        }
        return;
    }


    const resetBoard = function () {
        board = [];
    }


    return {
        getBoard,
        updateBoard,
        resetBoard,
        printBoard,
    }
};

// const playerOneName = "Player One";
// const playerTwoName = "Player Two";

const gameController = (function (p1N, p2N) {

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];


    const game = gameBoard();

    const player1 = {
        name: "Player One",
        token: "X",
        choices: [],
    };
    const player2 = {
        name: "player Two",
        token: "O",
        choices: [],
    };

    let currentPlayer = player1;

    const setGameBoard = () => {
        game.printBoard();
    }

    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    const setCurrentPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        console.log(`${currentPlayer.name}'s turn!`);
    }

    const playRound = function ([row, col], activePlayer) {
        let resultOfRound = false;
        const cellsValue = game.updateBoard([row, col], activePlayer.token);
        if (cellsValue !== undefined) {
            activePlayer.choices.push(cellsValue);
            resultOfRound = checkLogic(activePlayer.choices);
            if (resultOfRound === true) {
                console.log(`${activePlayer.name} won the game`);
                return activePlayer.token;
            }
            else if(resultOfRound===false&&activePlayer.choices.length===5){
                return "tie";
            }
            setCurrentPlayer();
        }
        else {
            alert("you chose an invalid option");
            return;
        }
    }

    const checkLogic = function (playerChoices) {
        const sortedChoices = playerChoices.sort();
        for (let i = 0; i < winningCombinations.length; i++) {
            let validCombo =0;
            const currentArray = winningCombinations[i];
            for (let j = 0; j < sortedChoices.length; j++) {
                if (currentArray.includes(sortedChoices[j])){
                    validCombo++;
                }
            }
            if(validCombo===3){
                return true;
            }
        }
        return false;
    }

    return {
        setGameBoard,
        playRound,
        getCurrentPlayer,
    }

})();

const buttonFunction = function (){
    const buttons = document.querySelectorAll("#cell");
    const status = document.querySelector(".content .status p")
    const restart = document.querySelector(".restart");
    buttons.forEach((button)=>{
        button.addEventListener("click",(evt)=>{
            if(evt.target.textContent===""){
                evt.target.textContent = gameController.getCurrentPlayer().token;
            }
            
            const winner = gameController.playRound(JSON.parse(evt.target.value),gameController.getCurrentPlayer());
            if(winner==="tie"){
                status.textContent="It's a tie!";
            }
            else if(winner!==undefined){
                status.textContent=`${winner} has won the game!`;
                
            }  
            else{
                status.textContent=`${gameController.getCurrentPlayer().token}'s turn!`
            }   
        });  
    })
    restart.addEventListener("click",()=>
    {
       location.reload();
    })
}();










