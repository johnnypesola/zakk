let isGameOver = false;
const canvasEl = document.getElementById('the-canvas');
const ctx = canvasEl.getContext("2d");
const squareSize = 60;
const squareDivider = canvasEl.clientWidth / 8;

const xOffset = canvasEl.offsetLeft + canvasEl.clientLeft;
const yOffset = canvasEl.offsetTop + canvasEl.clientTop;

let highlightedPos;
let fromPos;
let selectedPiece;


class ZakkPiece {
  constructor(playerColor, zakkPieceType) {
    this.color = playerColor;
    this.type = zakkPieceType;    
  }
}

const A = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const B = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const C = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const D = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const E = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const F = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const G = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const H = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const zakkBoard = [A, B, C, D, E, F, G, H];

const zakkPieces = [
  "pawn",
  "rook",
  "knight",
  "bishop",
  "queen",
  "king",
];

const playerColors = ["black", "white"];

const zakkPieceImages = [];

const moveLogic = {
  pawn: (playerColor, fromX, fromY, toX, toY) => { 
    const modifier = playerColor === "white" ? 1 : -1;
    const canMove = toY === fromY + modifier && toX === fromX;
    return canMove;
  },
  rook: (playerColor, fromX, fromY, toX, toY) => {
    const canMove = toY === fromY && toX !== fromX ||
                    toX === fromX && toY !== fromY
    return canMove;
  },
  knight: (playerColor, fromX, fromY, toX, toY) => {
    const canMove = toY === fromY + 2 && toX == fromX + 1 ||
                    toY === fromY + 2 && toX == fromX - 1 ||

                    toY === fromY - 2 && toX == fromX - 1 ||
                    toY === fromY - 2 && toX == fromX + 1 ||
                    
                    toY === fromY + 1 && toX == fromX - 2 ||
                    toY === fromY + 1 && toX == fromX + 2 ||

                    toY === fromY - 1 && toX == fromX - 2 || 
                    toY === fromY - 1 && toX == fromX + 2;
    return canMove;
  },
  bishop: (playerColor, fromX, fromY, toX, toY) => {
    const canMove = Math.abs(fromX - toX) == Math.abs(fromY - toY);  
    return canMove;
  },
  king: (playerColor, fromX, fromY, toX, toY) => {
    const canMove = toY == fromY + 1 && toX == fromX + 1 || // Diagonal
                    toY == fromY - 1 && toX == fromX - 1 ||
                    toY == fromY + 1 && toX == fromX - 1 ||
                    toY == fromY - 1 && toX == fromX + 1 ||

                    toY == fromY + 1 && toX == fromX || // Non diagonal
                    toY == fromY - 1 && toX == fromX ||
                    toY == fromY + 1 && toX == fromX ||
                    toY == fromY - 1 && toX == fromX ||

                    toY == fromY && toX == fromX + 1 || // Non diagonal
                    toY == fromY && toX == fromX - 1 ||
                    toY == fromY && toX == fromX + 1 ||
                    toY == fromY && toX == fromX - 1
    return canMove;
  },

  queen: (playerColor, fromX, fromY, toX, toY) => {
    const canMove = Math.abs(fromX - toX) == Math.abs(fromY - toY) ||
                    toY === fromY && toX !== fromX ||
                    toX === fromX && toY !== fromY
    return canMove;
  }
}

const collisionLogic = {
  pawn: (playerColor, fromX, fromY, toX, toY) => {
    const posHasPiece = !!zakkBoard[toY][toX];
    return posHasPiece;
  },
  rook: (playerColor, fromX, fromY, toX, toY) => {
    const direction = fromY > toY ? "N":
                      fromY < toY ? "S":
                      fromX < toX ? "E": 
                      fromX > toX ? "W": 
                      null;

    const endCondition = direction === "N" ? fromY - toY: 
                      direction === "S" ? toY - fromY:
                      direction === "E" ? toX - fromX:
                      direction === "W" ? fromX - toX:
                      null;

    for(let i = 1; i < endCondition; i++) {
      let posHasPiece = false;

      switch(direction) {
        case "N":
          posHasPiece = !!zakkBoard[fromY-i][fromX];
          break;
        case "S": 
          posHasPiece = !!zakkBoard[fromY+i][fromX];
          break;
        case "E": 
          posHasPiece = !!zakkBoard[fromY][fromX+i];
          break;
        case "W": 
          posHasPiece = !!zakkBoard[fromY][fromX-i];
          break;
      }

      if(posHasPiece) return true;
    }
    return false;
  },
  knight: (playerColor, fromX, fromY, toX, toY) => {
    return false;
  },
  bishop: (playerColor, fromX, fromY, toX, toY) => {
    const direction = fromX < toX && fromY < toY ? "SE": 
                      fromX > toX && fromY > toY ? "NW": 
                      fromX < toX && fromY > toY ? "SW": 
                      fromX > toX && fromY < toY ? "NE":
                      null;

    const endCondition = direction === "SE" ? (toX - fromX): 
                         direction === "NW" ? (fromX - toX):
                         direction === "SW" ? (toX - fromX):
                         direction === "NE" ? (toY - fromY):
                         null;

    for(let i = 1; i < endCondition; i++) {
      let posHasPiece = false;
      switch (direction) {
        case "SE":
          posHasPiece = !!zakkBoard[fromY+i][fromX+i];
          break;
        case "NW": 
          posHasPiece = !!zakkBoard[fromY-i][fromX-i];
          break;
        case "SW": 
          posHasPiece = !!zakkBoard[fromY-i][fromX+i];
          break;
        case "NE": 
          posHasPiece = !!zakkBoard[fromY+i][fromX-i];
          break;
      }
      if(posHasPiece) return true;
    }
    
    return false;
  },
  king: (playerColor, fromX, fromY, toX, toY) => {
    return false;
  },
}

collisionLogic.queen = (...args) => collisionLogic.bishop(...args) || collisionLogic.rook(...args);

const main = async () => {
  await loadImages();
  drawBoard();
  resetPieces();
  addBoardEventListeners();
}

const resetPieces = () => {
  playerColors.forEach((playerColor) => {
    for(let i = 0; i < 8; i++) {
      const rowNum = playerColor === "white" ? 1 : 6;
      zakkBoard[rowNum][i] = new ZakkPiece(playerColor, "pawn");
    }

    let rowNum = playerColor === "white" ? 0 : 7;

    zakkBoard[rowNum] = [
      new ZakkPiece(playerColor, "rook"),
      new ZakkPiece(playerColor, "knight"),
      new ZakkPiece(playerColor, "bishop"),
      new ZakkPiece(playerColor, "queen"),
      new ZakkPiece(playerColor, "king"),
      new ZakkPiece(playerColor, "bishop"),
      new ZakkPiece(playerColor, "knight"),
      new ZakkPiece(playerColor, "rook")
    ]
  })

  renderPieces();
}

const renderPieces = () => {
  zakkBoard.forEach((rowArray, y) => {
    rowArray.forEach((zakkPiece, x) => {
      if(zakkPiece) {
        renderPiece(zakkPiece.color, zakkPiece.type, x, y)
      } else {
        drawBoardSquare(x, y);
      }
    })
  })
}

const renderPiece = (playerColor, zakkPieceName, x, y) => {
  drawBoardSquare(x, y);
  const imageToDraw = zakkPieceImages.find((image) => image.src.includes(playerColor + "-" + zakkPieceName));
  ctx.drawImage(imageToDraw, x * squareSize, y * squareSize);
}

const loadImage = async (imgName) => {
  var resolveFn;

  var promise = new Promise((resolve) => {
    resolveFn = resolve;
  });

  const img = new Image();   // Create new img element

  zakkPieceImages.push(img);

  img.addEventListener('load', () => {
    resolveFn();
  });

  img.src = "img/" + imgName + ".png"; // Set source path

  return promise;
}

const loadImages = async () => {
  const promises = [];

  playerColors.forEach(async (playerColor) => {
    zakkPieces.forEach(async (piece) => {
      const imageLoadingPromise = loadImage(playerColor + "-" + piece)
      promises.push(imageLoadingPromise);
    })
  })
  
  await Promise.all(promises);
}

const drawBoard = () => {
  
  for (var rowNum = 0; rowNum < zakkBoard.length; rowNum++) {
   const currentRow = zakkBoard[rowNum];
   drawBoardRow(currentRow.length, rowNum)
 }
}

const isOddSquare = (x, y) => {
  const isOddCol = x%2;
  const isOddRow = y%2
  const isOdd = (isOddCol) - (isOddRow);
  return isOdd;
}

const drawBoardRow = (numberOfSquaresToDraw, rowNum) => {
    for (let colNum = 0; colNum < numberOfSquaresToDraw; colNum++) {
      drawBoardSquare(colNum, rowNum);
    }
}

const drawBoardSquare = (x, y) => {
  const xPos = squareSize*x
  const yPos = squareSize*y;
  const isFilled = isOddSquare(x, y);

  const isHighlighted = highlightedPos && highlightedPos.x === x && highlightedPos.y === y
  const isFromSquare = fromPos && fromPos.x === x && fromPos.y === y;

  if(isHighlighted || isFromSquare) {
    ctx.fillStyle = "#99d";
    ctx.fillRect(xPos, yPos, squareSize, squareSize);
    ctx.closePath();
  } else if (isFilled) {
    ctx.fillStyle = "#aaa";
    ctx.fillRect(xPos, yPos, squareSize, squareSize);
    ctx.closePath();

  } else { 
    ctx.fillStyle = "#888";
    ctx.fillRect(xPos, yPos, squareSize, squareSize);
    ctx.closePath();
  }
}

const addBoardEventListeners = () => {


  canvasEl.addEventListener("click", (e) => {
    const x = e.pageX - xOffset;
    const y = e.pageY - yOffset;

    const clickedXPos = Math.floor(x / squareDivider);
    const clickedYPos = Math.floor(y / squareDivider);

    if(selectedPiece) {
      if(canMovePieceToPos(selectedPiece, fromPos.x, fromPos.y, clickedXPos, clickedYPos)) {
        highlightedPos = undefined;
        movePieceToPos(selectedPiece, clickedXPos, clickedYPos);
      }
    } else {
      selectPiece(zakkBoard[clickedYPos][clickedXPos], clickedXPos, clickedYPos);
    }
  })

  canvasEl.addEventListener("mousemove", (e) => {
    if(!selectedPiece) return;
    highlightedPos = toBoardPos(e.pageX, e.pageY);
    renderPieces();
  })
}

const canMovePieceToPos = (piece, fromX, fromY, toX, toY) => {
  const canMove = moveLogic[piece.type](piece.color, fromX, fromY, toX, toY);
  const doesPosHaveOwnPiece = zakkBoard[toY][toX] && zakkBoard[toY][toX].color === piece.color;

  const hasCollision = collisionLogic[piece.type](piece.color, fromX, fromY, toX, toY);

  console.log("hasCollision", hasCollision);

  return canMove && !hasCollision && !doesPosHaveOwnPiece;
}

const movePieceToPos = (zakkPiece, x, y) => {
  zakkBoard[fromPos.y][fromPos.x] = undefined;
  fromPos = null;
  selectedPiece = null;
  zakkBoard[y][x] = zakkPiece;
  renderPieces();
}

const selectPiece = (zakkPiece, x, y) => {
  selectedPiece = zakkPiece;
  fromPos = { x, y };
}

const toBoardPos = (x, y) => {
  return { x: Math.floor((x - xOffset) / squareDivider), y: Math.floor((y - yOffset) / squareDivider) };
}

main();