import King from "./King";
import Pawn from "./Pawn";
import Knight from "./Knight"
import Piece from "./Piece";
import Rook from "./Rook";
import Queen from "./Queen"
import Bishop from "./Bishop"

class Board{
  constructor(gameController){
    this.board = [];
    this.controlledSquares = {white: [], black: []};
    this.boardDiv;
    this.gameController = gameController;
  }

  createBoard(){
    this.boardDiv = document.createElement("div");
    this.boardDiv.setAttribute("class", "board");

    //used at the end of the game for displaying who won
    this.gameMessage = document.createElement("div");
    this.gameMessage.setAttribute("class", "gameMessage");
    this.title = document.createElement("div");
    this.title.setAttribute("class", "gameMsgTitle");
    this.subtitle = document.createElement("div");
    this.subtitle.setAttribute("class", "gameMsgSubtitle");
    //exit btn
    this.times = document.createElement("div");
    this.times.setAttribute("class", "exit-modal");
    this.times.innerHTML = "<i class='fas fa-times'></i>"
    this.times.onclick = ()=>{
      this.gameMessage.style.display = "none";
    }
    
    this.gameMessage.append(this.times, this.title, this.subtitle)
    this.boardDiv.appendChild(this.gameMessage)
    
    //draw board in html
    for (let i = 0; i <= 7; i++) {
      const row = document.createElement("div");
      row.setAttribute("class", "row");
      this.board.push([]);

      for (let j = 0; j <= 7; j++) {

        const square = document.createElement('div');
        square.setAttribute("class", `${j}${i} square`);
        square.style.background = ((j+1+i+1)%2==0) ? "#F0D29E" : "#996542";

        this.board[i].push("");
        row.appendChild(square);
      }
  
      this.boardDiv.appendChild(row);
    }

    document.body.appendChild(this.boardDiv);
  }

  drawPieces(){
    this.board.forEach(arr=>{
      arr.forEach(e=>{
        if(e.type==="r" || e.type==="R" || e.type==="n" || e.type==="N" || e.type==="b" || e.type==="B" 
        || e.type==="k" || e.type==="K" || e.type==="k" || e.type==="q" || e.type==="Q" || e.type==="p" || e.type==="P"){
          e.pieceDiv.style.left = e.pos.x*100 + "px";
          e.pieceDiv.style.top = e.pos.y*100 + "px";
          this.boardDiv.appendChild(e.pieceDiv);
          if(!e.isAlive){
            e.pieceDiv.remove()
          }
        }
      })
    })
    this.getControlledSquares();
  }

  removePieces(){
    this.board.forEach(arr=>{
      arr.forEach(e=>{
        if(!e.pieceDiv) return;
        if(e!=="-") e.pieceDiv.remove();
      })
    })
  }

  readFEN(fenStr){
    this.board = [];

    let fenArray = fenStr.split("/");
    let fenArrayLast = fenArray[7].split(" ").slice(0,1);
    let fenInfo = fenArray[7].split(" ").slice(1);
    fenArray.pop();
    fenArray.push(...fenArrayLast);
    
    //create empty board
    for (let i = 0; i <= 7; i++) {
      this.board.push([]);
    }

    //fill board with pieces
    let rowNum = 0;
    fenArray.forEach(row=>{
      [...row].forEach(e=>{
        if(this.board[rowNum].length>8) return;

        if(e>0 && e<9){
          for (let i = 0; i < e; i++) {
            this.board[rowNum].push('-');
          }
        }else{
          if(e.toLowerCase()=="k"){
            let newPiece = new King(e, this.board[rowNum].length, rowNum, (e.toLowerCase()==e) ? false : true);
            newPiece.createPiece(this);
            
          }else if(e.toLowerCase()=="p"){
            let newPiece = new Pawn(e, this.board[rowNum].length, rowNum, (e.toLowerCase()==e) ? false : true);
            newPiece.createPiece(this);
            
          }else if(e.toLowerCase()=="n"){
            let newPiece = new Knight(e, this.board[rowNum].length, rowNum, (e.toLowerCase()==e) ? false : true);
            newPiece.createPiece(this);
            
          }else if(e.toLowerCase()=="r"){
            let newPiece = new Rook(e, this.board[rowNum].length, rowNum, (e.toLowerCase()==e) ? false : true);
            newPiece.createPiece(this);
            
          }else if(e.toLowerCase()=="b"){
            let newPiece = new Bishop(e, this.board[rowNum].length, rowNum, (e.toLowerCase()==e) ? false : true);
            newPiece.createPiece(this);
            
          }else if(e.toLowerCase()=="q"){
            let newPiece = new Queen(e, this.board[rowNum].length, rowNum, (e.toLowerCase()==e) ? false : true);
            newPiece.createPiece(this);
            
          }else{
            let newPiece = new Piece(e, this.board[rowNum].length, rowNum, (e.toLowerCase()==e) ? false : true);
            newPiece.createPiece(this);
          }
        }
      })
      rowNum++;
    })

    if(fenInfo.length<=0) return;
    // save fen info
    this.gameController.whiteToMove = (fenInfo[0]=='w') ? true : false;
    
    //castlingInfo
    let fenCastle = fenInfo[1].split('');
    let rooks = this.gameController.findRooks(this);
    rooks.white.forEach(e=>e.wasMoved=true)
    rooks.black.forEach(e=>e.wasMoved=true)

    fenCastle.forEach(e=>{
      switch (e) {
        case "K":
          if(rooks.white[1]){
            rooks.white[1].wasMoved = false;
          }
          break;
        case "Q":
          if(rooks.white[0]){
            rooks.white[0].wasMoved = false;
          }
          break;
        case "k":
          if(rooks.black[1]){
            rooks.black[1].wasMoved = false;
          }
          break;
        case "q":
          if(rooks.black[0]){
            rooks.black[0].wasMoved = false;
          }
          break;
        default:
          break;
      }
    })

    //en passant square
    if(fenInfo[2]!=="-"){
      let letterToNum = ["a", "b", "c", "d" ,"e" ,"f", "g", "h"]
      this.gameController.enPassantTargetSquare = {
        x: letterToNum.indexOf(fenInfo[2][0]),
        y: 8-parseInt(fenInfo[2][1])
      };
    }

    //halfmove clock
    this.gameController.halfmoveCount = fenInfo[3];

    //fullmove counter
    this.gameController.moveCount = fenInfo[4];
    this.drawPieces();
  }

  getFEN(){
    let fenString = "";
    let counter = 0;

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if(this.board[i][j]!=="-"){
          if(counter>0){
            fenString += counter;
            counter = 0;
          }
          fenString += this.board[i][j].type;
        }else{
          counter++
        }
      }
      if(counter>0){
        fenString += counter;
        counter = 0;
      }
      if(i!==this.board.length-1)
        fenString += "/";
    }   

    fenString += " "; 
    fenString += (this.gameController.whiteToMove) ? "w": "b"; 
    fenString += " "; 
   
    let castlingInfo = "";
    this.rooks = this.gameController.findRooks(this)
    
    //add to fen if castling is available
    if(!this.gameController.king.white.wasMoved){
      this.rooks.white.forEach(rook=>{
        if(!rook.wasMoved){
          if(rook.pos.x==7 && rook.pos.y==7){
            castlingInfo += "K";
          }
          if(rook.pos.x==0 && rook.pos.y==7){
            castlingInfo += "Q";
          }
        }
      })
    }
    if(!this.gameController.king.black.wasMoved){
      this.rooks.black.forEach(rook=>{
        if(!rook.wasMoved){
          if(rook.pos.x==7 && rook.pos.y==0){
            castlingInfo += "k";
          }
          if(rook.pos.x==0 && rook.pos.y==0){
            castlingInfo += "q";
          }
        }
      })
    }

    if(castlingInfo==""){
      fenString += "- "; 
    }else{
      fenString += castlingInfo;
      fenString += " "; 
    }

    let enpassant = this.gameController.enPassantTargetSquare
    if(enpassant){
      let a = ["a", "b", "c", "d" ,"e" ,"f", "g", "h"]
      fenString += a[enpassant.x] + (8-parseInt(enpassant.y)); 
      fenString += " "; 
    }else{
      fenString += "- "; 
    }
    fenString += this.gameController.halfmoveCount;
    fenString += " ";
    fenString += this.gameController.moveCount;

    return fenString;
  }

  getPGN(){
    let pgn = "";
    let gameResult = "";
    let movesHistory = this.gameController.movesHistory;
    if(!movesHistory) return;

    //map moves to ids
    this.gameController.movesHistory.mapToId();
    //add moves to pgn string
    for (let i = 1; i < movesHistory.length; i++) {
      let move = movesHistory.movesMap[i];
      pgn += (i%2==1) ? Math.ceil(i/2)+"."+move.move+" " : move.move+" ";
    }

    switch (this.gameController.currentGameStatus) {
      case this.gameController.gameStatus.draw:
        gameResult = "1/2-1/2";
        break;
      case this.gameController.gameStatus.white_won:
        gameResult = "1-0";
        break;
      case this.gameController.gameStatus.black_won:
        gameResult = "0-1";
        break;
      case this.gameController.gameStatus.active:
        gameResult = "*";
        break;
      default:
        break;
    }

    pgn += gameResult;
    return pgn;
  }

  getControlledSquares(){
    //init
    this.controlledSquares = {white: [], black: []};
    let whiteSquares = [];
    let blackSquares = [];

    //loop through all the pieces and add their legal moves to array
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const piece = this.board[i][j];
        if(piece!=="-"){
          let legalMoves = piece.getLegalMoves(this);
          if(piece.type.toLowerCase()=="p"){
            legalMoves = legalMoves.filter(e=>e.x!==piece.pos.x);
          }
          if(piece.isWhite){
            whiteSquares.push(...legalMoves)
          }else{
            blackSquares.push(...legalMoves)
          }
        }
      }
    }

    //remove duplicates 
    //just in case
    whiteSquares = [...new Set(whiteSquares)]
    blackSquares = [...new Set(blackSquares)]

    this.controlledSquares = {
      white: whiteSquares, 
      black: blackSquares
    };

    //disply squares that the pieces 'see' on the board 
    // this.showControlledSquares(true)
  }

  removeControlledSquares(){
    //remove previous
    for (const e of document.querySelectorAll(".hilight")) {
      e.remove()
    }
  }

  showControlledSquares(isWhite){
    this.removeControlledSquares();

    //display new for white or black
    if(isWhite){
      this.controlledSquares.white.forEach(({x,y, isEmpty, isAlly})=>{
        const point = document.createElement("div");
        point.setAttribute("class", "hilight")
        this.boardDiv.prepend(point);
        point.style.width = 100 + "px"
        point.style.height = 100 + "px"
        point.style.left = x*100+50-point.offsetWidth/2 + "px";
        point.style.top = y*100+50-point.offsetHeight/2 + "px";
      })
    }else{
      this.controlledSquares.black.forEach(({x,y, isEmpty, isAlly})=>{
        const point = document.createElement("div");
        point.setAttribute("class", "hilight")
        this.boardDiv.prepend(point);
        point.style.width = 100 + "px"
        point.style.height = 100 + "px"
        point.style.left = x*100+50-point.offsetWidth/2 + "px";
        point.style.top = y*100+50-point.offsetHeight/2 + "px";
      })
    }
    
  }

  getAllLegalMoves(){
    let white = [];
    let black = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const piece = this.board[i][j];
        if(piece!=="-"){
          let legalMoves = piece.getLegalMoves(this);
          //
          // if(piece.type.toLowerCase()=="p") legalMoves = legalMoves.filter(e=>e.x==piece.pos.x);
          
          if(piece.isWhite){
            white.push(...legalMoves.map(({x,y,isEmpty, isAlly})=>{
              if(!(this.gameController.seeIfCheck(x,y, isEmpty, this, piece) || (isEmpty==false && isAlly==true)) ){
                return {x,y,isEmpty, isAlly, piece}
              }
              return null;
            }))
          }else{
            black.push(...legalMoves.map(({x,y,isEmpty, isAlly})=>{
              if(!(this.gameController.seeIfCheck(x,y, isEmpty, this, piece) || (isEmpty==false && isAlly==true)) ){
                return {x,y,isEmpty, isAlly, piece}
              }
              return null;
            }))
          }
        }
      }
    }
   
    white = white.filter(e=>e!==null);
    black = black.filter(e=>e!==null);
    return {white, black}
  }

  getAllPieces(){
    let allPieces = {
      white: [],
      black: []
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const piece = this.board[i][j];
        if(piece!=="-"){
          if(piece.isWhite){
            allPieces.white.push(piece);
          }else{
            allPieces.black.push(piece);
          }
        }
      }
    }
    return allPieces;
  }

  sumAllPiecesValue(){
    let values = {
      white: 0,
      black: 0
    }
    let allPieces = this.getAllPieces();
    allPieces.white.forEach(p=>values.white += p.value)
    allPieces.black.forEach(p=>values.black += p.value)

    return values;
  }
}

export default Board;