import { MOVES } from "./moves.js";

export class Player {
  constructor(x, y, facing = 1, color = "#1594ff") {
    this.x = x;
    this.y = y;
    this.facing = facing;
    this.color = color;
    this.move = MOVES.idle;
    this.moveId = "idle";
    this.moveTime = 0;
    this.lastPose = {};
    this.rotationArmed = false;
  }

  start(moveId) {
    this.moveId = moveId;
    this.move = MOVES[moveId] || MOVES.idle;
    this.moveTime = 0;
    this.rotationArmed = moveId === "rotate";
  }

  update(dt, input) {
    for (const ev of input.consumeEvents()) {
      if (ev.type === "double" && ev.name === "right") this.x += 45 * this.facing;
      if (ev.type === "double" && ev.name === "left") this.x -= 45 * this.facing;

      if (ev.type === "press") {
        const back = input.isDown("left");
        const up = input.isDown("up");

        if (this.rotationArmed && ev.name === "small") this.start("dwitchagi");
        else if (this.rotationArmed && ev.name === "big") this.start("dwihurigi");
        else if (ev.name === "rotate") this.start("rotate");
        else if (ev.name === "small" && up) this.start("naeryo");
        else if (ev.name === "big" && up) this.start("jumpDwihurigi");
        else if (ev.name === "small" && back) this.start("retreatDollyo");
        else if (ev.name === "big" && back) this.start("retreatJumpDwit");
        else if (ev.name === "small") this.start("apchagi");
        else if (ev.name === "big") this.start("dollyo");
      }
    }

    if (this.moveId === "idle") {
      if (input.isDown("left")) this.x -= 160 * dt;
      if (input.isDown("right")) this.x += 160 * dt;
      return;
    }

    this.moveTime += dt * 1000;
    if (this.moveTime > this.move.duration) {
      this.start("idle");
    }
  }

  progress() {
    if (!this.move.duration) return 0;
    return Math.min(1, this.moveTime / this.move.duration);
  }

  currentFrame() {
    const p = this.progress();
    let frame = this.move.keyframes[0];
    for (const f of this.move.keyframes) {
      if (p >= f.t) frame = f;
    }
    return frame;
  }
}
