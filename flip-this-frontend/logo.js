const logoCanv = document.getElementById('logo-canvas')
let c = logoCanv.getContext('2d');
let ballRadius = 5;

let x = logoCanv.width/2;
let y = logoCanv.height-30
let dx = 0.5;
let dy = -0.5;

const colorPallette = ['#730068', '#085f63', "#0095DD", "#49beb7", '#facf5a', '#ff5959', '#43ab92', '#f75f00', '#c93838', '#434982', '#512c62', '#f6f078', '#01d28e']
let currentColor = getRandomColor(colorPallette)

function getRandomColor(colorPallette) {
    return colorPallette[Math.floor(Math.random()*colorPallette.length)]
}


function drawBall() {
    c.beginPath();
    c.arc(x,y, ballRadius, 0, Math.PI*2)
    c.fillStyle = currentColor;
    c.fill();
    c.closePath()
}

function draw() {
    c.clearRect(0, 0, logoCanv.width, logoCanv.height);
    drawBall();
    
    if(x + dx > logoCanv.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        currentColor = getRandomColor(colorPallette)
    }
    if(y + dy > logoCanv.height-ballRadius || y + dy < ballRadius) {
        dy = -dy;
        currentColor = getRandomColor(colorPallette)
    }
    
    x += dx;
    y += dy;
}

setInterval(draw, 10);