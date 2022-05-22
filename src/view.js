import * as PIXI from "pixi.js";
import blue from '../assets/blue.png';
import green from '../assets/green.png';
import purple from '../assets/purple.png';
import yellow from '../assets/yellow.png';
import red from '../assets/red.png';
import attemptsAvailable from '../assets/attempts-available.png';
import progressBarBg from '../assets/progress-bar-bg.png';
import progress from '../assets/progress.png';
import {model} from './model';
import {onTileClick} from './controller';

let playFieldContainer;
const Graphics = PIXI.Graphics;
let scoreNumber;
let attemptsNumber;
let progressLine;
let app;

function renderView(){
  app = initialize()
  playFieldContainer = createPlayField();
  fillGameField(playFieldContainer);
}
renderView();

export function rerenderView(){
  destroyTiles()
  fillGameField(playFieldContainer);
  updateCounters()
}

function destroyTiles(){
  playFieldContainer.removeChild(...playFieldContainer.children)
  const playField = new Graphics();
  playField.beginFill(0x0d233d).lineStyle(8, 0xa3bfff, .7).drawRoundedRect(0, 0, 450, 450, 30).endFill()
  
  playFieldContainer.addChild(playField)
}

function initialize(){
  const Application = PIXI.Application;
  
  const app = new Application({
    backgroundColor: 0xa1a1a1,
    width: 800,
    height: 600
  })
  document.body.appendChild(app.view)
  return app;
}


function updateCounters(){
  scoreNumber.text = `score: ${String(model.scoreValue)}`
  attemptsNumber.text = model.attemptsAvailableNumber
  progressLine.width = model.progressValue
}

export function makeAnimationTiles(){
  for(let i = model.tiles.length-1; i> 1; i--){
    for(let j = 0; j< model.tiles[i].length; j++){
      if(model.tiles[i][j] == null){
        moveTilesDown(i, j);
      }
    }
  }
}

function moveTilesDown(row, column){

  let nullNumber = 0;
  for(let i = row; i>0; i--){
    if(model.tiles[i][column] == null){
      nullNumber += 1;
    } else {
      break;
    }
  }
  for (let i = row; i >= nullNumber; i--){ 
    moveEachTileDown(`${[i-nullNumber]}-${[column]}`)
  }
}


function moveEachTileDown(tile){
  let pixiTileElement = playFieldContainer.children.find(el => el.name === tile)
  if(!pixiTileElement){
    return
  }
  const ticker = new PIXI.Ticker()
  ticker.add( () => makeAStepDown(pixiTileElement))
  ticker.start()
  let movingCounter = 0
  function makeAStepDown(tile){
    if(movingCounter > 40){
      ticker.destroy()
    } else {
      movingCounter += 1;
      tile.y +=1;
    }
  }
}

// figures
function createPlayField(){
  
  const playFieldContainer = new PIXI.Container()
  playFieldContainer.x = 0
  playFieldContainer.y = 150
  app.stage.addChild(playFieldContainer)
  
  const playField = new Graphics();
  playField.beginFill(0x0d233d).lineStyle(8, 0xa3bfff, .7).drawRoundedRect(0, 0, 450, 450, 30).endFill()
  
  playFieldContainer.addChild(playField)
  

  const scoreContainer = new PIXI.Container()
  scoreContainer.x = 500
  scoreContainer.y = 150
  app.stage.addChild(scoreContainer)
  
  const scoreBackground = new Graphics();
  scoreBackground.beginFill(0x20549a).lineStyle(5, 0xa3bfff, 1).drawRoundedRect(0, 0, 250, 250, 30).endFill()
  
  scoreContainer.addChild(scoreBackground)
  
  const pointsField = new Graphics();
  pointsField.beginFill(0x061d54).drawRoundedRect(40, 160, 170, 70, 15).endFill()
  
  scoreContainer.addChild(pointsField);
  
  const attempts = PIXI.Sprite.from(attemptsAvailable);
  scoreContainer.addChild(attempts);
  attempts.width = 150;
  attempts.height = 150;
  attempts.x = 50;
  attempts.y = 0;

  const textStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 48,
    fill: '#fff',
  });
  attemptsNumber = new PIXI.Text(String(model.attemptsAvailableNumber), textStyle)
  attemptsNumber.anchor.set(0.5, 0.5);
  attemptsNumber.position.set(125, 70);
  scoreContainer.addChild(attemptsNumber)

  scoreNumber = new PIXI.Text(`score: ${model.scoreValue}`, {fontSize: 24, fill: '#fff', align: "center"})
  scoreNumber.anchor.set(0.5, 0.5);
  scoreNumber.position.set(125, 190);
  scoreNumber.style.wordWrap = true;
  scoreContainer.addChild(scoreNumber)


  const progressContainer = new PIXI.Container()
  progressContainer.x = 200
  progressContainer.y = 10
  app.stage.addChild(progressContainer)

  const pointsToWin = new PIXI.Text(String(model.pointsToWin), {fontSize: 20, fill: '#fff'});
  pointsToWin.position.set(450, 30);
  progressContainer.addChild(pointsToWin);
  
  const progressBar = new Graphics();
  progressBar.beginFill(0x061d54).drawRoundedRect(0, 0, 400, 70, 15).endFill()
  progressContainer.addChild(progressBar);
  
  const textProgress = new PIXI.Text('progress', {fontSize: 20, fill: '#fff'});
  textProgress.position.set(150, 0);
  progressContainer.addChild(textProgress);

  const progressBg = PIXI.Sprite.from(progressBarBg);
  progressContainer.addChild(progressBg);
  progressBg.width = model.progressLength;
  progressBg.height = 30;
  progressBg.x = 25;
  progressBg.y = 30;

  progressLine = PIXI.Sprite.from(progress);
  progressContainer.addChild(progressLine);
  progressLine.width = model.progressValue;
  progressLine.height = 30;
  progressLine.x = 25;
  progressLine.y = 30;

  return playFieldContainer;
}

// functions

function fillGameField(playFieldContainer){
  const colors = {
    'blue': blue,
    'red': red,
    'purple': purple,
    'yellow': yellow,
    'green': green
  }
  for(let i = 0; i<model.tiles.length; i++){
    for(let j = 0; j<model.tiles[i].length; j++){
      if(!colors[model.tiles[i][j]]) {
        continue;
      }
      const star = PIXI.Sprite.from(colors[model.tiles[i][j]]);
      playFieldContainer.addChild(star);
      star.interactive = true;
      star.buttonMode = true;
      star.width = 40;
      star.height = 40;
      star.x = j * 41 + 20;
      star.y = i * 41 + 10;
      star.name = `${i}-${j}`
      const coordinates = [i, j];
      star.on('pointerdown', function(){
        onTileClick(coordinates, true)
      });
    }
  }
}


