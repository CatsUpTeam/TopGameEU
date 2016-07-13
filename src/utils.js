function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.addXY = function (x, y) {
    return new Point(this.x + x, this.y + y);
};

Point.prototype.equals = function (point) {
    return this.x == point.x && this.y == point.y;
};

function inBorders(pos, width, height) {
    return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
}