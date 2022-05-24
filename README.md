# chess-js

## Description
Website where you can play chess on a JavaScript chessboard. All moves are validated before they are played which means that user cannot play a move that would be illegal in normal chess game. 
Goal of this project was to write vanilla JavaScript (ES6) application.

Website: https://pawel-matuszak.github.io/chess-js

## Features
* __castling__ - both sides can castle kingside or queenside only if it is legal
* __threat map for both colors__ - highlights squares controlled by player’s pieces
* __previous and next move navigation__ - used to navigate moves history
* __restart__ - restart the game by putting pieces on their initial squares and clearing moves history
* __computer vs computer__ - both sides are making random legal moves
* __moves history__ - displays all the moves that where played in the current game. Selecting a move will set the board to a position when this move was played
* __get PGN__ - show a string of all moves played in the game 

## Gallery
>![chess board](/src/images/s.PNG)
