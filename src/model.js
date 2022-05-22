export const model = {
  tiles: [],
  PLAYFIELD_LENGTH: 10,
  attemptsAvailableNumber: 100,
  progressValue: 0,
  progressLength: 350,
  scoreValue: 10,
  pointsToWin: 1000
}

const progressLength = 350;
const colors = ['blue', 'red', 'yellow', 'green', 'purple']

function createModelPlayField(){
  for(let i = 0; i< model.PLAYFIELD_LENGTH; i++){
    model.tiles.push([])
    for(let j = 0; j< model.PLAYFIELD_LENGTH; j++){
      const randomColor = colors[Math.floor((Math.random()*4))]
      model.tiles[i].push(randomColor)
    }
  }
}
createModelPlayField()