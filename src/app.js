import "./view/game";
import {model} from './model'
import { rerenderView, makeAnimationTiles, renderGameOverMessage, explodeTile, removeExplosion} from './view/game';
import { initialize, createModelPlayField } from "./controller";

initialize(model, {
   rerenderView,
   makeAnimationTiles, 
   renderGameOverMessage, 
   explodeTile, 
   removeExplosion
})

createModelPlayField()