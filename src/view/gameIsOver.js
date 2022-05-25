import * as PIXI from "pixi.js";
import {model } from '../model';
import {resetCounters, createModelPlayField} from '../controller';

export function showMessage(result){
  const Graphics = PIXI.Graphics;
  let message;
  let textPosition = 100;
  let fontColor = '#d0def5'
  const messageContainer = new PIXI.Container()
  messageContainer.x = 200
  messageContainer.y = 100
  messageContainer.zIndex = 10;

  const transparentBg = new Graphics();
  transparentBg.beginFill().drawRect(-200, -100, 800, 600).endFill()
  transparentBg.alpha= 0.5;
  messageContainer.addChild(transparentBg);

  const messageBg = new Graphics();
  messageBg.beginFill(0x061d54).lineStyle(8, 0xf08de3, .7).drawRoundedRect(0, 0, 400, 400, 15).endFill()
  messageContainer.addChild(messageBg);


  const textStyle = new PIXI.TextStyle({
    fontFamily: 'Genta',
    fill: '#fff',
    align: "center",
    fontSize: 20
  });
  
  if(result === 'win'){
    message = 'YOU WIN!'
    textPosition = 50;
    fontColor = '#f08de3'
    const textPoints = new PIXI.Text(`Score is: ${model.scoreValue}`, {...textStyle, fontSize: 40, fill: '#f08de3'});
    textPoints.position.set(100, 150);
    messageContainer.addChild(textPoints);
  }  else {
    message = 'GAME OVER!'
  }

  model.gameIsFinished = true;

  const textMessage = new PIXI.Text(message, {...textStyle, fontSize: 60, fill: fontColor});
  textMessage.position.set(200, textPosition);
  textMessage.anchor.set(0.5, 0.5);
  messageContainer.addChild(textMessage);
  
  const startNewGameBtn = new Graphics();
  startNewGameBtn.beginFill(0xf08de3).lineStyle(8, 0xf0aae7, .7).drawRoundedRect(100, 250, 200, 50, 15).endFill()
  messageContainer.addChild(startNewGameBtn);
  startNewGameBtn.interactive = true;
  startNewGameBtn.buttonMode = true;

  startNewGameBtn.on('pointerdown', function(){
    createModelPlayField()
    model.shuffleNumber = 3;
    resetCounters()
    messageContainer.parent.removeChild(messageContainer);
  })

  const textStartNewGame = new PIXI.Text('START NEW GAME', {...textStyle, fill: '#961d87'});
  textStartNewGame.position.set(130, 265);
  messageContainer.addChild(textStartNewGame);

  return messageContainer;
}
