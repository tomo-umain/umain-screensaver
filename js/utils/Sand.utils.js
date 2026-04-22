const SandUtils = {
  checkFallSpillover: (x = 0, y = 0, direction = 1, maxDistance = 10) => {
    let spilloverOptions = [];

    for (let dist = 1; dist <= maxDistance; dist++) {
      let newX = x + direction * dist;
      if (!CellUtils.isWithinBounds(newX, y)) break;

      // Check if horizontal path is clear
      let pathClear = true;
      for (let i = 1; i <= dist; i++) {
        let checkX = x + direction * i;
        if (CellUtils.isOccupied(checkX, y)) {
          pathClear = false;
          break;
        }
      }

      if (!pathClear) break;

      // Check if this position allows immediate falling
      let canFallHere =
        CellUtils.isWithinBounds(newX, y + 1) &&
        !CellUtils.isOccupied(newX, y + 1);
      let isEmptySpace = CellUtils.isEmpty(newX, y);

      if (isEmptySpace && canFallHere) {
        spilloverOptions.push({
          x: newX,
          priority: 20 - dist, // Closest positions have highest priority
          type: "fall",
        });
        break; // Found the best fall position in this direction
      }
    }

    return spilloverOptions;
  },
  checkFlowSpillover: (x = 0, y = 0, direction = 1, maxDistance = 10) => {
    let spilloverOptions = [];

    for (let dist = 1; dist <= maxDistance; dist++) {
      let newX = x + direction * dist;
      if (!CellUtils.isWithinBounds(newX, y)) break;

      // Check if horizontal path is clear
      let pathClear = true;
      for (let i = 1; i <= dist; i++) {
        let checkX = x + direction * i;
        if (CellUtils.isOccupied(checkX, y)) {
          pathClear = false;
          break;
        }
      }

      if (!pathClear) break;

      let isEmptySpace = CellUtils.isEmpty(newX, y);
      if (isEmptySpace) {
        // Check if this leads to a future fall opportunity
        let futureCanFall = false;
        for (let futureDist = 1; futureDist <= 5; futureDist++) {
          let futureX = newX + direction * futureDist;
          if (
            !CellUtils.isWithinBounds(futureX, y) ||
            CellUtils.isOccupied(futureX, y)
          ) {
            break;
          }
          if (
            CellUtils.isWithinBounds(futureX, y + 1) &&
            !CellUtils.isOccupied(futureX, y + 1)
          ) {
            futureCanFall = true;
            break;
          }
        }

        if (futureCanFall) {
          spilloverOptions.push({
            x: newX,
            priority: 15 - dist, // Medium priority for flow positions
            type: "flow",
          });
        }
      }
    }

    return spilloverOptions;
  },
  checkSpreadSpillover: (x = 0, y = 0, direction = 1, maxDistance = 10) => {
    let spilloverOptions = [];

    for (let dist = 1; dist <= maxDistance; dist++) {
      let newX = x + direction * dist;
      if (!CellUtils.isWithinBounds(newX, y)) break;

      // Check if horizontal path is clear
      let pathClear = true;
      for (let i = 1; i <= dist; i++) {
        let checkX = x + direction * i;
        if (CellUtils.isOccupied(checkX, y)) {
          pathClear = false;
          break;
        }
      }

      if (!pathClear) break;

      let isEmptySpace = CellUtils.isEmpty(newX, y);
      if (isEmptySpace) {
        // Allow horizontal movement to fill gaps under letters
        spilloverOptions.push({
          x: newX,
          priority: 10 - dist, // Lowest priority for pure horizontal movement
          type: "spread",
        });
      }
    }

    return spilloverOptions;
  },
  checkSpilloverOptions: (x = 0, y = 0, maxDistance = 10) => {
    let spilloverOptions = [];

    for (let direction of [-1, 1]) {
      // Check for immediate fall opportunities (highest priority)
      spilloverOptions = spilloverOptions.concat(
        SandUtils.checkFallSpillover(x, y, direction, maxDistance)
      );

      // Check for flow opportunities (medium priority)
      spilloverOptions = spilloverOptions.concat(
        SandUtils.checkFlowSpillover(x, y, direction, maxDistance)
      );

      // Check for spread opportunities (lowest priority)
      spilloverOptions = spilloverOptions.concat(
        SandUtils.checkSpreadSpillover(x, y, direction, maxDistance)
      );
    }

    return spilloverOptions;
  },
  updateParticle: (x = 0, y = 0) => {
    if (CellUtils.isWithinBounds(x, y + 1) && !CellUtils.isOccupied(x, y + 1)) {
      CellUtils.updateColor(x, y + 1, CellUtils.getColour(x, y));
      CellUtils.remove(x, y);
      return;
    }

    let directions = [];

    if (
      CellUtils.isWithinBounds(x - 1, y + 1) &&
      !CellUtils.isOccupied(x - 1, y + 1)
    ) {
      directions.push(-1);
    }
    if (
      CellUtils.isWithinBounds(x + 1, y + 1) &&
      !CellUtils.isOccupied(x + 1, y + 1)
    ) {
      directions.push(1);
    }

    if (directions.length > 0) {
      CellUtils.updateColor(
        x + random(directions),
        y + 1,
        CellUtils.getColour(x, y)
      );
      CellUtils.remove(x, y);
      return;
    }

    let spilloverOptions = [];

    spilloverOptions = SandUtils.checkSpilloverOptions(x, y);

    // Execute the best spillover option
    if (spilloverOptions.length > 0) {
      spilloverOptions.sort((a, b) => b.priority - a.priority);
      const spilloverOption = spilloverOptions[0];

      CellUtils.updateColor(spilloverOption.x, y, CellUtils.getColour(x, y));
      CellUtils.remove(x, y);
    }
  },
};
