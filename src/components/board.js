import King from "./King";
import Pawn from "./Pawn";
import Knight from "./Knight"
import Piece from "./Piece";

class Board{
  constructor(){
    this.board = [];
    this.boardDiv;
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

  drawBoard(){
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

  }

  readFEN(fenStr){
    let fenArray = fenStr.split("/");
    this.board = [];

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
            
          }else{
            let newPiece = new Piece(e, this.board[rowNum].length, rowNum, (e.toLowerCase()==e) ? false : true);
            newPiece.createPiece(this);
          }
          // this.board[rowNum].push(newPiece);
        }
      })
      rowNum++;
    })

    this.drawBoard();
    console.log(this.board);
  }
}

export default Board;