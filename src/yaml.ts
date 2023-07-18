import { Canvas, CanvasOptions, Component } from "./canvas";
import { Node, ComponentList } from "./node";
import { Appearance, Connection, Handles, Position } from "./types";
import { AnchorSpec } from "@jsplumb/browser-ui";
import { Zone, ZoneOptions } from "./zone";

export type YamlComponent = {
  id?: string;
  position: Position;
  data?: { [id: string]: string };
  peers?: (string | YamlPeer)[];
  appearance?: Appearance;
};

export type YamlPeer = {
  id?: string;
  anchor?: AnchorSpec;
  connection?: Connection;
  handles?: Handles;
};

export type YamlZone = {
  position: Position;
  components?: string[];
  options?: ZoneOptions;
};

export class YamlCanvas {
  options?: CanvasOptions;
  components: YamlComponent[] = [];
  zones?: YamlZone[];

  private static _ids: { [id: string]: Component } = {};

  draw() {
    const canvas = new Canvas(this.options);

    for (const spec of this.components) {
      const peers: ComponentList = [];

      if (spec.peers) {
        for (const peer of spec.peers) {
          if (typeof peer === "string") {
            if (peer in YamlCanvas._ids) {
              peers.push(YamlCanvas._ids[peer]);
            }
          } else {
            if (peer.id && peer.id in YamlCanvas._ids) {
              peers.push([YamlCanvas._ids[peer.id], peer]);
            }
          }
        }
      }

      const component = new Node(
        spec.position,
        spec.data,
        peers,
        spec.appearance,
      );

      if (spec.id) {
        YamlCanvas._ids[spec.id] = component;
      }

      canvas.add(component);
    }

    if (this.zones) {
      for (const spec of this.zones) {
        const peers: Component[] = [];

        if (spec.components) {
          for (const peer of spec.components) {
            if (peer in YamlCanvas._ids) {
              peers.push(YamlCanvas._ids[peer]);
            }
          }
        }

        const zone = new Zone(spec.position, peers, spec.options);

        canvas.add(zone);
      }
    }

    canvas.draw();
  }
}
