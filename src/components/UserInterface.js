class UserInterface{
  constructor(){
    this.buttons = {};
    this.showCsB = false;
    this.showCsW = false;
    this.gameController = null;
    this.board = null;
    this.histPos = 0;
    this.movesList = document.createElement("div");
    this.currentMove = 0;
  }

  handlePrevious(movesHistory, board){
    if(this.currentMove<=1) return;
    movesHistory.mapToId();
    this.currentMove--
    this.board.removePieces();
    this.board.readFEN(movesHistory.movesMap[this.currentMove].pos);

    this.handleHighlight(board);
  }

  handleNext(movesHistory, board){
    if(this.currentMove>movesHistory.length-2) return;
    movesHistory.mapToId();
    this.currentMove++
    this.board.removePieces();
    // if(this.histPos<0) this.histPos *=-1;
    this.board.readFEN(movesHistory.movesMap[this.currentMove].pos);
    
    this.handleHighlight(board);
  }

  handleHighlight(board){
    if(this.showCsW){
      board.getControlledSquares();
      board.showControlledSquares(true);
    }else if(this.showCsB){
      board.getControlledSquares();
      board.showControlledSquares(false);
    }
    
    this.updateCurrentMove()
    for (const e of document.querySelectorAll(".move-highlight")) {
      e.remove()
    }
  }

  init(board, gameController){
    this.wrapper = document.createElement("div");
    this.wrapper.setAttribute("class", "wrapper");
    this.buttonWrapper = document.createElement("div");
    this.buttonWrapper.setAttribute("class", "button-wrapper");

    this.pgnBtn = document.createElement("button");
    this.pgnBtn.setAttribute("class", "pgnBtn");
    this.pgnBtn.innerText = "Download PGN";

    this.pgnModalWrapper = document.createElement("div");
    this.pgnModalWrapper.setAttribute("class", "pgnModalWrapper");
    this.pgnModalWrapper.style.display = "none";

    this.pgnModal = document.createElement("div");
    this.pgnModal.setAttribute("class", "pgnModal");
    this.pgnModal.innerHTML = "<p>PGN</p>";

    this.pgnExit = document.createElement("div");
    this.pgnExit.setAttribute("class", "pgnExit");
    this.pgnExit.innerHTML = "<i class='fas fa-times'></i>";

    this.pgnText = document.createElement("textarea");
    this.pgnText.setAttribute("class", "pgnText");
    this.pgnText.disabled = true;

    this.pgnCopy = document.createElement("button");
    this.pgnCopy.setAttribute("class", "pgnCopy");
    this.pgnCopy.innerHTML = "Copy";

    this.board = board;
    this.gameController = gameController;
    this.currentMove = gameController.halfmoveCount;
    //create buttons for hilighting squares controlled by each color
    this.buttons["toggleWhiteCS"] = document.createElement("button");
    this.buttons["toggleWhiteCS"].innerText = "White threat map";
    this.buttons["toggleBlackCS"] = document.createElement("button");
    this.buttons["toggleBlackCS"].innerText = "Black threat map";
    this.buttons["previous"] = document.createElement("button");
    this.buttons["previous"].innerText = "Previous move";
    this.buttons["previous"].setAttribute("class", "history-btn");
    this.buttons["next"] = document.createElement("button");
    this.buttons["next"].innerText = "Next move";
    this.buttons["next"].setAttribute("class", "history-btn");
    this.movesList.setAttribute("class", "moves-list");
    this.movesList.innerHTML = "<div class='move-list-header'>Normlanie lista ruchów tu będzie</div>";

    this.buttons["toggleWhiteCS"].addEventListener("click", ()=>{
      board.removeControlledSquares();
      this.showCsW = !this.showCsW;
      this.showCsB = false;
      if(this.showCsW){
        board.getControlledSquares();
        board.showControlledSquares(true);
      }
    })

    this.buttons["toggleBlackCS"].addEventListener("click", ()=>{
      board.removeControlledSquares();
      this.showCsB = !this.showCsB;
      this.showCsW = false;
      if(this.showCsB){
        board.getControlledSquares();
        board.showControlledSquares(false);
      }
    })

    this.buttons["previous"].addEventListener("click", ()=>{
      this.handlePrevious(this.gameController.movesHistory, board)
    });

    this.buttons["next"].addEventListener("click", ()=>{
      this.handleNext(this.gameController.movesHistory, board)
    });

    this.pgnBtn.addEventListener("click", ()=>{
      this.pgnText.value = board.getPGN();
      this.pgnModalWrapper.style.display = "inline-block";
    })

    this.pgnExit.addEventListener("click", ()=>{
      this.pgnModalWrapper.style.display = "none";
    })

    this.pgnCopy.addEventListener("click", ()=>{
      navigator.clipboard.writeText(this.pgnText.value);
    })

    for (const btn of Object.keys(this.buttons)) {
      this.buttonWrapper.append(this.buttons[btn])
    }

    this.pgnModal.append(this.pgnText, this.pgnExit, this.pgnCopy);
    this.pgnModalWrapper.append(this.pgnModal);
    this.wrapper.append(this.buttonWrapper, this.movesList, this.pgnBtn, this.pgnModalWrapper);
    document.body.appendChild(this.wrapper);
  }

  updateMoves(movesHistory){
    this.movesList.innerHTML = "<div class='move-list-header'> Normlanie lista ruchów tu będzie</div>";
    
    //map moves to ids
    this.gameController.movesHistory.mapToId();
    //display moves
    for (let i = 1; i < movesHistory.length; i++) {
      let move = movesHistory.movesMap[i];

      if(!move.move) return;
      let divMove = document.createElement("div");
      divMove.setAttribute("class", "move");
      this.movesList.appendChild(divMove);

      divMove.addEventListener("click", ()=>{
        this.board.removePieces();
        this.board.readFEN(move.pos);
        this.currentMove = Array.prototype.indexOf.call(divMove.parentNode.children, divMove);
        this.updateCurrentMove()
        this.handleHighlight(this.board);
      })
      divMove.innerHTML = (i%2==1) ? Math.ceil(i/2) +"."+ move.move : move.move;

    }
    if(this.gameController.currentGameStatus !== this.gameController.gameStatus.active || this.gameController.currentGameStatus !== this.gameController.gameStatus.paused){
      switch (this.gameController.currentGameStatus) {
        case this.gameController.gameStatus.draw:
           this.movesList.innerHTML += "<div class='move'>1/2-1/2</div>";
          break;
        case this.gameController.gameStatus.white_won:
           this.movesList.innerHTML += "<div class='move'>1-0</div>";
          break;
        case this.gameController.gameStatus.black_won:
           this.movesList.innerHTML += "<div class='move'>0-1</div>";
          break;
        default:
          break;
      }
    }
  }
  
  updateCurrentMove(){
    this.movesList.childNodes.forEach(child=>{
      if(child.classList[0]=="move"){
        child.style.background = "none"
      };
    })
    this.movesList.childNodes[this.currentMove].style.background = "rgba(27, 83, 129, 0.4)"
  }
}

export default UserInterface;