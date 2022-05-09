//https://commons.wikimedia.org/wiki/File:Chess_Pieces_Sprite.svg
import rImg from "../images/r.png"
import RImg from "../images/wr.png"
import bImg from "../images/b.png"
import BImg from "../images/wb.png"
import nImg from "../images/n.png"
import NImg from "../images/wn.png"
import qImg from "../images/q.png"
import QImg from "../images/wq.png"
import kImg from "../images/k.png"
import KImg from "../images/wk.png"
import pImg from "../images/p.png"
import PImg from "../images/wp.png"

class Piece{
  constructor(type, posX, posY, isWhite, gameController=null){
    this.pos = {
      x: (posX>7) ? 7 : (posX<0) ? 0 : posX,
      y: (posY>7) ? 7 : (posY<0) ? 0 : posY
    }
    this.type=type
    this.isWhite = isWhite;
    this.isAlive = true;
    this.pieceDiv;
    this.pieceImage;
    this.allMoves = [];
    this.controlledSquares = [];
    this.wasMoved = false;
    this.gameController = gameController;
    this.value = 0;
  }

  //return piece object with all its parameters
  //and set style and visual position on the board
  createPiece(board){
    this.gameController = board.gameController;

    this.pieceDiv = document.createElement("div");
    let className = (this.type) ? " "+this.type : "";

    this.pieceDiv.setAttribute("class", "piece" + className);

    //set image for the piece
    switch (this.type) {
      case "r":
        this.pieceImage = rImg;
        break;
      case "R":
        this.pieceImage = RImg;
        break;
      case "b":
        this.pieceImage = bImg;
        break;
      case "B":
        this.pieceImage = BImg;
        break;
      case "n":
        this.pieceImage = nImg;
        break;
      case "N":
        this.pieceImage = NImg;
        break;
      case "q":
        this.pieceImage = qImg;
        break;
      case "Q":
        this.pieceImage = QImg;
        break;
      case "k":
        this.pieceImage = kImg;
        break;
      case "K":
        this.pieceImage = KImg;
        break;
      case "p":
        this.pieceImage = pImg;
        break;
      case "P":
        this.pieceImage = PImg;
        break;
      default:
        break;
    }
    this.pieceDiv.style.background = "url("+ this.pieceImage +")";

    //Make thie piece draggable
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const mousedown = (e)=>{
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      this.pieceDiv.style.zIndex = 999;

      this.showLegalMoves(board);
      
      //set piece position and remove listeners on mouse button up
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
        this.pieceDiv.style.zIndex = 10;
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

    this.pieceDiv.addEventListener("mousedown", mousedown);

    const touchmove = (e)=>{
      // get the touch position:
      let touchLocation = e.targetTouches[0];
      let boardRect = this.gameController.board.boardDiv.getBoundingClientRect();
      let thisRect = this.pieceDiv.getBoundingClientRect();
      let piecePosition = {
        x: touchLocation.pageX-boardRect.x-thisRect.width/2,
        y: touchLocation.pageY-boardRect.y-thisRect.height/2
      }
      this.pieceDiv.style.top = (piecePosition.y) + "px";
      this.pieceDiv.style.left = (piecePosition.x) + "px";

      document.ontouchend = () =>{
        this.move(
          Math.round((piecePosition.x - pos1)/100),
          Math.round((piecePosition.y - pos2)/100),
          board
        )
      }
    }

    this.pieceDiv.addEventListener("touchstart", ()=>{
      this.showLegalMoves(board)
    })
    this.pieceDiv.addEventListener("touchmove", touchmove)

    // board.drawPieces();
    
    board.board[this.pos.y][this.pos.x] = this;
  }

  //changes position on the screen
  //return false if move was not made
  move(posX, posY, board){
    let moveWasMade = false;
    if(this.gameController.userInterface.currentMove!==this.gameController.movesHistory.length-1) {
      board.drawPieces()
      return moveWasMade;
    }

    board.getControlledSquares();
    this.allMoves = this.getLegalMoves(board);

    //check if a move is legal
    this.allMoves.forEach(({x,y,isEmpty, isAlly}) => {
      if(posX==x && posY==y){
        if(isAlly) return;
        moveWasMade = this.gameController.moveValidation(x,y, isEmpty, board, this);
      }
    });
    board.drawPieces();
    return moveWasMade;
    // board.showControlledSquares(true);
  }

  showLegalMoves(board){

    //show moves to player that currenty has a turn
    if(!(((this.gameController.whiteToMove && this.isWhite) || (this.gameController.whiteToMove==false && this.isWhite==false)) 
    && this.gameController.userInterface.currentMove==this.gameController.movesHistory.length-1)) return;

    board.getControlledSquares();

    this.allMoves = [];
    this.allMoves = this.getLegalMoves(board);

    this.allMoves = this.allMoves.filter(e=>!this.gameController.seeIfCheck(e.x, e.y, e.isEmpty, board, this))

    //remove all previous dots from the DOM
    for (const e of document.querySelectorAll(".square-move")) {
      e.remove()
    }

    this.allMoves.forEach(({x,y, isEmpty, isAlly})=>{
      if(isAlly) return;
      const square = document.createElement("div");
      const point = document.createElement("div");
      square.setAttribute("class", "square-move");
      point.setAttribute("class", "point");
      square.appendChild(point);
      board.boardDiv.prepend(square);
      if(!isEmpty){
        point.style.border = "7px solid rgba(150, 150, 150, 0.5)";
        point.style.background = "none";
        square.style.zIndex = 999;
        point.style.width = "100px";
        point.style.height = "100px";
      }
      square.style.left = x*100 + "px";
      square.style.top = y*100 + "px";
      square.onclick = () =>{
        this.move(x,y,board);
        square.onclick = null;
      }
    })
  }

  die(){
    this.isAlive = false;
  }
  
}

export default Piece;