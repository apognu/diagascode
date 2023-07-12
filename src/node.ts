import {
  AnchorSpec,
  EndpointSpec,
  EndpointStyle,
  OverlaySpec,
} from "@jsplumb/browser-ui";

import { Canvas, Component } from "./canvas";
import { Position, Appearance } from "./types";
import { Peer, PeerOptions } from "./peer";

type ComponentList = (Component | [Component, PeerOptions])[];

export class Node implements Component {
  id: string;
  col: number;
  row: number;
  el: HTMLElement;

  private _peers: ComponentList = [];

  constructor(
    position: Position,
    data: { [id: string]: string } = {},
    peers: ComponentList = [],
    appearance?: Appearance,
  ) {
    const { col, row } = position;

    this.id = crypto.randomUUID();
    this.col = col;
    this.row = row;

    const templateId = appearance?.template || "dac-default-template";

    this.el = document
      .getElementById(templateId)
      ?.cloneNode(true) as HTMLElement;

    if (this.el === undefined) {
      return;
    }

    this.el.setAttribute("id", this.id);
    this.el.classList.remove("dac-template");
    this.el.classList.add("dac-node");

    this.el.style.gridColumn = this.col.toString();
    this.el.style.gridRow = this.row.toString();

    if (position.colSpan) {
      this.el.style.gridColumn = `${this.col} / span ${position.colSpan}`;
    }
    if (position.rowSpan) {
      this.el.style.gridRow = `${this.row} / span ${position.rowSpan}`;
    }

    if (appearance?.class) {
      this.el.classList.add(appearance.class);
    }
    if (appearance?.background) {
      this.el.style.backgroundColor = appearance.background;
    }
    if (appearance?.borderColor) {
      this.el.style.borderColor = appearance.borderColor;
    }
    if (appearance?.borderSize) {
      this.el.style.borderWidth = `${appearance.borderSize}px`;
    }

    for (const key of Object.keys(data)) {
      const el = this.el.querySelector(`.${key}`);

      if (el) {
        if (el.tagName === "IMG") {
          el.setAttribute("src", data[key]);
        } else {
          el.textContent = data[key];
        }
      }
    }

    this._peers = peers;
  }

  add(canvas: Canvas): void {
    if (!this.el) {
      return;
    }

    canvas.area.appendChild(this.el);

    const node = document.getElementById(this.id)!;

    for (const spec of this._peers) {
      let peer: Peer | undefined;

      if (spec instanceof Node) {
        peer = new Peer(spec);
      } else if (Array.isArray(spec)) {
        const [peerNode, options] = spec;

        peer = new Peer(peerNode, options);
      }

      if (peer === undefined) {
        continue;
      }

      const paintStyle = { stroke: "black", strokeWidth: 1, dashstyle: "0" };
      const endpointStyles: [EndpointStyle, EndpointStyle] = [
        { fill: "black" },
        { fill: "black" },
      ];
      const overlays: OverlaySpec[] = [];

      let endpoint: EndpointSpec = { type: "Blank", options: {} };
      let anchor: AnchorSpec = "AutoDefault";

      if (peer.connection?.dashed) {
        paintStyle.dashstyle = "1 4";
      }
      if (peer.connection?.color) {
        paintStyle.stroke = peer.connection.color;
      }
      if (peer.connection?.size) {
        paintStyle.strokeWidth = peer.connection.size;
      }
      if (peer.connection?.label) {
        overlays.push({
          type: "Label",
          options: { label: peer.connection.label },
        });
      }

      if (peer.handles?.arrow === undefined || !peer.handles.arrow) {
        endpoint = { type: "Dot", options: { radius: 4 } };

        if (peer.handles?.sourceColor) {
          endpointStyles[0].fill = peer.handles.sourceColor;
        }
        if (peer.handles?.destColor) {
          endpointStyles[1].fill = peer.handles.destColor;
        }
        if (peer.handles?.size) {
          endpoint.options.radius = peer.handles.size;
        }
      } else if (peer.handles.arrow) {
        let location = 0;
        let direction = -1;

        if (peer.handles.direction === "from") {
          location = 1;
          direction = 1;
        }

        overlays.push({
          type: "Arrow",
          options: { width: 10, length: 10, foldback: 1, location, direction },
        });
      }

      if (peer.anchor !== undefined) {
        anchor = peer.anchor;
      }

      canvas.instance.connect({
        source: node,
        target: document.getElementById(peer.node.id)!,
        anchor,
        connector: "Flowchart",
        paintStyle,
        endpointStyles,
        endpoint,
        overlays,
      });
    }
  }
}
