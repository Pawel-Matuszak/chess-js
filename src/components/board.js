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
    this.enPassantTargetSquare = {}
  }

  createBoard(){
    this.boardDiv = document.createElement("div");
    this.boardDiv.setAttribute("class", "board");
  
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

  readFEN(fenStr){
    this.board = [];

    let fenArray = fenStr.split("/");
    let fenArrayLast = fenArray[7].split(" ").slice(0,1);
    let fenInfo = fenArray[7].split(" ").slice(1);
    fenArray.pop();
    fenArray.push(...fenArrayLast);
    
    console.log(fenInfo);

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

    this.drawPieces();

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
    this.gameController.enPassantTargetSquare = fenInfo[2];

    //halfmove clock
    this.gameController.halfmoveCount = fenInfo[3];

    //fullmove counter
    this.gameController.moveCount = fenInfo[4];

    // console.log(this.board);
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
            //to fix bug when moving forward is legal
            //however that is not square controlled by the pawn
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

  showControlledSquares(isWhite){
    //remove previous
    for (const e of document.querySelectorAll(".hilight")) {
      e.remove()
    }

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
}

export default Board;