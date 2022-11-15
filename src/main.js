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

const main = () => {
drawZakkBoard();
}

const drawZakkBoard = () => {
  
  for (var rowNum = 0; rowNum < zakkboard.length; rowNum++) {
   const currentRow = zakkboard[rowNum];
   Row(currentRow.length, rowNum)
 }
}

function Row(numberOfSquaresToDraw, rowNum) {
    for (let colNum = 0; colNum < numberOfSquaresToDraw; colNum++) {
      const xPosition = squareSize*colNum
      const yPostition = squareSize*rowNum;
      const isOddCol = colNum%2;
      const isOddRow = rowNum%2
      const isOdd = (isOddCol) - (isOddRow);

      drawPostitionSquare(xPosition, yPostition,isOdd);
    }
  }
function drawPostitionSquare(x, y, isFilled) {
  if (isFilled) {
    ctx.fillRect(x, y, squareSize, squareSize);
    ctx.closePath();

  } else { 
    ctx.rect(x, y, squareSize, squareSize);
    ctx.stroke();
    ctx.closePath();
  }
}


main();