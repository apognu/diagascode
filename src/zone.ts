import { Canvas } from "./canvas";
import { Position } from "./types";

export type ZoneOptions = {
  title?: string;
  background?: string;
  border?: string;
};

export class Zone {
  constructor(position: Position, options: ZoneOptions = {}) {
    if (!Canvas.instance) {
      console.error(
        "Canvas was not initialized, please run `Canvas.setup() before adding nodes.",
      );
      return;
    }

    Canvas.setZonePadding();

    const zone = document.createElement("div");

    zone.classList.add("dac-zone");

    zone.style.gridColumn = `${position.col} / span ${position.colSpan}`;
    zone.style.gridRow = `${position.row} / span ${position.rowSpan}`;
    zone.style.width = `calc(100% + (${Canvas.columnGap}px / 2))`;
    zone.style.height = `calc(100% + (${Canvas.rowGap}px / 2))`;

    if (options.background) {
      zone.style.backgroundColor = options.background;
    }
    if (options.border) {
      zone.style.border = `1px solid ${options.border}`;
    }

    if (options.title) {
      const title = document.createElement("span");
      const titleText = document.createTextNode(options.title);

      title.classList.add("dac-zone-title");
      title.append(titleText);
      zone.append(title);
    }

    document.getElementById("dac-area")!.append(zone);
  }
}
