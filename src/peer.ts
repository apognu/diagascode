import { AnchorSpec } from "@jsplumb/browser-ui";

import { Node } from "./node";
import { Connection, Handles } from "./types";
import { Component } from "./canvas";

export type PeerOptions = {
  anchor?: AnchorSpec;
  connection?: Connection;
  handles?: Handles;
};

export class Peer {
  node: Component;
  anchor?: AnchorSpec;
  connection?: Connection;
  handles?: Handles;

  constructor(peer: Component, options: PeerOptions = {}) {
    this.node = peer;

    this.anchor = options.anchor;
    this.connection = options.connection;
    this.handles = options.handles;
  }
}
