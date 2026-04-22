const GridUtils = {
  getEmptyCellsCount: () => {
    const amountOfEmptyCells = state.grid.layout.reduce((count, row, y) => {
      return (
        count +
        row.reduce((rowCount, _, x) => {
          if (CellUtils.isEmpty(x, y)) {
            return rowCount + 1;
          }
          return rowCount;
        }, 0)
      );
    }, 0);
    return amountOfEmptyCells;
  },
  isFull: () =>
    state.grid.layout[0].length > 0 && GridUtils.getEmptyCellsCount() < 10,
  clear: () => {
    state.grid.layout = state.grid.layout.map(() =>
      Array(state.grid.size.x).fill(null)
    );
  },
  reset: () => {
    GridUtils.clear();
    state.colourConfig.gradient = ColourUtils.getGradient();
    state.crazyMode = random() < 0.2 ? true : false;
    state.eidraLogo.position = {
      x: floor((windowWidth / state.grid.cellSize) * random(0.1, 0.7)),
      y: floor((windowHeight / state.grid.cellSize) * random(0.1, 0.7)),
    };
    ObstacleUtils.addEidraLogo();
  },
};
