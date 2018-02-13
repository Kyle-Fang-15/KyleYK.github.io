// ------------------------
// CONFIGURATION
// -----a-------------------

var Config = {
  outerMargin: 90,
  innerMargin: 10,
  background: "rgb(102, 153, 0)",
  squareColor: "rgb(255,255,255)",
  penColor: "rgb(0,0,0)",
  penHoverColor: "rgb(208,208,208)",
  penWinColor: "rgb(26, 117, 255)",
  penWidth: 10,
  penWinWidth: 12,
};



// ------------------------
// GLOBAL VARS
// ------------------------

var cnav,
    cnavtx,
    pageW,
    pageH,
    boardSize,
    boardL,
    boardT,
    sqSize,
    sqOffset,
    sqt,
    runner,
    firstRun = 0,
    mousedIndex,
    gameStatus;



// ------------------------
// SETUP / INITIALIZATION
// ------------------------

function CreateCanvas(){
  var body = document.getElementsByTagName('div')[0];
  
  cnav = document.createElement('canvas');
  cnav.style.position = 'absolute';
  cnav.style.top = cnav.style.left = cnav.style.bottom = cnav.style.right = 0;
  
  cnavtx = cnav.getContext('2d');
  body.appendChild(cnav);  
}


function SetCanvasSize(){
  pageW = cnav.width = window.innerWidth;
  pageH = cnav.height = window.innerHeight;
  
  boardSize = Math.min(pageW, pageH) - 2*Config.outerMargin;
  sqSize = Math.floor((boardSize - 2*Config.innerMargin)/3);
  sqOffset = sqSize+Config.innerMargin;
  
  boardSize = 3*sqSize + 2*Config.innerMargin;
  boardL = Math.floor(pageW/2 - boardSize/2);
  boardT = Math.floor(pageH/2 - boardSize/2);
}


function Init(){
  var i;
  
  sqt = [];
  for(i = 0; i < 9; i++){
    sqt[i] = null;
  }
  
  gameStatus = { winner:null }; 
  runner = 1 - firstRun;
  firstRun = 1 - firstRun;
  mousedIndex = -1;

  ChangeTurn();
}



// ------------------------
// CORE FUNCTIONS
// ------------------------

function AddMove(index,player){
  sqt[index] = player;
  gameStatus = GetOutcomes(sqt);
  ChangeTurn();
}


function ChangeTurn(){
  if (gameStatus.winner === null){
    runner = 1 - runner;
    if (runner === 1){      
      AIMove(sqt,runner);
    }
  }
  mousedIndex = -1;
  Draw();
}


function CheckMousePos(mX,mY,click){
  var left,
      top,
      index = -1,
      i,
      j;
  
  for(i = 0; i < 3; i++){
    for(j = 0; j < 3; j++){
      left = boardL + i*sqOffset;
      top = boardT + j*sqOffset;     
      if (sqt[CoordsToIndex(i,j)] === null && 
          PointInRect(mX, mY, left, top, sqSize, sqSize)){        
        index = CoordsToIndex(i,j);
      }
    }
  }
  
  cnav.style.cursor = (index > -1)? 'pointer' : 'default';
  if (mousedIndex !== index){
    mousedIndex = index;
    Draw();
  }
  
  if (click && sqt[index]===null){
    AddMove(index, runner);
  }  
}


function FindMoves(board){
  var moves = [],
      i;
  
  for(i = 0; i < 9; i++){
    if (board[i] === null){
      moves.push(i);
    }
  }  
  return (moves.length > 0)? moves : null;
}


function GetOutcomes(board){
  var i,
      opensqt;
  
  // check for win condition along horizontal and vertical rows
  for(i = 0; i < 3; i++){
    if (board[CoordsToIndex(i,0)] !== null && 
        board[CoordsToIndex(i,0)] === board[CoordsToIndex(i,1)] &&
        board[CoordsToIndex(i,0)] === board[CoordsToIndex(i,2)]){
      return {
        winner: board[CoordsToIndex(i,0)], 
        sqt: [ {x:i,y:0}, {x:i,y:1}, {x:i,y:2} ]
      };
    }
    if (board[CoordsToIndex(0,i)] !== null && 
        board[CoordsToIndex(0,i)] === board[CoordsToIndex(1,i)] &&
        board[CoordsToIndex(0,i)] === board[CoordsToIndex(2,i)]){
      return {
        winner: board[CoordsToIndex(0,i)], 
        sqt: [ {x:0,y:i}, {x:1,y:i}, {x:2,y:i} ]
      };
    }
  }
  
  // check for win condition along diagonals
  if (board[CoordsToIndex(0,0)] !== null &&
      board[CoordsToIndex(0,0)] === board[CoordsToIndex(1,1)] &&
      board[CoordsToIndex(0,0)] === board[CoordsToIndex(2,2)]){
    return {
      winner: board[CoordsToIndex(0,0)], 
      sqt: [ {x:0,y:0}, {x:1,y:1}, {x:2,y:2} ]
    };
  }
  if (board[CoordsToIndex(0,2)] !== null &&
      board[CoordsToIndex(0,2)] === board[CoordsToIndex(1,1)] &&
      board[CoordsToIndex(0,2)] === board[CoordsToIndex(2,0)]){
    return {
      winner: board[CoordsToIndex(0,2)], 
      sqt: [ {x:0,y:2}, {x:1,y:1}, {x:2,y:0} ]
    };
  }
  
  // if no winner found, check for tie
  opensqt = FindMoves(board);
  
  // if moves found, game is not tied
  if (opensqt){
    return {
      winner: null,
      sqt: opensqt
    };
  }
  else{
    return { 
      winner: -1,
      sqt: null
    };
  }
}



// ------------------------
// AI FUNCTIONS/OBJECTS
// ------------------------

function AIMove(board, player){
  var outcomes = GetOutcomes(board),
      bestMove,
      bestAlphaBeta = -2,
      testAlphaBeta,
      testBoard,
      i;

  for(i = 0; i < outcomes.sqt.length; i++){      
    testBoard = board.slice(0);
    testBoard[outcomes.sqt[i]] = player;
    testAlphaBeta = AlphaBeta(testBoard, -999, 999, player, false);

    if (testAlphaBeta > bestAlphaBeta){
      bestMove = outcomes.sqt[i];
      bestAlphaBeta = testAlphaBeta;
    }
  }

  AddMove(bestMove,player);
};

function AlphaBeta(board, a, b, player, maximizingPlayer){
  var i,
      outcome = GetOutcomes(board),
      childBoard;

  if (outcome.winner !== null){
    if (outcome.winner === player){ return 1; }
    else if (outcome.winner === 1-player){ return -1; }
    else{ return 0; }
  }

  if (maximizingPlayer){
    for(i = 0; i < outcome.sqt.length; i++){
      childBoard = board.slice(0);
      childBoard[outcome.sqt[i]] = player;
      a = Math.max(a, AlphaBeta(childBoard, a, b, player, false));
      if(b <= a){
        break; //b cut off
      }
    }
    return a;   
  }
  else{
    for(i = 0; i < outcome.sqt.length; i++){
      childBoard = board.slice(0);
      childBoard[outcome.sqt[i]] = 1-player;
      b = Math.min(b, AlphaBeta(childBoard, a, b, player, true));
      if (b <= a){
        break; //a cut off
      }
    }
    return b;
  }
};



// ------------------------
// DRAW FUNCTIONS
// ------------------------

function Draw(){
  var left,
      top,
      isHover,
      i,
      j,
      index;
  
  cnavtx.fillStyle = Config.background;
  cnavtx.fillRect(0, 0, pageW, pageH);  
  
  for(i = 0; i < 3; i++){
    for(j = 0; j < 3; j++){
      left = boardL + i*sqOffset;
      top = boardT + j*sqOffset;
      index = CoordsToIndex(i,j);
      isHover = (index === mousedIndex);      
      
      DrawSquare(sqt[index], left, top, sqSize, isHover);
    }
  }
  
  if (gameStatus.winner === 0 || gameStatus.winner === 1){ DrawWinnerLine(); }
}


function DrawSquare(player, left, top, size, isMoused){
  cnavtx.fillStyle = Config.squareColor;
  cnavtx.fillRect(left, top, sqSize, sqSize);
  
  if (player === 0 || (runner === 0 && isMoused)){
    DrawFillO(left, top, size);
  }
  else if (player === 1 || (runner === 1 && isMoused)){
    DrawO(left, top, size);
  }
  else {
    return;
  }
  cnavtx.lineWidth = 1;
  cnavtx.strokeStyle = (isMoused && player===null)? Config.penHoverColor : Config.penColor;
  cnavtx.stroke();
}







function DrawO(left, top, size){
  var x = left + 0.5*size,
      y = top + 0.5*size,
      rad = 0.28*size;
  
  cnavtx.beginPath();
  

  cnavtx.arc(x, y, rad, 0, 2*Math.PI, false);
  cnavtx.lineWidth=1;

cnavtx.strokeStyle="green";

cnavtx.stroke();

cnavtx.closePath();
}

function DrawFillO(left, top, size){
  var x = left + 0.5*size,
      y = top + 0.5*size,
      rad = 0.28*size;
  
  cnavtx.beginPath();

  cnavtx.arc(x, y, rad, 0, 2*Math.PI, false);
  cnavtx.fillStyle="black";
  cnavtx.fill();
  cnavtx.closePath();

}


function DrawWinnerLine(){
  var x1 = boardL + gameStatus.sqt[0].x*sqOffset + 0.5*sqSize,      
      x2 = boardL + gameStatus.sqt[2].x*sqOffset + 0.5*sqSize,      
      y1 = boardT + gameStatus.sqt[0].y*sqOffset + 0.5*sqSize,
      y2 = boardT + gameStatus.sqt[2].y*sqOffset + 0.5*sqSize,
      xMod = 0.2*(x2-x1),
      yMod = 0.2*(y2-y1);
  
  x1 -= xMod;
  x2 += xMod;
  
  y1 -= yMod;
  y2 += yMod;
  
  cnavtx.beginPath();
  cnavtx.moveTo(x1, y1);
  cnavtx.lineTo(x2, y2);
  
  cnavtx.lineWidth = (sqSize/100) * Config.penWinWidth;
  cnavtx.strokeStyle = Config.penWinColor;
  cnavtx.stroke();
}



// ------------------------
// HELPER FUNCTIONS
// ------------------------

function PointInRect(pX, pY, rL, rT, rW, rH){
  return (pX>rL && pX<rL+rW && pY>rT && pY<rT+rW);
}


function CoordsToIndex(x,y){
  return x + 3*y;
}



// ------------------------
// EVENT HANDLERS/LISTENERS
// ------------------------

function OnLoad(){
  CreateCanvas();
  SetCanvasSize();
  Init();
}

function OnResize(){
  SetCanvasSize();
  Draw();
}

function OnMouseMove(e){
  if (runner === 0){
    CheckMousePos(e.clientX, e.clientY);
  }
}

function OnMouseDown(e){
  if (gameStatus.winner !== null){
    Init();
  }
  else if (runner === 0){
    CheckMousePos(e.clientX, e.clientY, true);
  }
}

function OnKeyDown(e){
  var key = event.keyCode || event.which;
  switch (key){
    case 27:
    case 82: Init(); break;
    default: break;
  }
}


window.addEventListener('load',OnLoad,false);
window.addEventListener('resize',OnResize,false);
window.addEventListener('mousemove',OnMouseMove,false);
window.addEventListener('mousedown',OnMouseDown,false);
window.addEventListener('keydown',OnKeyDown,false);