//--- DOM ՏԱՐՐԵՐԻ ՍՏԱՑՈՒՄ ---
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status")
const restartBtn = document.getElementById("restart");
const player_O = "O"
const player_x = "X"
let switchAiBtn = document.getElementById("gameai")
let aiGamer = true
// --- ԽԱՂԻ ՎԻՃԱԿԻ ՓՈՓՈԽԱԿԱՆՆԵՐ ---
let board; // Զանգված, որը պահում է խաղատախտակի վիճակը
let currentPlayer; // 'X' կամ 'O'
let isGameActive; // true, եթե խաղը շարունակվում է

// Հաղթող կոմբինացիաները
const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// --- ՖՈՒՆԿՑԻԱՆԵՐ ---

// Սկսում կամ վերսկսում է խաղը
function startGame() {
    board = Array(9).fill(''); // 9 դատարկ վանդակ
    currentPlayer = 'X';
    isGameActive = true;
     statusEl.innerHTML = ""
    boardEl.innerHTML = ''; // Մաքրում ենք հին տախտակը

    // Ստեղծում ենք 9 նոր վանդակ
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i; // Յուրաքանչյուր վանդակին տալիս ենք իր ինդեքսը
        cell.addEventListener('click', handleCellClick);
        boardEl.appendChild(cell);
    }
}

function switchGame() {
    switchAiBtn.addEventListener('click', () => {
       aiGamer = !aiGamer

    })
    
}



// Կանչվում է վանդակի վրա սեղմելիս
function handleCellClick(event) {
    const index = event.target.dataset.index;
    // Եթե խաղն ավարտվել է կամ վանդակը զբաղված է, ոչինչ չանել
    if (!isGameActive || board[index] !== '') {
        return;
    }
    makeMovie(index)
    // 4. Փոխել խաղացողին


    switchPlayer();
    if(aiGamer){
        setTimeout(aiMove, 500);
    }
    switchGame()
}



// Փոխում է հերթը մյուս խաղացողին
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusEl.textContent = `${currentPlayer} - ի քայլն է`
}

// Ստուգում է՝ արդյոք տվյալ խաղացողը հաղթել է
function checkWin(currentBoard, player) {
    for (const combo of winCombos) {
        const [a, b, c] = combo;
        if (currentBoard[a] === player && currentBoard[b] === player && currentBoard[c] === player) {
            confetti()
            return combo; // Վերադարձնել հաղթող կոմբինացիան
        }
    }
    return null; // Հաղթող չկա
}

function endGame(winCombo, isDraw) {
    isGameActive = false;
    statusEl.innerHTML = ""
    if (isDraw) {
        statusEl.textContent = "Ոչ ոքի"
    } else {
        statusEl.textContent = `հաղթեց ${currentPlayer}`
        winCombo.forEach(index => {
            boardEl.children[index].classList.add('win')
        });
    }
}

// լավագույն քայլը արդյոք կարող է հաղթել հաջորդ քայլով
// խանգառի հակառակորդին, արդյոք հակառակորդը կարող է հաղթել, և արգելափակում է
// եթե վտանգավոր քայլեր չկան հետևել ռազմավարությանը

function makeMovie(index) {
    // 1. Կատարել քայլ
    board[index] = currentPlayer;
    boardEl.children[index].textContent = currentPlayer;
    boardEl.children[index].classList.add(currentPlayer.toLowerCase());

    // 2. Ստուգել հաղթանակը
    const winningCombo = checkWin(board, currentPlayer);
    if (winningCombo) {
        endGame(winningCombo, false)
        return; // Դադարեցնել ֆունկցիան, քանի որ խաղն ավարտված է
    }

    // 3. Ստուգել ոչ-ոքին
    if (!board.includes('')) {
        endGame(winningCombo, true)
        return
    }
}

function aiMove() {
    const bestMovieIndex = findBestMovie()
    console.log(findBestMovie, 'find best move')
    if (bestMovieIndex !== -1) {
        makeMovie(bestMovieIndex)
        if (isGameActive) {
            switchPlayer()
        }
    }

}

function findBestMovie() {
    // ստուգում ենք արդյոք ԱԲ ն կարող է հաղթել հաջորդ քայլով
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            const boardCopy = [...board]
            boardCopy[i] = player_O
            if (checkWin(boardCopy, player_O)) {
                return i
            }
        }
    }

    // ստուգւոմ ենք արդյոք հակառակորդը կարող է հաղթել եթե այո արգելափակում ենք


    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            const boardCopy = [...board]
            boardCopy[i] = player_x
            if (checkWin(boardCopy, player_x)) {
                return i
            }
        }
    }

    // եթե վտանգավոր քայլեչ չկան կատարել հերթական դեպի հաղթանակ տանող քայլը
    const strategicMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7]
    for (const move of strategicMoves) {
        if (board[move] === '') {
            return move
        }
    }

    return -1
}



// --- ԽԱՂԻ ՄԵԿՆԱՐԿ ---
restartBtn.addEventListener('click', startGame,
    statusEl.innerHTML = "");
startGame() // Սկսում ենք խաղը, երբ էջը բացվու//