
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
    switchAiBtn.disabled = false
    isGameActive = true;
    statusEl.innerHTML = ""
    boardEl.innerHTML = ''; // Մաքրում ենք հին տախտակը
    switchAiBtn.addEventListener('click', () => {
        aiGamer = !aiGamer
        switchAiBtn.textContent = aiGamer ? "Game with AI" : "Game with friend"
    })

    // Ստեղծում ենք 9 նոր վանդակ
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i; // Յուրաքանչյուր վանդակին տալիս ենք իր ինդեքսը
        cell.addEventListener('click', handleCellClick);
        boardEl.appendChild(cell);
    }
}

// Կանչվում է վանդակի վրա սեղմելիս
function handleCellClick(event) {
    const index = event.target.dataset.index;
    switchAiBtn.disabled = true

    // Եթե խաղն ավարտվել է կամ վանդակը զբաղված է, ոչինչ չանել
    if (!isGameActive || board[index] !== '') {
        return;
    }

    makeMovie(index)
    if (isGameActive) {
        switchPlayer();

        if (aiGamer) {
            setTimeout(aiMove, 500);
        }
    }
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


function makeMovie(index) {
    // 1. Կատարել քայլ
    board[index] = currentPlayer;
    boardEl.children[index].textContent = currentPlayer;
    boardEl.children[index].classList.add(currentPlayer.toLowerCase());

    // 2. Ստուգել հաղթանակը
    const winningCombo = checkWin(board, currentPlayer);
    if (winningCombo) {
        confetti()
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
    if(!isGameActive) return; // Ավելորդ ստուգում, որպեսզի AI-ն քայլ չանի, եթե խաղացողը հաղթել է
    const bestMovieIndex = findBestMovie()
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

    // եթե վտանգավոր քայլեր չկան կատարել հերթական դեպի հաղթանակ տանող քայլը
    const strategicMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7]
    for (const move of strategicMoves) {
        if (board[move] === '') {
            return move
        }
    }

    return -1
}

// --- ԽԱՂԻ ՄԵԿՆԱՐԿ ---
restartBtn.addEventListener('click', startGame);

startGame() // Սկսում ենք խաղը, երբ էջը բացվում է