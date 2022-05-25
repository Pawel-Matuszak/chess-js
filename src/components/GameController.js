import Bishop from "./Bishop";
import Board from "./Board";
import King from "./King";
import Knight from "./Knight";
import Pawn from "./Pawn";
import Piece from "./Piece";
import Queen from "./Queen";
import Rook from "./Rook";
import MovesHistory from "./MovesHistory";
import MoveGenerator from "./MoveGenerator";

class GameController{
  constructor(userInterface){
    this.userInterface = userInterface || {};
    this.inCheck = {
      white: false,
      black: false,
    }
    this.inCheckTemp = { 
      white: false,
      black: false,
    }
    this.king = {
      white: undefined,
      black: undefined
    }
    this.gameStatus = {
      active: 0,
      black_won: 1,
      white_won: 2,
      draw: 3,
      paused: 4
    }
    this.enPassantTargetSquare = undefined
    this.allPiecesValue = {};
    this.currentGameStatus = "";
    this.whiteToMove = true;
    this.halfmoveCount = 0;
    this.moveCount = 0;
    this.movesHistory = "";
    this.board = null;
    this.computerActive = false;
    this.playVsAiActive = false;
  }
  
  init(fenStr, board){
    //clear move highlights
    window.addEventListener('click', function(e){   
      for (const e of document.querySelectorAll(".square-move")) {
        e.remove()
      }
    });
    this.board = board;
    this.currentGameStatus = this.gameStatus.active;

    this.board.removePieces();
    this.board.readFEN(fenStr);

    this.movesHistory = new MovesHistory();
    this.userInterface.updateMoves(this.movesHistory);
    this.userInterface.currentMove = 0;
    for (const e of document.querySelectorAll(".move-highlight")) {
      e.remove()
    }
    this.movesHistory.set({
      pos: fenStr,
      move: "",
    })
  }

  findKings(board){
    for (let i = 0; i < board.board.length; i++) {
      for (let j = 0; j < board.board[i].length; j++) {
        if(board.board[j][i].type==="k"){
          this.king.black = board.board[j][i];
        }else if(board.board[j][i].type==="K"){
          this.king.white = board.board[j][i];
        }
      }
    }
  }

  findRooks(board){
    let rooks = {white: [], black:[]}
    for (let i = 0; i < board.board.length; i++) {
      for (let j = 0; j < board.board[i].length; j++) {
        if(board.board[j][i].type==="r"){
          rooks.black.push(board.board[j][i]);
        }else if(board.board[j][i].type==="R"){
          rooks.white.push(board.board[j][i]);
        }
      }
    }
    return rooks;
  }

  findPawns(board){
    let pawns = []
    for (let i = 0; i < board.board.length; i++) {
      for (let j = 0; j < board.board[i].length; j++) {
        if(board.board[j][i]!=="-"){
          if(board.board[j][i].type.toLowerCase()==="p"){
            pawns.push(board.board[j][i]);
          }
        }
      }
    }
    return pawns;
  }

  //return true if piece can be moved to x,y
  moveValidation(x,y, isEmpty, board, piece, castle){
    if(this.currentGameStatus !== this.gameStatus.active) return false;
    if(!((this.whiteToMove&& piece.isWhite) || (!this.whiteToMove&& !piece.isWhite))) return false;
    
    //castling
    if(castle){
      if(!castle.long){
        this.makeMove(piece.pos.x+1, piece.pos.y, true, board, castle.rook);
        this.makeMove(x,y, isEmpty, board, piece);
        board.drawPieces();
        this.whiteToMove = !this.whiteToMove;
        piece.wasMoved = true;
        this.historySave(x,y,piece, board, this.inCheckTemp, 0, "short");
        return true;
      }else{
        this.makeMove(piece.pos.x-1, piece.pos.y, true, board, castle.rook);
        this.makeMove(x,y, isEmpty, board, piece);
        board.drawPieces();
        this.whiteToMove = !this.whiteToMove;
        piece.wasMoved = true;
        this.historySave(x,y,piece, board, this.inCheckTemp, 0, "long");
        return true;
      }
    }

    let xBefore = -1;
    this.isCapture = false;

    if(piece.type.toLowerCase()=="p"){
      xBefore = piece.pos.x
    }


    if(this.seeIfCheck(x,y, isEmpty, board, piece)) return false;
    this.makeMove(x,y, isEmpty, board, piece);
    board.drawPieces();

    this.findKings(board);
    board.getControlledSquares();
    this.inCheck.white = false;
    this.inCheck.black = false;
    board.controlledSquares.black.forEach(({x: sX, y: sY}) => {
      if(sX==this.king.white.pos.x && sY==this.king.white.pos.y){
        this.inCheck.white = true;
      }
    });
    board.controlledSquares.white.forEach(({x: sX, y: sY}) => {
      if(sX==this.king.black.pos.x && sY==this.king.black.pos.y){
        this.inCheck.black = true;
      }
    });

    //checkmate or stealmate
    if(this.inCheck.white || this.inCheck.black){
      let allLegalSquares = []
      if(this.inCheck.white){
        //if is in check and has no legal moves its checkmate
        if(board.getAllLegalMoves().white.length<=0){
          this.currentGameStatus = this.gameStatus.black_won;
          this.endGameHandler(board, 'b', "checkmate")
        }

      }else if(this.inCheck.black){
        if(board.getAllLegalMoves().black.length<=0){
          this.currentGameStatus = this.gameStatus.white_won;
          this.endGameHandler(board, 'w', "checkmate")
        }
      }
      
    }else{
      // see if stealmate
      this.allLegalMoves = board.getAllLegalMoves()
      if((this.allLegalMoves.white.length<=0 && this.whiteToMove) || (this.allLegalMoves.black.length<=0 && !this.whiteToMove)){
        this.currentGameStatus = this.gameStatus.draw;
        this.endGameHandler(board, '', "stealmate")
      }
    }

    //draw by insufficient material
    if(this.findPawns(board).length<=0){
      this.allPiecesValue = board.sumAllPiecesValue();
      if(this.allPiecesValue.white<=3 && this.allPiecesValue.black<=3){
        this.currentGameStatus = this.gameStatus.draw;
        this.endGameHandler(board, '', "insufficient material")
      }
    }

    //50 move rule
    if(this.halfmoveCount>=100){
      this.currentGameStatus = this.gameStatus.draw;
      this.endGameHandler(board, '', "fifty-move rule")
    }

    this.historySave(x,y,piece, board, this.inCheck, xBefore);
    
    //repetition
    this.drawByRepetition(board, this.movesHistory);
    return true;
  }

  //set game status to draw if the position was repeated three times
  drawByRepetition(board, history){
    if(history.countRepeat(board.getFEN().split(" ")[0])>=3){
      this.currentGameStatus = this.gameStatus.draw;
      this.endGameHandler(board, '', "repetition")
    }
  }
  
  makeMove(x,y, isEmpty, board, piece){
    this.halfmoveCount++;
    
    if(!isEmpty){
      // check if move is a capture
      this.halfmoveCount=0;
      board.board[y][x].die();
      board.drawPieces();
      this.isCapture  = true;
    }
    //if move is a en passant
    if(this.enPassantTargetSquare){
      if(piece.type.toLowerCase()=="p" && x==this.enPassantTargetSquare.x && y==this.enPassantTargetSquare.y){
        let offset = (piece.isWhite) ? 1 : -1;

        this.halfmoveCount=0;
        board.board[y+offset][x].die();
        board.board[y+offset][x].pieceDiv.remove();
        board.board[y+offset][x] = "-"
        board.drawPieces();
        this.isCapture  = true;
      }
    }

    if(piece.type.toLowerCase()=='p'){
      this.halfmoveCount=0;
    }

    let prevX = piece.pos.x;
    let prevY = piece.pos.y;
    board.board[piece.pos.y][piece.pos.x] = "-";
    piece.pos = {
      x: (x>7) ? 7 : (x<0) ? 0 : x,
      y: (y>7) ? 7 : (y<0) ? 0 : y
    }
    board.board[piece.pos.y][piece.pos.x] = piece;
    piece.wasMoved = true;
    
    if(this.whiteToMove){
      this.moveCount++
    }
    
    this.whiteToMove = !this.whiteToMove;
    for (const e of document.querySelectorAll(".square-move")) {
      e.remove()
    }

    //handle en passant
    this.enPassantTargetSquare = undefined;
    if(piece.isWhite){
      if(piece.type.toLowerCase()=='p' && prevY==piece.pos.y+2){
        this.enPassantTargetSquare = {
          x: piece.pos.x,
          y: piece.pos.y+1
        }
      }
    }else{
      if(piece.type.toLowerCase()=='p' && prevY==piece.pos.y-2){
        this.enPassantTargetSquare = {
          x: piece.pos.x,
          y: piece.pos.y-1
        }
      }
    }

    this.highlightMove(prevX, prevY, x, y, board);
  }

  highlightMove(prevX, prevY, x, y, board){
    for (const e of document.querySelectorAll(".move-highlight")) {
      e.remove()
    }

    const highlightAfter = document.createElement("div");
    const highlightBefore = document.createElement("div");
    highlightAfter.setAttribute("class", "move-highlight")
    highlightBefore.setAttribute("class", "move-highlight")
    
    highlightAfter.style.left = prevX*(this.board.boardRect.width/8) + "px";
    highlightAfter.style.top = prevY*(this.board.boardRect.height/8) + "px";
    highlightBefore.style.left = x*(this.board.boardRect.width/8) + "px";
    highlightBefore.style.top = y*(this.board.boardRect.height/8) + "px";
    board.boardDiv.prepend(highlightAfter, highlightBefore);
  }

  historySave(x, y, piece, board, inCheck, xBefore, castle=false){
    //save move

    let a = ["a", "b", "c", "d" ,"e" ,"f", "g", "h"];
    let move = (piece.type.toLowerCase()=="p") ? "" : piece.type.toUpperCase();
    move += (piece.type.toLowerCase()=="p" && this.isCapture ) ? a[xBefore]+"x" : (this.isCapture ) ? "x" : "";
    move += a[x]+(8-y);
    move += (this.currentGameStatus == this.gameStatus.white_won || this.currentGameStatus == this.gameStatus.black_won) ? "#" : (inCheck.white || inCheck.black) ? "+" : "";
    if(castle){
      move = (castle=="long") ? "0-0-0" : "0-0";
    }

    this.movesHistory.set({
      move: move,
      pos: board.getFEN()
    })

    this.userInterface.updateMoves(this.movesHistory);
    this.userInterface.currentMove++
    this.userInterface.updateCurrentMove();
    
    if(this.userInterface.showCsW || this.userInterface.showCsB){
      board.getControlledSquares();
      if(this.userInterface.showCsW){
        board.showControlledSquares(true);
      }
      if(this.userInterface.showCsB){
        board.showControlledSquares(false);
      }
    }
  }

  //return true if piece would be in check after moving to x,y
  seeIfCheck(x,y, isEmpty, board, piece){
    this.temp = new Board(this)
    this.temp.board = [[],[],[],[],[],[],[],[]]
    this.temp.boardDiv = board.boardDiv

    if(piece.type.toLowerCase()=="k"){
      this.tempPiece = new King(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else if(piece.type.toLowerCase()=="p"){
      this.tempPiece = new Pawn(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else if(piece.type.toLowerCase()=="n"){
      this.tempPiece = new Knight(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else if(piece.type.toLowerCase()=="r"){
      this.tempPiece = new Rook(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else if(piece.type.toLowerCase()=="b"){
      this.tempPiece = new Bishop(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else if(piece.type.toLowerCase()=="q"){
      this.tempPiece = new Queen(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else{
      this.tempPiece = new Piece(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }

    //create temporary board
    for (let i = 0; i < board.board.length; i++) {
      for (let j = 0; j < board.board[i].length; j++) {
        if(board.board[i][j]=="-"){
          this.temp.board[i][j]="-"
        }else{
          if(board.board[i][j].type.toLowerCase()=="k"){
            this.temp.board[i][j] = new King(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else if(board.board[i][j].type.toLowerCase()=="p"){
            this.temp.board[i][j] = new Pawn(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else if(board.board[i][j].type.toLowerCase()=="n"){
            this.temp.board[i][j] = new Knight(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else if(board.board[i][j].type.toLowerCase()=="r"){
            this.temp.board[i][j] = new Rook(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else if(board.board[i][j].type.toLowerCase()=="b"){
            this.temp.board[i][j] = new Bishop(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else if(board.board[i][j].type.toLowerCase()=="q"){
            this.temp.board[i][j] = new Queen(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else{
            this.temp.board[i][j] = new Piece(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }
        }
      }
    }

    //change piece pos on a temp board
    if(!isEmpty){
      this.temp.board[y][x].die();
    }
    this.temp.board[this.tempPiece.pos.y][this.tempPiece.pos.x] = "-";
    this.tempPiece.pos = {
      x: (x>7) ? 7 : (x<0) ? 0 : x,
      y: (y>7) ? 7 : (y<0) ? 0 : y
    }
    this.temp.board[this.tempPiece.pos.y][this.tempPiece.pos.x] = this.tempPiece;
    this.temp.getControlledSquares();
    this.inCheckTemp.white = false;
    this.inCheckTemp.black = false;
    
    this.findKings(this.temp);
    this.temp.controlledSquares.black.forEach(({x: sX, y: sY}) => {
      if(sX==this.king.white.pos.x && sY==this.king.white.pos.y){
        this.inCheckTemp.white = true;
      }
    });
    this.temp.controlledSquares.white.forEach(({x: sX, y: sY}) => {
      if(sX==this.king.black.pos.x && sY==this.king.black.pos.y){
        this.inCheckTemp.black = true;
      }
    });
    // this.temp.showControlledSquares()

    if((this.inCheckTemp.white && piece.isWhite) || (this.inCheckTemp.black && !piece.isWhite)){
      //when king would be in check
      board.drawPieces();
      return true;
    }
    return false;
  }
  
  //dispaly end game message
  endGameHandler(board, color, type){
    if(color=='w'){
      board.gameMessage.style.display="flex";
      board.title.innerHTML = "WHITE WON";
      board.subtitle.innerHTML = "by "+type;

    }else if(color=='b'){
      board.gameMessage.style.display="flex";
      board.title.innerHTML = "BLACK WON";
      board.subtitle.innerHTML = "by "+type;

    }else{
      board.gameMessage.style.display="flex";
      board.title.innerHTML = "DRAW";
      board.subtitle.innerHTML = "by "+type;
    }
  }

  playAIvsAI(){
    let moveGeneratorW = new MoveGenerator(true, this);
    let moveGeneratorB = new MoveGenerator(false, this);
    

    this.playTimer = setInterval(()=>{
      moveGeneratorW.playRandomMove(this.board, this);
      setTimeout(() => {
        moveGeneratorB.playRandomMove(this.board, this);
      }, 300);
    }, 600);
  }

  endAIvsAI(){
    clearInterval(this.playTimer);
  }

  playVsAI(){
    if(!this.playVsAiActive) return;
    let moveGeneratorB = new MoveGenerator(false, this);

    this.playVsAiTimer = setInterval(()=>{
      if(this.whiteToMove) return;
      moveGeneratorB.playRandomMove(this.board, this);
    }, 500);
  }

  endVsAI(){
    clearInterval(this.playVsAiTimer);
  }
}

export default GameController