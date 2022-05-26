const DEFAULT_ATTEMPTS_NUMBER = 10;
const COLORS_QUANTITY = 5;
const COLORS = ['blue', 'red', 'yellow', 'green', 'purple'];
export const model = {
  tiles: [],
  attemptsAvailableNumber: DEFAULT_ATTEMPTS_NUMBER,
  PLAYFIELD_LENGTH: 10,
  progressValue: 0,
  progressLength: 350,
  scoreValue: 0,
  pointsToWin: 400,
  colors: COLORS,
  colorsQuantity: COLORS_QUANTITY,
  animationIsFinished: true,
  gameIsFinished: false,
  defaultAttemptsNumber: DEFAULT_ATTEMPTS_NUMBER,
  shuffleNumber: 3,
  boosterRadius: 2,
  booster: false,
};
