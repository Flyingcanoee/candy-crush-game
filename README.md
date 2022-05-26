## About the project
![Image alt](https://github.com/Flyingcanoee/candy-crush-game/raw/main/candy-crush-clone.gif)

## [Live Demo]([link to github-pages](https://flyingcanoee.github.io/candy-crush-game/))

This is an online 2d game implemented with JavaScript + Canvas. The game logic was divided between model, view and controller. There were used such technologies as:

- Pixi.js for dealing with canvas and animating
- parcel for bundling
- eslint, prettier for code formatting
- jest for unit testing, test-coverage is about 70% for business logic.

### Game logic

- Play field contains different colored tiles. When you click on a tile, this particular tile and its neighbors
  with the same color are destroyed. Destruction of each tile increases score, so the more tiles with the same color are destroyed, the more points player will get. When the gained points are equal to the needed points quantity, or if the moves end, the game finishes
- There are two opportunities to gain more points in one move, by clicking on booster-icon — it will explode tiles in the certain radius, or shuffle tiles, if there are no lucky combinations
- Game has three scenes:
  - Start the game message
  - Game process
  - Game over: when player loses or wins, with the corresponding message

## Project setup

```js
npm install
npm run serve
```

## Future scope

- Provide the ability to use other boosters
- Add tests for view
