const DEFAULT_ATTEMPTS_NUMBER = 10
export const model = {
  tiles: [],
  attemptsAvailableNumber: DEFAULT_ATTEMPTS_NUMBER,
  PLAYFIELD_LENGTH: 10,
  progressValue: 0,
  progressLength: 350,
  scoreValue: 0,
  pointsToWin: 400,
  colors: ['blue', 'red', 'yellow', 'green', 'purple'],
  animationIsFinished: true,
  gameIsFinished: false,
  defaultAttemptsNumber: DEFAULT_ATTEMPTS_NUMBER,
  shuffleNumber: 3,
  boosterRadius: 2,
  booster: false
}

export function createModelPlayField(){
  model.tiles = [];
  model.gameIsFinished = false;
  for(let i = 0; i< model.PLAYFIELD_LENGTH; i++){
    model.tiles.push([])
    for(let j = 0; j< model.PLAYFIELD_LENGTH; j++){
      const randomColor = model.colors[Math.floor((Math.random()*4))]
      model.tiles[i].push(randomColor)
    }
  }
}
createModelPlayField()