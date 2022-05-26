import {
  generateNewTiles,
  initialize,
  makeBombBooster,
  descendColumn,
  descendTiles,
  resetCounters,
  updateCounters,
  checkNeighbours,
  explodeBoosterArea,
  createModelPlayField,
} from '../src/controller';
import tilesMock from './tilesMock.json';

describe('controller', () => {
  let tiles;
  beforeEach(() => {
    tiles = JSON.parse(JSON.stringify(tilesMock));
  });
  test('it should generate new tiles in empty spaces', () => {
    initialize({ tiles, colors: ['blue', 'blue', 'blue', 'blue', 'blue'] });
    tiles[0][3] = null;
    tiles[3][0] = null;

    generateNewTiles();

    expect(tiles[0][3]).not.toEqual(null);
    expect(tiles[3][0]).toEqual('blue');
  });

  test('it activates booster', () => {
    let model = { booster: false };
    initialize(model);
    makeBombBooster();

    expect(model.booster).toBeTruthy();
  });

  test('it descends column', () => {
    initialize({ tiles });
    tiles[3][0] = null;
    tiles[4][0] = null;

    descendColumn(4, 0);

    expect(tiles[0][0]).toEqual(null);
    expect(tiles[1][0]).toEqual(null);
    expect(tiles[3][0]).not.toEqual(null);
    expect(tiles[4][0]).not.toEqual(null);
  });

  test('it descends all tiles', () => {
    initialize({ tiles });
    tiles[3][0] = null;
    tiles[4][4] = null;
    tiles[5][4] = null;
    descendTiles();

    expect(tiles[0][0]).toEqual(null);
    expect(tiles[0][4]).toEqual(null);
    expect(tiles[1][4]).toEqual(null);
  });

  test('it reset counters', () => {
    let model = {
      scoreValue: 10,
      progressValue: 10,
      attemptsAvailableNumber: 2,
      defaultAttemptsNumber: 10,
    };
    initialize(model, { rerenderView: () => {} });

    resetCounters();

    expect(model.scoreValue).toEqual(0);
    expect(model.progressValue).toEqual(0);
    expect(model.attemptsAvailableNumber).toEqual(10);
  });

  test('it updates counters and sets win game state', () => {
    let model = {
      scoreValue: 390,
      progressValue: 10,
      attemptsAvailableNumber: 2,
      defaultAttemptsNumber: 10,
      pointsToWin: 400,
    };
    let view = { renderGameOverMessage: jest.fn() };
    initialize(model, view);

    updateCounters(4);

    expect(view.renderGameOverMessage).toHaveBeenCalledWith('win');
    expect(model.scoreValue).toEqual(430);
  });

  test('it updates counters and sets lose game state', () => {
    let model = {
      scoreValue: 300,
      progressValue: 10,
      attemptsAvailableNumber: 1,
      defaultAttemptsNumber: 10,
      pointsToWin: 400,
    };
    let view = { renderGameOverMessage: jest.fn() };
    initialize(model, view);

    updateCounters(4);

    expect(view.renderGameOverMessage).toHaveBeenCalledWith('lose');
    expect(model.scoreValue).toEqual(340);
  });

  test('it checks all one colored tiles', () => {
    initialize({ tiles });

    expect(checkNeighbours(0, 0)).toEqual(3);
    expect(tiles[0][0]).toEqual(null);
    expect(tiles[1][0]).toEqual(null);
    expect(tiles[2][0]).toEqual(null);
  });

  test('it explode booster area', () => {
    initialize(
      { tiles, boosterRadius: 2 },
      { rerenderView: () => {}, explodeTile: () => {} },
    );
    explodeBoosterArea(1, 1);

    expect(tiles[0][0]).toEqual(null);
    expect(tiles[0][1]).toEqual(null);
    expect(tiles[0][2]).toEqual(null);
    expect(tiles[1][0]).toEqual(null);
    expect(tiles[1][1]).toEqual(null);
    expect(tiles[1][2]).toEqual(null);
    expect(tiles[2][0]).toEqual(null);
    expect(tiles[2][1]).toEqual(null);
    expect(tiles[2][2]).toEqual(null);
  });

  test('it should create model play field', () => {
    let model = {
      PLAYFIELD_LENGTH: 10,
      colorsQuantity: 5,
      colors: ['blue', 'blue', 'blue', 'blue', 'blue'],
    };
    initialize(model);
    createModelPlayField();
    for (let row of model.tiles) {
      for (let tile of row) {
        expect(tile).toEqual('blue');
      }
    }
  });
});
