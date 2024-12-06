import { Map, Orientation, Coord } from "./types";
import movements from "./movements";

export default class Guard {
  X: number;
  Y: number;
  orientation: Orientation;
  path: Coord[];
  MAP: Map;

  constructor(position: Coord, orientation: Orientation, map: Map) {
    this.X = position[0];
    this.Y = position[1];
    this.orientation = orientation;
    this.path = [position];
    this.MAP = map;
  }

  step() {
    let { movement } = movements[this.orientation];
    let nextX = this.X + movement[0];
    let nextY = this.Y + movement[1];
    if (this.MAP[nextY][nextX] === "#") {
      this.turn();
      this.step();
    } else {
      this.X = nextX;
      this.Y = nextY;
      this.path.push([this.X, this.Y]);
    }
  }

  turn() {
    this.orientation = movements[this.orientation].turn;
  }
}
