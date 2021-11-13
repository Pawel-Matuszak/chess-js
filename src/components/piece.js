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
import { unset } from "lodash"

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
    this.pieceImage;
    this.legalMoves = [];
  }

  //return piece object with all its parameters
  //and set style and visual position on the board
  createPiece(board){
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

    this.pieceDiv.addEventListener("mousedown", mousedown)

    board.board[this.pos.y][this.pos.x] = this;
    board.drawBoard();
  }

  //changes position on the screen
  move(posX, posY, board){
    board.board[this.pos.y][this.pos.x] = "-";
    this.pos = {
      x: (posX>7) ? 7 : (posX<0) ? 0 : posX,
      y: (posY>7) ? 7 : (posY<0) ? 0 : posY
    }
    board.board[this.pos.y][this.pos.x] = this;
    board.drawBoard();
  }

  showLegalMoves(boardDiv){
    for (const e of document.querySelectorAll(".point")) {
      e.remove()
    }
    this.legalMoves.forEach(([x,y])=>{
      const point = document.createElement("div");
      point.setAttribute("class", "point")
      boardDiv.appendChild(point);
      
      point.style.left = x*100+50-point.offsetWidth/2 + "px";
      point.style.top = y*100+50-point.offsetHeight/2 + "px";
    })
  }
  
}

export default Piece;