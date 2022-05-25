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

  //used for creating user interface
  //type sould be valid tag name
  //returns html element
  createHTMLElement({type, className, textContent}){
    let element = document.createElement(type);
    element.innerHTML = textContent;
    element.setAttribute("class", className);
    return element;
  }


  init(board, gameController){
    this.wrapper = document.createElement("div");
    this.wrapper.setAttribute("class", "wrapper");
    this.buttonWrapper = document.createElement("div");
    this.buttonWrapper.setAttribute("class", "button-wrapper");

    this.pgnBtn = this.createHTMLElement({type:"button", className: "pgnBtn", textContent: "Download PGN"})

    this.pgnModalWrapper = this.createHTMLElement({type: "div", className: "pgnModalWrapper", textContent: "White threat map"})
    this.pgnModalWrapper.style.display = "none";

    this.pgnModal = this.createHTMLElement({type: "div", className: "pgnModal", textContent: "PGN"})

    this.pgnExit = this.createHTMLElement({type: "div", className: "pgnExit", textContent: "<i class='fas fa-times'></i>"})

    this.pgnText = this.createHTMLElement({type: "textarea", className: "pgnText", textContent: ""})
    this.pgnText.disabled = true;

    this.pgnCopy = this.createHTMLElement({type: "button", className: "pgnCopy", textContent: "Copy"})

    this.board = board;
    this.gameController = gameController;
    this.currentMove = gameController.halfmoveCount;

    this.buttons["toggleWhiteCS"] = this.createHTMLElement({type: "button", className: "", textContent: "White threat map"})
    this.buttons["toggleBlackCS"] = this.createHTMLElement({type: "button", className: "", textContent: "Black threat map"})

    this.buttons["previous"] = this.createHTMLElement({type: "button", className: "history-btn", textContent: "Previous move"})
    this.buttons["next"] = this.createHTMLElement({type: "button", className: "history-btn", textContent: "Next move"})

    this.buttons["restart"] = this.createHTMLElement({type: "button", className: "restart-btn", textContent: "Restart"})
    this.buttons["cvsc"] = this.createHTMLElement({type: "button", className: "cvsc-btn", textContent: "AI vs AI"})

    this.buttons["ai"] = this.createHTMLElement({type: "button", className: "ai-btn", textContent: "Play vs AI"})

    this.movesList.setAttribute("class", "moves-list");
    this.movesList.innerHTML = "<div class='move-list-header'></div>";

    this.buttons["toggleWhiteCS"].addEventListener("click", ()=>{
      board.removeControlledSquares();
      this.showCsW = !this.showCsW;
      this.showCsB = false;
      this.buttons["toggleWhiteCS"].style.background = "rgba(24, 99, 161, 0.9)";
      this.buttons["toggleBlackCS"].style.background = "rgba(24, 99, 161, 0.9)";

      if(this.showCsW){
        this.buttons["toggleWhiteCS"].style.background = "rgba(15, 67, 109, 0.9)";
        board.getControlledSquares();
        board.showControlledSquares(true);
      }
    })

    this.buttons["toggleBlackCS"].addEventListener("click", ()=>{
      board.removeControlledSquares();
      this.showCsB = !this.showCsB;
      this.showCsW = false;
      this.buttons["toggleWhiteCS"].style.background = "rgba(24, 99, 161, 0.9)";
      this.buttons["toggleBlackCS"].style.background = "rgba(24, 99, 161, 0.9)";

      if(this.showCsB){
        this.buttons["toggleBlackCS"].style.background = "rgba(15, 67, 109, 0.9)";
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

    this.buttons["restart"].addEventListener("click", ()=>{
      this.gameController.init("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", this.board);
    });

    //activates or disactivates AI vs AI game
    //when activated it will restart the game
    this.buttons["cvsc"].addEventListener("click", ()=>{
      this.gameController.computerActive = !this.gameController.computerActive;
      if(this.gameController.computerActive) this.buttons["restart"].click();

      if(this.gameController.computerActive) {
        //if playvsai was active before turn it off
        if(this.gameController.playVsAiActive){
          this.gameController.playVsAiActive = false;
          this.buttons["ai"].style.background = "rgba(24, 99, 161, 0.9)";
          this.gameController.endVsAI();  
        }
        this.gameController.playAIvsAI()
      }else{
        this.gameController.endAIvsAI();  
      };
      
      this.buttons["cvsc"].style.background = (this.gameController.computerActive) ? "rgba(15, 67, 109, 0.9)" : "rgba(24, 99, 161, 0.9)";
    });

    //activates or disactivates Play vs AI game
    //when activated it will restart the game
    this.buttons["ai"].addEventListener("click", ()=>{
      this.gameController.playVsAiActive = !this.gameController.playVsAiActive;
      if(this.gameController.playVsAiActive) this.buttons["restart"].click();

      
      if(this.gameController.playVsAiActive) {
        //if aivsai was active before turn it off
        if(this.gameController.computerActive){
          this.gameController.computerActive = false;
          this.buttons["cvsc"].style.background = "rgba(24, 99, 161, 0.9)";
          this.gameController.endAIvsAI();
        }
        this.gameController.playVsAI()
      }else{
        this.gameController.endVsAI();  
      };
      this.buttons["ai"].style.background = (this.gameController.playVsAiActive) ? "rgba(15, 67, 109, 0.9)" : "rgba(24, 99, 161, 0.9)";
    })

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
    document.querySelector(".container").append(this.wrapper)
    
  }

  updateMoves(movesHistory){
    this.movesList.innerHTML = "<div class='move-list-header'></div>";
    
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
        this.updateCurrentMove();
        this.handleHighlight(this.board);
      })
      divMove.innerHTML = (i%2==1) ? Math.ceil(i/2) +"."+ move.move : move.move;

    }
  }
  
  updateCurrentMove(){
    this.movesList.childNodes.forEach((child, i)=>{
      if(child.classList[0]=="move"){
        child.style.background = "none"
      };
    })
    this.movesList.childNodes[this.currentMove].style.background = "rgba(27, 83, 129, 0.4)"
  }
}

export default UserInterface;