"use strict";

function Player() {
    this.id = 0;
    this.speed = 0.2;
    this.sprite = new PIXI.Sprite(Player.texture);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.actions = {u:0,d:0,l:0,r:0};
    this.destination = {x:0,y:0};
}

Player.texture = PIXI.Texture.fromImage('terry/bunny.png');

Player.prototype.update = function(data) {
    this.id = data[0];
    this.destination.x = parseFloat(data[1]);
    this.destination.y = parseFloat(data[2]);
    this.actions.u = (data[3] > 0) ? 1 : 0;
    this.actions.d = (data[3] < 0) ? 1 : 0;
    this.actions.l = (data[4] > 0) ? 1 : 0;
    this.actions.r = (data[4] < 0) ? 1 : 0;
};

Player.prototype.smooth = function(delta) {
    var dx = this.destination.x - this.sprite.position.x;
    var dy = this.destination.y - this.sprite.position.y;
    var dst = Math.sqrt(dx * dx + dy * dy);

    var scale = Math.min(dst, delta * this.speed);

    console.log(dx, dy, dst, scale, delta * this.speed);

    if (dx > -1 && dx < 1 || dst < 1) {
        this.sprite.position.x = this.destination.x;
    } else {
        this.sprite.position.x += dx / dst * scale;
    }

    if (dy > -1 && dy < 1 || dst < 1) {
        this.sprite.position.y = this.destination.y;
    } else {
        this.sprite.position.y += dy / dst * scale;
    }
};

Player.prototype.collides = function(that) {
    var thisHW = this.sprite.width / 2;
    var thisHH = this.sprite.height / 2;
    var thatHW = that.sprite.width / 2;
    var thatHH = that.sprite.height / 2;
    if (this.sprite.position.x + thisHW < that.sprite.position.x - thatHW)
        return false;
    if (this.sprite.position.x - thisHW > that.sprite.position.x + thatHW)
        return false;
    if (this.sprite.position.y + thisHH < that.sprite.position.y - thatHH)
        return false;
    if (this.sprite.position.y - thisHH > that.sprite.position.y + thatHH)
        return false;
    return true;
};