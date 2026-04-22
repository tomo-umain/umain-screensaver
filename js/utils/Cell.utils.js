const CellUtils = {
  isColoured: (x = 0, y = 0) =>
    state.grid.layout[y][x] !== null && !CellUtils.isBlack(x, y),
  isBlack: (x = 0, y = 0) =>
    state.grid.blackCells.some((cell) => cell.x === x && cell.y === y),
  isOccupied: (x = 0, y = 0) =>
    CellUtils.isColoured(x, y) || CellUtils.isBlack(x, y),
  isEmpty: (x = 0, y = 0) => !CellUtils.isOccupied(x, y),
  isWithinBounds: (x = 0, y = 0) =>
    x >= 0 && x < state.grid.size.x && y >= 0 && y < state.grid.size.y,
  draw: (x = 0, y = 0) => {
    if (!CellUtils.isWithinBounds(x, y) || CellUtils.isBlack(x, y)) return;
    state.grid.blackCells.push({ x, y });
  },
  updateColor: (x = 0, y = 0, colour = ColourUtils.get()) => {
    if (
      !CellUtils.isWithinBounds(x, y) ||
      CellUtils.isBlack(x, y) ||
      CellUtils.isOccupied(x, y)
    ) {
      return;
    }
    state.grid.layout[y][x] = colour;
  },
  getColour: (x = 0, y = 0) => {
    if (!CellUtils.isWithinBounds(x, y)) return color(0, 0, 0);
    return state.grid.layout[y][x] || null;
  },
  getClickedPosition: (mouseX, mouseY) => {
    return {
      x: floor(mouseX / state.grid.cellSize),
      y: floor(mouseY / state.grid.cellSize),
    };
  },
  remove: (x = 0, y = 0) => {
    if (!CellUtils.isWithinBounds(x, y) || CellUtils.isBlack(x, y)) return;
    state.grid.layout[y][x] = null;
  },
};
