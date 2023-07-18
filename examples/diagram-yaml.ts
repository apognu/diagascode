import { Canvas } from "@apognu/diagascode";
import yaml from "./diagram.yml";

window.onload = () => {
  Canvas.fromYaml(yaml);
};
