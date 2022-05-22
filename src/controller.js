import {model} from './model'
import { rerenderView, makeAnimationTiles } from './view';

export function onTileClick(coordinates, shouldUpdateAttemptsNumber = false){
  updateCounters(shouldUpdateAttemptsNumber)
  const [i, j] = coordinates;
  checkNeighbours(i, j)
  rerenderView()
  makeAnimationTiles()
  setTimeout(function(){
    descendTiles()
    rerenderView()
  }, 1500)
}


function checkNeighbours(i, j){
  const tileColor = model.tiles[i][j]
  model.tiles[i][j] = null;
  if(i!=0 && model.tiles[i-1][j] === tileColor){
    checkNeighbours(i-1, j)
  }
  if(i!=9 && model.tiles[i+1][j] === tileColor){
    checkNeighbours(i+1, j)
  }
  if(j!=0 && model.tiles[i][j-1] === tileColor){
    checkNeighbours(i, j-1)
  }
  if(j!=9 && model.tiles[i][j+1] === tileColor){
    checkNeighbours(i, j+1)
  }
}

function updateCounters(shouldUpdateAttemptsNumber){
  model.scoreValue +=10;
  model.progressValue = Math.floor(model.scoreValue/model.pointsToWin * model.progressLength)
  if(shouldUpdateAttemptsNumber){
    model.attemptsAvailableNumber -= 1
  }
}

function descendTiles(){
  for(let i = model.tiles.length-1; i> 1; i--){
    for(let j = 0; j< model.tiles[i].length; j++){
      if(model.tiles[i][j] == null){
        descendColumn(i, j);
      }
    }
  }
}

function descendColumn(row, column){
  let nullNumber = 0;
  let highestExistingElement = 0;
  for(let i = row; i>0; i--){
    if(model.tiles[i][column] == null){
      nullNumber += 1;
    } else {
      break;
    }
  }
  for (let i = row; i >= nullNumber; i--){ 
    model.tiles[i][column] = model.tiles[i-nullNumber][column];
  }

  for(let i = 0; i< model.tiles.length; i++){
    if(model.tiles[i][column] != null) {
      highestExistingElement = i
      break;
    }
  }

  for(let i = highestExistingElement; i < nullNumber; i++){
    model.tiles[i][column] = null
  }
}
