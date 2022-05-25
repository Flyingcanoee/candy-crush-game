import {model} from './model'
import { rerenderView, makeAnimationTiles, renderGameOverMessage} from './view/game';

export function onTileClick(coordinates){
  const [i, j] = coordinates;
  if(model.booster){
    model.tiles[i][j] = null;
    let count = 1;
    for(let k = i-model.boosterRadius+1; k < i+model.boosterRadius; k++) {
      for(let l = j-model.boosterRadius+1; l < j+model.boosterRadius; l++) {
        if( model.tiles[k] &&  model.tiles[k][l]){
          model.tiles[k][l] = null;
          count += 1
        }
      }
    }
    model.booster = false;
    updateCounters(count)
  } else{
    const tilesQuantity = checkNeighbours(i, j)
    updateCounters( tilesQuantity)
  }
  rerenderView()
  model.animationIsFinished = false;

  makeAnimationTiles()
  setTimeout(function(){
    descendTiles()
    generateNewTiles()
    model.animationIsFinished = true;
    rerenderView()
  }, 1500)
}


function checkNeighbours(i, j){
  let tilesQuantity = 1;
  const tileColor = model.tiles[i][j]
  model.tiles[i][j] = null;
  if(i!=0 && model.tiles[i-1][j] === tileColor){
    let innerTilesQuantity = checkNeighbours(i-1, j);
    tilesQuantity += innerTilesQuantity;
  }
  if(i!=9 && model.tiles[i+1][j] === tileColor){
    let innerTilesQuantity = checkNeighbours(i+1, j);
    tilesQuantity += innerTilesQuantity;
  }
  if(j!=0 && model.tiles[i][j-1] === tileColor){
    let innerTilesQuantity = checkNeighbours(i, j-1);
    tilesQuantity += innerTilesQuantity;
  }
  if(j!=9 && model.tiles[i][j+1] === tileColor){
    let innerTilesQuantity = checkNeighbours(i, j+1);
    tilesQuantity += innerTilesQuantity;
  }
  return tilesQuantity;
}

function updateCounters( tilesQuantity){
  model.scoreValue += 10 * tilesQuantity;
  model.progressValue = Math.floor(model.scoreValue/model.pointsToWin * model.progressLength)
  if(model.scoreValue >= model.pointsToWin){
    model.gameIsFinished = true;
    renderGameOverMessage('win')
  } else {
    if(model.attemptsAvailableNumber < 2 ){
      model.gameIsFinished = true;
      renderGameOverMessage('lose')
    } 
      model.attemptsAvailableNumber -= 1
  }
}
export function resetCounters(){
  model.scoreValue = 0;
  model.progressValue = 0;
  model.attemptsAvailableNumber = model.defaultAttemptsNumber;
  rerenderView()
}

function descendTiles(){
  let emptySpaces = [];
  for(let i = model.tiles.length-1; i> 0; i--){
    for(let j = 0; j< model.tiles[i].length; j++){
      if(model.tiles[i][j] == null){
        emptySpaces.push(descendColumn(i, j));
      }
    }
  }
  return emptySpaces;
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
  return {nullNumber, column}
}

function generateNewTiles(){

  for(let i = 0; i<model.tiles.length; i++){
    for(let j = 0; j<model.tiles[i].length; j++){
      if(model.tiles[i][j] == null){
        model.tiles[i][j] = model.colors[Math.floor((Math.random()*4))]
      }
    }
  }
}

export function makeBombBooster(){
  model.booster = true;
}