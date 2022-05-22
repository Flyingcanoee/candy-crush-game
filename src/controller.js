import {model} from './model'
import { rerenderView } from './view';

export function onTileClick(coordinates, shouldUpdateAttemptsNumber = false){
  updateCounters(shouldUpdateAttemptsNumber)
  const [i, j] = coordinates;
  checkNeighbours(i, j)
  rerenderView()
}

function checkNeighbours(i,j){
  const tileColor = model.tiles[i][j]
  model.tiles[i][j] = null;
  if(i!=0 && model.tiles[i-1][j] === tileColor){
      onTileClick([i-1, j])
  }
  if(i!=9 && model.tiles[i+1][j] === tileColor){
    onTileClick([i+1, j])
  }
  if(j!=0 && model.tiles[i][j-1] === tileColor){
    onTileClick([i, j-1])
  }
  if(j!=9 && model.tiles[i][j+1] === tileColor){
    onTileClick([i, j+1])
  }
}

function updateCounters(shouldUpdateAttemptsNumber){
  model.scoreValue +=10;
  model.progressValue = Math.floor(model.scoreValue/model.pointsToWin * model.progressLength)
  if(shouldUpdateAttemptsNumber){
    model.attemptsAvailableNumber -= 1
  }
}