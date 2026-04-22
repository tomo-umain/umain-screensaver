const ColourUtils = {
  get: () => state.colourConfig.gradient[state.colourConfig.index],
  change: () => {
    const newIndex =
      (state.colourConfig.index + 1) % state.colourConfig.gradient.length;
    state.colourConfig = {
      ...state.colourConfig,
      index: newIndex,
      timeSinceChange: millis(),
    };
  },
  shouldChange: () => {
    return (
      millis() - state.colourConfig.timeSinceChange >=
      state.colourConfig.interval
    );
  },
  isBright: (colour, threshold = 170) => {
    const brightness = (red(colour) + green(colour) + blue(colour)) / 3;
    return brightness > threshold;
  },
  getBright: () => {
    const randomColour = color(random(255), random(255), random(255));

    if (ColourUtils.isBright(randomColour)) return randomColour;
    return ColourUtils.getBright();
  },
  getGradient: (amountColors = random(4, 10), stops = random(4, 10)) => {
    const gradient = [];
    const colours = Array.from({ length: amountColors }, () => {
      return ColourUtils.getBright();
    });

    for (let i = 0; i < colours.length - 1; i++) {
      const startColour = colours[i];
      const endColour = colours[i + 1];

      for (let j = 0; j < stops; j++) {
        const t = j / stops;
        const r = lerp(red(startColour), red(endColour), t);
        const g = lerp(green(startColour), green(endColour), t);
        const b = lerp(blue(startColour), blue(endColour), t);
        gradient.push(color(r, g, b));
      }
    }

    return gradient;
  },
  shiftSlightly: (oldColour = ColourUtils.get()) => {
    let r = red(oldColour);
    let g = green(oldColour);
    let b = blue(oldColour);

    r += random(-15, 15);
    g += random(-15, 15);
    b += random(-15, 15);

    r = constrain(r, 0, 255);
    g = constrain(g, 0, 255);
    b = constrain(b, 0, 255);

    const shiftedColour = color(r, g, b);

    if (!ColourUtils.isBright(shiftedColour)) {
      return oldColour;
    }
    return shiftedColour;
  },
};
