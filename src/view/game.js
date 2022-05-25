import * as PIXI from "pixi.js";
import blue from '../../assets/blue.png';
import green from '../../assets/green.png';
import purple from '../../assets/purple.png';
import yellow from '../../assets/yellow.png';
import red from '../../assets/red.png';
import attemptsAvailable from '../../assets/attempts-available.png';
import progressBarBg from '../../assets/progress-bar-bg.png';
import progress from '../../assets/progress.png';
import scoreToWinImage from '../../assets/score-to-win.png';
import shuffleNumberImage from '../../assets/shuffle-number-image.png'
import shuffleImage from '../../assets/shuffleImage.png'
import boosterBombImage from '../../assets/booster-bomb.png'
import boosterTeleportImage from '../../assets/booster-teleport.png'
import boosterQuestionImage from '../../assets/booster-question.png'
import {model, createModelPlayField} from '../model';
import {onTileClick, resetCounters, makeBombBooster} from '../controller';
import {startGame} from './startGame'
import { showMessage } from "./gameIsOver";


let playFieldContainer;
const Graphics = PIXI.Graphics;
let scoreNumber;
let attemptsNumber;
let progressLine;
let shuffleNumberValue;
let app;
let boosterBombBg;
const textStyle = new PIXI.TextStyle({
  fontFamily: 'Genta',
  fill: '#fff',
  align: "center",
  fontSize: 20
});

export function renderView(){
  app = initialize()
  playFieldContainer = createPlayField();
  fillGameField(playFieldContainer);
}
renderView();

export function rerenderView(){
  destroyTiles()
  fillGameField(playFieldContainer);
  updateCounters()
  if(!model.booster){
    boosterBombBg.width = 0;
  }
}

function destroyTiles(){
  playFieldContainer.removeChild(...playFieldContainer.children)
  playFieldContainer.addChild(createTilesContainer())
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
  shuffleNumberValue.text = model.shuffleNumber
  if(model.gameIsFinished && model.scoreValue> model.pointsToWin){
    progressLine.width = model.progressLength
  }
}

export function makeAnimationTiles(){
  for(let i = model.tiles.length-1; i > 0; i--){
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

function createTilesContainer(){
  const playField = new Graphics();
  playField.beginFill(0x0d233d).lineStyle(8, 0xa3bfff, .7).drawRoundedRect(0, -10, 450, 450, 30).endFill()
  return playField
}

// figures
function createPlayField(){
  
  const playFieldContainer = new PIXI.Container()
  playFieldContainer.x = 10
  playFieldContainer.y = 130
  app.stage.addChild(playFieldContainer)
  
  playFieldContainer.addChild(createTilesContainer())

  const scoreContainer = new PIXI.Container()
  scoreContainer.x = 500
  scoreContainer.y = 120
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

  attemptsNumber = new PIXI.Text(String(model.attemptsAvailableNumber),  {...textStyle, fontSize: 50})
  attemptsNumber.anchor.set(0.5, 0.5);
  attemptsNumber.position.set(125, 70);
  scoreContainer.addChild(attemptsNumber)

  scoreNumber = new PIXI.Text(`score: ${model.scoreValue}`, {...textStyle, fontSize: 24})
  scoreNumber.anchor.set(0.5, 0.5);
  scoreNumber.position.set(125, 190);
  scoreNumber.style.wordWrap = true;
  scoreContainer.addChild(scoreNumber)


  const progressContainer = new PIXI.Container()
  progressContainer.x = 200
  progressContainer.y = 10
  app.stage.addChild(progressContainer)

  
  const scoreToWin = PIXI.Sprite.from(scoreToWinImage);
  progressContainer.addChild(scoreToWin);
  scoreToWin.width = 100;
  scoreToWin.height = 50;
  scoreToWin.x = 430;
  scoreToWin.y = 10;

  const pointsToWin = new PIXI.Text(String(model.pointsToWin), textStyle);
  pointsToWin.position.set(455, 22);
  progressContainer.addChild(pointsToWin);
  
  const progressBar = new Graphics();
  progressBar.beginFill(0x061d54).drawRoundedRect(0, 0, 400, 70, 15).endFill()
  progressContainer.addChild(progressBar);
  
  const textProgress = new PIXI.Text('PROGRESS', textStyle);
  textProgress.position.set(150, 5);
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

  const shuffle = PIXI.Sprite.from(shuffleImage);
  progressContainer.addChild(shuffle);
  shuffle.width = 100;
  shuffle.height = 50;
  shuffle.x = -130;
  shuffle.y = 10;
  shuffle.buttonMode = true;
  shuffle.interactive = true;
  shuffle.on('pointerdown', function(){
    if(model.shuffleNumber > 0){
      createModelPlayField();
      model.shuffleNumber -=1
      rerenderView();
    }
  })

  const shuffleNumber = PIXI.Sprite.from(shuffleNumberImage)
  progressContainer.addChild(shuffleNumber);
  shuffleNumber.x = -190;
  shuffleNumber.y = 10;
  shuffleNumber.width = 50;
  shuffleNumber.height = 50;

  shuffleNumberValue = new PIXI.Text(String(model.shuffleNumber), {...textStyle, fontSize: 36});
  shuffleNumberValue.position.set(-163, 32);
  shuffleNumberValue.anchor.set(0.5, 0.5)
  progressContainer.addChild(shuffleNumberValue);

  const boosterContainer = new PIXI.Container()
  boosterContainer.x = 500
  boosterContainer.y = 400
  app.stage.addChild(boosterContainer)

  boosterBombBg = new Graphics();
  boosterBombBg.beginFill(0x061d54).lineStyle(10, 0xfc2d75, .7).drawRoundedRect(8, 3, 87, 87, 20).endFill()
  boosterBombBg.width = 0;
  boosterContainer.addChild(boosterBombBg);

  const boosterBomb = PIXI.Sprite.from(boosterBombImage);
  boosterContainer.addChild(boosterBomb);
  boosterBomb.width = 100;
  boosterBomb.height = 100;
  boosterBomb.x = 0;
  boosterBomb.y = 0;
  boosterBomb.buttonMode = true;
  boosterBomb.interactive = true;
  boosterBomb.on('pointerdown', function(){
    makeBombBooster()
    boosterBombBg.width = 94;
  })

  const boosterTeleport = PIXI.Sprite.from(boosterTeleportImage);
  boosterContainer.addChild(boosterTeleport);
  boosterTeleport.width = 70;
  boosterTeleport.height = 70;
  boosterTeleport.x = 170;
  boosterTeleport.y = 15;

  const boosterQuestion = PIXI.Sprite.from(boosterQuestionImage);
  boosterContainer.addChild(boosterQuestion);
  boosterQuestion.width = 70;
  boosterQuestion.height = 70;
  boosterQuestion.x = 100;
  boosterQuestion.y = 15;

  app.stage.addChild( startGame())


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
        if(model.animationIsFinished && !model.gameIsFinished){
          onTileClick(coordinates)
        }
      });
    }
  }
}

export function renderGameOverMessage(result){
  app.stage.addChild(showMessage(result));
}
