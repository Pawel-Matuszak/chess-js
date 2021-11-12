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
    console.log(this.board);
  }

  drawBoard(){
    this.board.forEach(arr=>{
      arr.forEach(e=>{
        if(e){
          e.pieceDiv.style.left = e.pos.x*100 + "px";
          e.pieceDiv.style.top = e.pos.y*100 + "px";
          this.boardDiv.appendChild(e.pieceDiv);
        }
      })
    })
  }
}

export default Board;