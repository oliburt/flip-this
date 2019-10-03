const logoCanv = document.getElementById('logo-canvas')
let c = logoCanv.getContext('2d');
let ballRadius = 5;

let x = logoCanv.width/2;
let y = logoCanv.height-30
let dx = 0.5;
let dy = -0.5;

function drawBall() {
    c.beginPath();
    c.arc(x,y, ballRadius, 0, Math.PI*2)
    c.fillStyle = "#0095DD";
    c.fill();
    c.closePath()
}

function draw() {
    c.clearRect(0, 0, logoCanv.width, logoCanv.height);
    drawBall();
    
    if(x + dx > logoCanv.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy > logoCanv.height-ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }
    
    x += dx;
    y += dy;
}

setInterval(draw, 10);