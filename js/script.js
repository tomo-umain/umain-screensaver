let state = {
  crazyMode: false,
  sandImages: {},
  grid: {
    layout: [],
    blackCells: [],
    size: { x: 0, y: 0 },
    cellSize: 15,
    spawnRate: 10,
  },
  colourConfig: {
    gradient: [],
    index: 0,
    timeSinceChange: 0,
    interval: 150,
  },
  eidraLogo: {
    position: { x: 0, y: 0 },
  },
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  state = {
    ...state,
    eidraLogo: {
      ...state.eidraLogo,
      position: {
        x: floor((windowWidth / state.grid.cellSize) * random(0.1, 0.7)),
        y: floor((windowHeight / state.grid.cellSize) * random(0.1, 0.7)),
      },
    },
    grid: {
      ...state.grid,
      layout: Array.from(
        { length: floor(windowHeight / state.grid.cellSize) },
        () => [],
      ),
      size: {
        x: floor(windowWidth / state.grid.cellSize),
        y: floor(windowHeight / state.grid.cellSize),
      },
    },
  };

  state.colourConfig.gradient = state.colourConfig.gradient =
    ColourUtils.getGradient();

  ObstacleUtils.addEidraLogo();
}

function mousePressed() {
  const positions = CellUtils.getClickedPosition(mouseX, mouseY);
  CellUtils.draw(positions.x, positions.y);
}

function mouseDragged() {
  const positions = CellUtils.getClickedPosition(mouseX, mouseY);
  CellUtils.draw(positions.x, positions.y);
}

function mouseReleased() {
  const positions = CellUtils.getClickedPosition(mouseX, mouseY);
  CellUtils.draw(positions.x, positions.y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  state.grid.size.x = Math.floor(windowWidth / state.grid.cellSize);
  state.grid.size.y = Math.floor(windowHeight / state.grid.cellSize);

  GridUtils.clear();
  ObstacleUtils.addEidraLogo();
}

function draw() {
  try {
    if (GridUtils.isFull()) {
      GridUtils.reset();
    }

    background(50);

    if (ColourUtils.shouldChange()) {
      ColourUtils.change();
    }

    if (state.crazyMode) {
      state.eidraLogo.position = {
        x: floor(state.grid.size.x * random(0.35, 0.45)),
        y: floor(state.grid.size.y * random(0.35, 0.45)),
      };
      ObstacleUtils.addEidraLogo();
    }

    Array.from({ length: state.grid.spawnRate }).forEach(() => {
      if (random() < 0.9) {
        const x = floor(random(state.grid.size.x));
        if (random() < 0.4) {
          CellUtils.updateColor(x, undefined, ColourUtils.shiftSlightly());
        } else {
          CellUtils.updateColor(x);
        }
      }
    });

    Array.from({ length: state.grid.size.y - 1 }).forEach((_, yIndex) => {
      const y = state.grid.size.y - 2 - yIndex;
      Array.from({ length: state.grid.size.x }).forEach((_, x) => {
        SandUtils.updateParticle(x, y);
      });
    });

    Array.from({ length: state.grid.size.y }).forEach((_, y) => {
      Array.from({ length: state.grid.size.x }).forEach((_, x) => {
        if (CellUtils.isColoured(x, y)) {
          fill(CellUtils.getColour(x, y));

          rect(
            x * state.grid.cellSize,
            y * state.grid.cellSize,
            state.grid.cellSize,
            state.grid.cellSize,
          );
        } else if (CellUtils.isBlack(x, y)) {
          fill(0);

          rect(
            x * state.grid.cellSize,
            y * state.grid.cellSize,
            state.grid.cellSize,
            state.grid.cellSize,
          );
        }
      });
    });
  } catch (error) {
    GridUtils.reset();
  }
}
