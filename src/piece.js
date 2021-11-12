class Piece{
  constructor(type, posX, posY, isWhite){
    this.pos = {
      x: (posX>7) ? 7 : (posX<0) ? 0 : posX,
      y: (posY>7) ? 7 : (posY<0) ? 0 : posY
    }
    this.type=type
    this.isWhite = isWhite;
    this.isAlive = true;
    this.pieceDiv;
  }

  //returns piece object with all its parameters
  //and sets style and visual position on the board
  createPiece(board){
    this.pieceDiv = document.createElement("div");
    let className = (this.type) ? " "+this.type : "";

    //preparing type to be compatible with FEN string
    this.type = (this.isWhite) ? this.type.toUpperCase() : this.type;

    this.pieceDiv.setAttribute("class", "piece" + className);
    this.pieceDiv.innerHTML = this.type;

    //Make thie piece draggable
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const mousedown = (e)=>{
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;

      //set piece position and remove listeners on mouse button up
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
        this.move(
          Math.round((this.pieceDiv.offsetLeft - pos1)/100),
          Math.round((this.pieceDiv.offsetTop - pos2)/100),
          board
        )
      };
      
      document.onmousemove = (e)=>{
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        this.pieceDiv.style.top = (this.pieceDiv.offsetTop - pos2) + "px";
        this.pieceDiv.style.left = (this.pieceDiv.offsetLeft - pos1) + "px";
      };
    }

    this.pieceDiv.addEventListener("mousedown", mousedown)

    board.board[this.pos.y][this.pos.x] = this;
    board.drawBoard();
  }

  //changes position on the screen
  move(posX, posY, board){
    board.board[this.pos.y][this.pos.x] = "";
    this.pos = {
      x: (posX>7) ? 7 : (posX<0) ? 0 : posX,
      y: (posY>7) ? 7 : (posY<0) ? 0 : posY
    }
    board.board[this.pos.y][this.pos.x] = this;
    board.drawBoard();
  }
  
}

export default Piece;