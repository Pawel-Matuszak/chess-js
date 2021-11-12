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
  createPiece(){
    this.pieceDiv = document.createElement("div");
    let className = (this.type) ? " "+this.type : "";

    //preparing type to be compatible with FEN string
    this.type = (this.isWhite) ? this.type.toUpperCase() : this.type;

    //setting css position and image
    this.pieceDiv.setAttribute("class", "piece" + className);
    this.pieceDiv.style.left = this.pos.x*100 + "px";
    this.pieceDiv.style.top = this.pos.y*100 + "px";

    this.pieceDiv.innerHTML = this.type;

    return {
      pieceDiv: this.pieceDiv,
      type: this.type, 
      posX: this.pos.x, 
      posY: this.pos.y, 
      isWhite: this.isWhite
    }
  }
}

export default Piece;