class Circle {
  constructor(
    circle,
    overlay,
    approach,
    color,
    spawnTime,
    aliveTime,
    size,
    x,
    y
  ) {
    this.circle = circle;
    this.overlay = overlay;
    this.approach = approach;
    this.color = color;
    this.size = size;
    this.approachSize = this.size * 1.5;
    this.created = Date.now();
    this.spawnTime = spawnTime;
    this.aliveTime = aliveTime;
    this.x = x;
    this.y = y;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    // Base hitcircle
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
    context.fill();

    context.globalCompositeOperation = "destination-in";

    context.drawImage(
      this.circle,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );

    context.globalCompositeOperation = "source-over";

    context.drawImage(
      this.overlay,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );

    // context.drawImage(
    //   this.approach,
    //   this.x - this.approachSize / 2,
    //   this.y - this.approachSize / 2,
    //   this.approachSize,
    //   this.approachSize
    // );

    // this.approachSize = Math.max(
    //   this.size +
    //     this.size *
    //       0.5 *
    //       Math.max(
    //         (this.aliveTime - Date.now() + this.created) / this.aliveTime,
    //         0
    //       ),
    //   this.size
    // );
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  getSize() {
    return this.size;
  }

  getSpawnTime() {
    return this.spawnTime;
  }

  getAliveTime() {
    return this.aliveTime;
  }

  getCreated() {
    return this.created;
  }
}

export { Circle };
