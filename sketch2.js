var ParticleSystem = [];
var attractors = [];
var originalRadius,radius;
var status = 'zoomIn';
function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    frameRate(30);
    colorMode(HSB, 360, 100, 100, 100);
    background(0);
    originalRadius = (width > height ? height : width) / 2 - 50;
    radius = originalRadius;
    for(var i = 0;i < 100; i++) {
        var angle = Math.PI  * 2 / 100 * i;
        var _x = radius * Math.cos(angle) + width / 2;
        var _y = radius * Math.sin(angle) + height / 2;
        var strength = random(2,6)
        var att = new Attractor(createVector( _x, _y), strength);
        attractors.push(att);
    }
}


function draw() {
    background(0);
    blendMode(SCREEN);
    if(status == 'zoomIn' && radius < 0) {
        status = 'zoomOut';
    }
    if(status == 'zoomOut' && radius > originalRadius ) {
        status = 'zoomIn';
    }
    if( status == 'zoomIn') {
        radius -= 0.9;
    }
    if(status == 'zoomOut'){
        radius += 0.9;
    }

    for(var i = 0;i < attractors.length; i++) {
        var angle = Math.PI  * 2 / attractors.length * i;

        var _x = radius * Math.cos(angle) + width / 2;
        var _y = radius * Math.sin(angle) + height / 2;
        strength  = random(2,6);
        attractors[i].pos.x = _x;
        attractors[i].pos.y = _y;
        attractors[i].strength = strength;
        attractors[i].draw();

    }

    for (var i = ParticleSystem.length - 1; i >= 0; i--) {
        var p = ParticleSystem[i];
        if (p.areYouDeadYet()) {
            ParticleSystem.splice(i, 1);
        } else {
            p.update();
            p.draw();
        }
    }
    if (mouseIsPressed) {
        createMightyParticles();
    }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

}


var Particle = function (attractor, position, velocity, hue) {
    var that = this;
    this.position = position.copy();
    this.velocity = velocity.copy();
    this.acceleration = createVector(0, 0);
    this.size = random(3, 10);
    var lifeSpan = random(200, 400);
    this.lifeSpan = lifeSpan;
    this.hue = random(hue - 15, hue + 15);


    this.update = function () {
        attractors.forEach(function (A) {
            var v = p5.Vector.sub( A.getPos(), that.position);
            var distanceSq = v.magSq();
            if (distanceSq > 1) {
                v.div(distanceSq);
                v.mult(10 * A.getStrength());
                that.acceleration.add(v);
            }
        })
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.velocity.limit(10);
        this.lifeSpan --;
    }

    this.draw = function () {
        var transparancy = map(this.lifeSpan, 0, lifeSpan, 0, 100);
        stroke(this.hue, 100, 100, transparancy)
        line(this.position.x, this.position.y, this.position.x - 3 * this.velocity.x,this.position.y - 3 * this.velocity.y);
        noStroke();
        fill(this.hue, 50, 80, transparancy);
        ellipse(this.position.x, this.position.y, this.size, this.size);

}
this.areYouDeadYet = function () {
    return this.lifeSpan <= 0;
}
this.getPos = function () {
    return position.copy();
}
}

function createMightyParticles() {
    var strength = random(5,8);
    var at = new Attractor(createVector(mouseX, mouseY), strength);
    var hue = random(0, 360);
    for (var i = 0; i < 30; i++) {
        var pos = createVector(mouseX, mouseY);
        var vel = createVector(1, 0);
        vel.rotate(random(0, Math.PI * 2));
        vel.mult(random(5, 8));
        var newBorn = new Particle(at, pos, vel, hue);
        ParticleSystem.push(newBorn);
    }
}


var Attractor = function( pos, s) {
    var hue = random(0, 360);
    this.pos = pos.copy();
    this.strength = s;
    this.draw = function () {
        noStroke();
        fill(hue, 50, 80,60);
        ellipse(this.pos.x, this.pos.y,
            this.strength, this.strength);
    }
    this.getStrength = function (){
        return this.strength;
    }
    this.getPos = function () {
        return this.pos.copy();
    }
}