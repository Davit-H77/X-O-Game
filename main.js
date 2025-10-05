  
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status")
const restartBtn = document.getElementById("restart");


let board; // Զանգված, որը պահում է խաղատախտակի վիճակը
let currentPlayer; // 'X' կամ 'O'
let isGameActive; // true, եթե խաղը շարունակվում է

// Հաղթող կոմբինացիաները
const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function startgame (){
    board = Array(9).fill(''); // 9 դատարկ վանդակ
    currentPlayer = 'X';
    isGameActive = true;
    statusEl.innerHTML = ""
    boardEl.innerHTML = ""
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i; // Յուրաքանչյուր վանդակին տալիս ենք իր ինդեքսը
        cell.addEventListener('click', handleCellClick);
        boardEl.appendChild(cell);
    }
  }
  
  function handleCellClick (event){
    
    const index = event.target.dataset.index
    if(isGameActive === false || board[index] !== ''){
      return
    }

    board[index] = currentPlayer
    event.target.textContent = currentPlayer
    event.target.classList.add(currentPlayer.toLowerCase());

    const winningCombo = checkWin(board, currentPlayer);
     if (winningCombo) {
        endGame(winningCombo, false)
        return; // Դադարեցնել ֆունկցիան, քանի որ խաղն ավարտված է
      }
    
    // 3. Ստուգել ոչ-ոքին
    if(!board.includes('')){
      endGame(winningCombo, true)
      return
    }

    // 4. Փոխել խաղացողին
    switchPlayer();

  }
function switchPlayer (){
    currentPlayer  = currentPlayer === 'X' ? 'O' : 'X';
     statusEl.textContent = `${currentPlayer} - ի քայլն է`
}

function checkWin (currentBoard, player){
    for (const combo of winCombos) {
        const [a, b, c] = combo;
        if (currentBoard[a] === player && currentBoard[b] === player && currentBoard[c] === player) {
      confetti()
            return combo; // Վերադարձնել հաղթող կոմբինացիան
            
       
           
        }
    }
    return null; // Հաղթող չկա
    
}
function endGame (winCombo , isDraw ){
    isGameActive = false;
    if(isDraw){
        statusEl.textContent = "Ոչ ոքի"
    }else{
        statusEl.textContent = ` հաղթեց ${currentPlayer}`
        winCombo.forEach(index => {
            boardEl.children[index].classList.add('win')
          });
    }
}

// լավագույն քայլը արդյոք կարող է հաղթել հաջորդ քայլով
// խանգառի հակառակորդին, արդյոք հակառակորդը կարող է հաղթել, և արգելափակում է
// եթե վտանգավոր քայլեր չկան հետևել ռազմավարությանը

// --- ԽԱՂԻ ՄԵԿՆԱՐԿ ---
// Սկսում ենք խաղը, երբ էջը բացվում է

restartBtn.addEventListener('click', startgame);
startgame()


