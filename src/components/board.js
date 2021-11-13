import Piece from "./piece";

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
        }
      })
    })
    console.log(this.board);
  }

  readFEN(fenStr){
    let fenArray = fenStr.split("/");
    this.board = [];

    for (let i = 0; i <= 7; i++) {
      this.board.push([]);

      for (let j = 0; j <= 7; j++) {
        if(fenArray[i][0] > 0 && fenArray[i][0] < 9){
          this.board[i].push("-");
        }else{
          let newPiece = new Piece(fenArray[i][j], j, i, (fenArray[i][j].toLowerCase()==fenArray[i][j]) ? false : true);
          
          newPiece.createPiece(this);
          console.log(newPiece.pieceDiv);
          this.board[i][j] = newPiece;
        }
      }
    }
    this.drawBoard();
  }
}

export default Board;