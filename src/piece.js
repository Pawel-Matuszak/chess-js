class Piece{
  constructor(){
    this.pos = {
      x: 0,
      y: 0 
    }
    this.isWhite = true;
    this.isAlive = true;
    this.chessBoard = null;
  }

  //returns piece object with all its parameters
  //and sets style and visual position on the board
  createPiece(type, posX, posY, isWhite){
    const piece = document.createElement("div");
    let className = (type) ? " "+type : "";

    //preparing type to be compatible with FEN string
    type = (isWhite) ? type.toUpperCase() : type;

    //setting css position and image
    piece.setAttribute("class", "piece" + className);
    piece.style.left = posX*100 + "px";
    piece.style.top = posY*100 + "px";
    
    piece.innerHTML = type;

    return {
      pieceDiv: piece,
      type, posX, posY, isWhite
    }
  }
}

export default Piece;