import { AnchorSpec } from "@jsplumb/browser-ui";

import { Node } from "./node";
import { Connection, Handles } from "./types";

export type PeerOptions = {
  anchor?: AnchorSpec;
  connection?: Connection;
  handles?: Handles;
};

export class Peer {
  node: Node;
  anchor?: AnchorSpec;
  connection?: Connection;
  handles?: Handles;

  constructor(peer: Node, options: PeerOptions = {}) {
    this.node = peer;

    this.anchor = options.anchor;
    this.connection = options.connection;
    this.handles = options.handles;
  }
}
