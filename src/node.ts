import { AnchorSpec, EndpointSpec, EndpointStyle, OverlaySpec, newInstance } from '@jsplumb/browser-ui';

import { Position, Appearance } from './types';
import { Peer, PeerOptions } from './peer';

const instance = newInstance({
  container: document.getElementById('area')!,
});

export class Node {
  id: string;
  col: number;
  row: number;

  constructor(position: Position, data: { [id: string]: string } = {}, peers: Array<Node | [Node, PeerOptions]> = [], appearance?: Appearance) {
    const { col, row } = position;

    this.id = crypto.randomUUID();
    this.col = col;
    this.row = row;

    const templateId = appearance?.template || 'template';
    const template = document.getElementById(templateId)?.cloneNode(true) as HTMLElement;

    if (template === undefined) {
      return;
    }

    template.setAttribute("id", this.id);
    template.classList.remove("template");
    template.style.gridColumn = col.toString();
    template.style.gridRow = row.toString();

    if (position.span) {
      template.style.gridColumn = `${col} / span ${position.span}`;
    }

    if (appearance?.class) {
      template.classList.add(appearance.class);
    }
    if (appearance?.background) {
      template.style.backgroundColor = appearance.background;
    }
    if (appearance?.borderColor) {
      template.style.borderColor = appearance.borderColor;
    }
    if (appearance?.borderSize) {
      template.style.borderWidth = appearance.borderSize;
    }

    for (const key in data) {
      const el = template.querySelector(`.${key}`)

      if (el) {
        if (el.tagName === "IMG") {
          el.setAttribute("src", data[key]);
        } else {
          el.textContent = data[key];
        }
      }
    }

    document.getElementById('area')?.appendChild(template);

    const node = document.getElementById(this.id)!;

    for (const spec of peers) {
      var peer: Peer | undefined = undefined;

      if (spec instanceof Node) {
        peer = new Peer(spec);
      } else if (Array.isArray(spec)) {
        const [node, options] = spec;

        peer = new Peer(node, options)
      }

      if (peer === undefined) {
        continue;
      }

      var paintStyle = { stroke: "black", strokeWidth: 1, dashstyle: "0" };
      var endpointStyles: [EndpointStyle, EndpointStyle] = [{ fill: "black" }, { fill: "black" }];
      var endpoint: EndpointSpec = { type: "Blank", options: {} };
      var anchor: AnchorSpec = "AutoDefault";
      var overlays: OverlaySpec[] = [];

      if (peer.connection?.dashed) {
        paintStyle["dashstyle"] = "1 4";
      }
      if (peer.connection?.color) {
        paintStyle["stroke"] = peer.connection.color;
      }
      if (peer.connection?.size) {
        paintStyle["strokeWidth"] = peer.connection.size;
      }
      if (peer.connection?.label) {
        overlays.push({ type: "Label", options: { label: peer.connection.label } });
      }

      if (peer.handles?.arrow === undefined || !peer.handles.arrow) {
        endpoint = { type: "Dot", options: { radius: 4 } };

        if (peer.handles?.sourceColor) {
          endpointStyles[0]["fill"] = peer.handles.sourceColor;
        }
        if (peer.handles?.destColor) {
          endpointStyles[1]["fill"] = peer.handles.destColor;
        }
        if (peer.handles?.size) {
          endpoint.options.radius = peer.handles.size;
        }
      } else if (peer.handles.arrow) {
        var location = 0;
        var direction = -1;

        if (peer.handles.direction === "from") {
          location = 1;
          direction = 1;
        }

        overlays.push({ type: "Arrow", options: { width: 10, length: 10, foldback: 1, location, direction } });
      }

      if (peer.anchor !== undefined) {
        anchor = peer["anchor"]
      }

      instance.connect({
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
