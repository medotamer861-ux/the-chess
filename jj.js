const chessboard = document.getElementById('chessboard');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

let board;
let selectedSquare = null;
let playerTurn = 'white';
let gameOver = false;

const pieceSymbols = {
    'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟',
    'R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙'
};

// إعادة اللعبة
function initGame(){
    board = [
        ['r','n','b','q','k','b','n','r'],
        ['p','p','p','p','p','p','p','p'],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['P','P','P','P','P','P','P','P'],
        ['R','N','B','Q','K','B','N','R']
    ];
    selectedSquare = null;
    playerTurn = 'white';
    gameOver = false;
    restartBtn.style.display='none';
    hideMessage();
    createBoard();
}

// إنشاء اللوحة
function createBoard() {
    chessboard.innerHTML = '';
    for (let row=0; row<8; row++) {
        for (let col=0; col<8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row+col)%2===0?'white':'black');
            square.dataset.row = row;
            square.dataset.col = col;

            const piece = board[row][col];
            if(piece){
                const pieceDiv = document.createElement('div');
                pieceDiv.classList.add('piece');
                pieceDiv.textContent = pieceSymbols[piece];
                square.appendChild(pieceDiv);
            }

            square.addEventListener('click', () => handleClick(row,col));
            chessboard.appendChild(square);
        }
    }
}

// الرسالة مع تأثير
function showMessage(text){
    messageDiv.textContent = text;
    messageDiv.classList.add('show');
    restartBtn.style.display='block';
}

function hideMessage(){
    messageDiv.classList.remove('show');
}

// كشف الملك
function checkKingStatus(){
    let whiteKing=false, blackKing=false;
    for(let r=0;r<8;r++){
        for(let c=0;c<8;c++){
            if(board[r][c]==='K') whiteKing=true;
            if(board[r][c]==='k') blackKing=true;
        }
    }
    if(!whiteKing){
        gameOver=true;
        showMessage("You lose, try again!");
    } else if(!blackKing){
        gameOver=true;
        showMessage("You win!");
    }
}

// التعامل مع النقر
function handleClick(row,col){
    if(gameOver) return;
    const piece = board[row][col];
    if(selectedSquare){
        const [r0,c0] = selectedSquare;
        const moves = getValidMoves(r0,c0);
        if(moves.some(m=>m[0]===row && m[1]===col)){
            board[row][col]=board[r0][c0];
            board[r0][c0]='';
            selectedSquare=null;
            createBoard();
            checkKingStatus();
            if(!gameOver){
                playerTurn='black';
                computerMove();
            }
        } else {
            selectedSquare=null;
            createBoard();
        }
    } else {
        if(piece && ((playerTurn==='white' && piece===piece.toUpperCase()) ||
                     (playerTurn==='black' && piece===piece.toLowerCase()))){
            selectedSquare=[row,col];
            highlightMoves(row,col);
        }
    }
}

// تمييز التحركات
function highlightMoves(row,col){
    const moves = getValidMoves(row,col);
    moves.forEach(([r,c])=>{
        const square = chessboard.children[r*8 + c];
        square.classList.add('possible');
    });
    const square = chessboard.children[row*8 + col];
    square.classList.add('highlight');
}

// دوال التحريك والتحقق
function getValidMoves(row,col){
    const piece=board[row][col];
    const moves=[];
    if(!piece) return moves;
    const isWhite=piece===piece.toUpperCase();
    const directions={
        'P': [[-1,0],[-2,0],[-1,-1],[-1,1]],
        'p': [[1,0],[2,0],[1,-1],[1,1]],
        'R': [[1,0],[-1,0],[0,1],[0,-1]],
        'r': [[1,0],[-1,0],[0,1],[0,-1]],
        'B': [[1,1],[1,-1],[-1,1],[-1,-1]],
        'b': [[1,1],[1,-1],[-1,1],[-1,-1]],
        'Q': [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
        'q': [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
        'K': [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
        'k': [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
        'N': [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]],
        'n': [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]]
    };
    const moveDirs=directions[piece];
    if(piece.toUpperCase()==='P'){
        moveDirs.forEach(([dr,dc])=>{
            const r=row+dr, c=col+dc;
            if(r>=0 && r<8 && c>=0 && c<8){
                if(dc===0 && board[r][c]==='') moves.push([r,c]);
                if(dc!==0 && board[r][c] && isWhite!== (board[r][c]===board[r][c].toUpperCase())) moves.push([r,c]);
            }
        });
    } else if(piece.toUpperCase()==='N' || piece.toUpperCase()==='K'){
        moveDirs.forEach(([dr,dc])=>{
            const r=row+dr, c=col+dc;
            if(r>=0 && r<8 && c>=0 && c<8){
                if(!board[r][c] || isWhite!== (board[r][c]===board[r][c].toUpperCase())) moves.push([r,c]);
            }
        });
    } else {
        moveDirs.forEach(([dr,dc])=>{
            let r=row+dr, c=col+dc;
            while(r>=0 && r<8 && c>=0 && c<8){
                if(!board[r][c]) moves.push([r,c]);
                else {
                    if(isWhite!== (board[r][c]===board[r][c].toUpperCase())) moves.push([r,c]);
                    break;
                }
                r+=dr; c+=dc;
            }
        });
    }
    return moves;
}

// AI الكمبيوتر الذكي (Minimax بسيط خطوة للأمام)
function computerMove(){
    if(gameOver) return;

    const movesList=[];

    // جمع كل الحركات الممكنة
    for(let r=0;r<8;r++){
        for(let c=0;c<8;c++){
            const p = board[r][c];
            if(p && p===p.toLowerCase()){ // فقط القطع السوداء
                const moves = getValidMoves(r,c);
                moves.forEach(move=>{
                    let score = evaluateMove(r,c,move[0],move[1]);
                    movesList.push({from:[r,c], to:move, score});
                });
            }
        }
    }

    if(movesList.length===0) return;

    // اختيار أفضل حركة حسب التقييم
    movesList.sort((a,b)=>b.score - a.score);
    const bestMoves = movesList.filter(m => m.score===movesList[0].score);
    const chosen = bestMoves[Math.floor(Math.random()*bestMoves.length)];

    board[chosen.to[0]][chosen.to[1]] = board[chosen.from[0]][chosen.from[1]];
    board[chosen.from[0]][chosen.from[1]] = '';

    createBoard();
    checkKingStatus();
    playerTurn='white';
}

// تقييم الحركة
function evaluateMove(r0,c0,r1,c1){
    const target = board[r1][c1];
    const piece = board[r0][c0];
    const values = {'p':1,'n':3,'b':3,'r':5,'q':9,'k':100,
                    'P':1,'N':3,'B':3,'R':5,'Q':9,'K':100};
    let score = 0;

    if(target) score += values[target] || 0;
    if(r1>=2 && r1<=5 && c1>=2 && c1<=5) score += 0.5;

    return score;
}

// زر إعادة اللعبة
restartBtn.addEventListener('click', initGame);

// بدء اللعبة
initGame();
