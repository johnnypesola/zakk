let isGameOver = false;
const canvasEl = document.getElementById('the-canvas');
const ctx = canvasEl.getContext("2d");
const squareSize = 60;

const A =[ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const B =[ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const C =[ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const D =[ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const E =[ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const F =[ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const G =[ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const H =[ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const zakkboard = [A, B, C, D, E, F, G, H];

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

const main = async () => {
  await loadImages();
  drawZakkBoard();
  initZakkPieces();
}

const initZakkPieces = () => {
  playerColors.forEach((playerColor) => {
    const y = playerColor === "white" ? 0 : zakkboard.length - 1;
    
    // Render pawns
    const pawnY = playerColor === "white" ? y + 1 : y - 1;
    for(let i = 0; i < A.length; i++){
      renderZakkPiece(playerColor, "pawn", i, pawnY);
    }
    renderZakkPiece(playerColor, "rook", 0, y);
    renderZakkPiece(playerColor, "knight", 1, y);
    renderZakkPiece(playerColor, "bishop", 2, y);
    renderZakkPiece(playerColor, "queen", 3, y);
    renderZakkPiece(playerColor, "king", 4, y);
    renderZakkPiece(playerColor, "bishop", 5, y);
    renderZakkPiece(playerColor, "knight", 6, y);
    renderZakkPiece(playerColor, "rook", 7, y);
  })
}

const renderZakkPiece = (playerColor, zakkPieceName, x, y) => {
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

const drawZakkBoard = () => {
  
  for (var rowNum = 0; rowNum < zakkboard.length; rowNum++) {
   const currentRow = zakkboard[rowNum];
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
  const isFilled = isOddSquare(x, y)

  if (isFilled) {
    ctx.fillStyle = "#aaa";
    ctx.fillRect(xPos, yPos, squareSize, squareSize);
    ctx.closePath();

  } else { 
    ctx.fillStyle = "#888";
    ctx.fillRect(xPos, yPos, squareSize, squareSize);
    ctx.closePath();
  }
}

main();