/**@type{HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

class Shape {
  constructor(effect, x, y, radius, inset, n) {
    this.effect = effect;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.inset = inset;
    this.n = n;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.angle = 0;
    this.rotation = 0;
    this.hue = 0;
    this.angle2 = 0;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.moveTo(0, 0 - this.radius);
    for (let i = 0; i < this.n; i++) {
      ctx.rotate(Math.PI / this.n);
      ctx.lineTo(0, 0 - this.radius * this.inset);
      ctx.rotate(Math.PI / this.n);
      ctx.lineTo(0, 0 - this.radius);
    }
    ctx.restore();
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  update() {
    this.hue += 1;
    this.rotation = 0;
    this.x += this.speedX;
    this.y += this.speedY;
    const col = Math.floor(this.x / this.effect.cellSize);
    const row = Math.floor(this.y / this.effect.cellSize);
    if (
      col >= 0 &&
      col < this.effect.cols &&
      row >= 0 &&
      row < this.effect.rows
    ) {
      this.rotation = this.effect.angles[col][row];
      this.angle += this.rotation;
    }
  }
  edges() {
    //   if (this.x < 0) {
    //     this.x = this.effect.width;
    //   } else if (this.x > this.effect.width) {
    //     this.x = 0;
    //   }
    //   if (this.y < 0) {
    //     this.y = this.effect.height;
    //   } else if (this.y > this.effect.height) {
    //     this.y = 0;
    //   }

    if (this.x < this.radius || this.x > this.effect.width - this.radius) {
      this.speedX *= -1;
    }
    if (this.y < this.radius || this.y > this.effect.height - this.radius) {
      this.speedY *= -1;
    }
  }
}

class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.shapeNum = 20;
    this.shapes = [];
    this.shape = new Shape(this);
    this.initShapes();
    this.cellSize = 100;
    this.rows = this.height / this.cellSize;
    this.cols = this.width / this.cellSize;
    this.debug = true;
    this.angles = [];

    for (let i = 0; i < this.cols; i++) {
      this.angles[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.angles[i][j] = Math.random() * 0.05 - 0.05;
      }
    }

    const debugBtn = document.getElementById("debugBtn");
    const numSlider = document.getElementById("numSlider");
    const numValue = document.getElementById("numValue");

    const radSlider = document.getElementById("radSlider");
    const radValue = document.getElementById("radValue");

    const insetSlider = document.getElementById("insetSlider");
    const insetValue = document.getElementById("insetValue");

    debugBtn.addEventListener("click", () => {
      this.debug = !this.debug;
    });
    window.addEventListener("keypress", (e) => {
      if (e.key.toLowerCase() == "d") {
        this.debug = !this.debug;
      }
    });
    numSlider.addEventListener("change", (e) => {
      this.shapes = [];
      this.initShapes();
      this.resetValues();
    });
    radSlider.addEventListener("change", (e) => {
      this.shapes = [];
      this.initShapes();
      this.resetValues();
    });
    insetSlider.addEventListener("change", (e) => {
      this.shapes = [];
      this.initShapes();
      this.resetValues();
    });
  }
  initShapes() {
    for (let i = 0; i < this.shapeNum; i++) {
      let radius = Number(radSlider.value);
      let x = Math.random() * (this.width - radius - radius) + radius;
      let y = Math.random() * (this.height - radius - radius) + radius;
      let inset = Number(insetSlider.value);
      let n = Number(numSlider.value);
      this.shapes.push(new Shape(this, x, y, radius, inset, n));
    }
  }
  resetValues() {
    numValue.innerHTML = numSlider.value;
    radValue.innerHTML = radSlider.value;
    insetValue.innerHTML = insetSlider.value;
  }
  drawGrid(ctx) {
    if (!this.debug) {
      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          ctx.beginPath();
          ctx.strokeStyle = "white";
          ctx.rect(
            i * this.cellSize,
            j * this.cellSize,
            this.cellSize,
            this.cellSize
          );
          ctx.stroke();
          ctx.font = "20px Arial";
          ctx.fillStyle = "white";
          ctx.fillText(
            this.angles[i][j].toFixed(2),
            i * this.cellSize,
            j * this.cellSize
          );
        }
      }
    }
  }
  render(ctx) {
    this.drawGrid(ctx);
    this.shapes.forEach((shape) => {
      shape.draw(ctx);
      shape.update();
      shape.edges();
    });
  }
}

const effect = new Effect(canvas.width, canvas.height);
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.render(ctx);

  requestAnimationFrame(animate);
}
animate();

// window.addEventListener("resize", () => {
//   canvas.width = canvas.width;
//   canvas.height = canvas.height;
// });
