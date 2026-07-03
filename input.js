export class Input {
  constructor() {
    this.down = new Set();
    this.lastTap = {};
    this.events = [];
    this.doubleTapMs = 260;
    this.setupButtons();
    this.setupKeyboard();
  }

  setupButtons() {
    for (const el of document.querySelectorAll("[data-btn]")) {
      const name = el.dataset.btn;
      const onDown = (e) => {
        e.preventDefault();
        el.classList.add("down");
        this.press(name);
      };
      const onUp = (e) => {
        e.preventDefault();
        el.classList.remove("down");
        this.release(name);
      };
      el.addEventListener("pointerdown", onDown, { passive: false });
      el.addEventListener("pointerup", onUp, { passive: false });
      el.addEventListener("pointercancel", onUp, { passive: false });
      el.addEventListener("pointerleave", onUp, { passive: false });
    }
  }

  setupKeyboard() {
    const map = {
      ArrowUp: "up", ArrowLeft: "left", ArrowRight: "right",
      ArrowDown: "rotate", z: "small", x: "big", c: "guard",
      Z: "small", X: "big", C: "guard"
    };
    window.addEventListener("keydown", e => {
      const b = map[e.key];
      if (!b || this.down.has(b)) return;
      e.preventDefault();
      this.press(b);
    });
    window.addEventListener("keyup", e => {
      const b = map[e.key];
      if (!b) return;
      e.preventDefault();
      this.release(b);
    });
  }

  press(name) {
    const now = performance.now();
    this.down.add(name);
    this.events.push({ type: "press", name, time: now });

    if (name === "left" || name === "right") {
      const last = this.lastTap[name] || 0;
      if (now - last < this.doubleTapMs) {
        this.events.push({ type: "double", name, time: now });
      }
      this.lastTap[name] = now;
    }
  }

  release(name) {
    this.down.delete(name);
    this.events.push({ type: "release", name, time: performance.now() });
  }

  consumeEvents() {
    const e = this.events;
    this.events = [];
    return e;
  }

  isDown(name) {
    return this.down.has(name);
  }
}
