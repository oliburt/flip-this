// API ----------


// Variables -------
const createFlipbookForm = document.querySelector("#create-flipbook-form")
const canvasAreaDiv = document.querySelector("#canvas-area")
const animationConfigDiv = document.querySelector("#animation-config")
const saveBtn = document.querySelector('button#save')
const drawBtn = document.querySelector('button#draw-save')
let paint;

let clickX = new Array();
let clickY = new Array();
let clickDrag = new Array();

const WIPFlipbook = {
    currentPage: 1,
}

const save = {
    clickX, clickY, clickDrag
}


// Main Function definition area ---------

function handleFlipbookCreation(e) {
    e.preventDefault()

    let flipbookTitle = e.target[0].value
    let totalPages = e.target[1].value

    WIPFlipbook[flipbookTitle] = []

    addPagesToWIPBook(totalPages, flipbookTitle)

    // Post ??
    
    createFlipbookForm.style.display = 'none'
    createCanvas()

}

function addPagesToWIPBook(number, flipbookTitle) {
    for (let i = 1; i <= number; i++) {
        let page = `page ${i}`
        WIPFlipbook[flipbookTitle].push({
            [page]: {} 
        })
    }
}

function createCanvas() {
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')

    canvas.height = '500'
    canvas.width = '800'

    canvas.addEventListener("mousedown", e => recordAndDraw.call(canvas, e, context))
    canvas.addEventListener("mousemove", e => drawOnMove.call(canvas, e, context))
    canvas.addEventListener("mouseup", stopDraw)
    canvas.addEventListener("mouseleave", stopDraw)
    
    
    console.log({canvas})
    canvasAreaDiv.append(canvas)
}

// canvas drawing functions

function recordAndDraw(e, context) {
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(mouseX, mouseY)

    redraw(context, save)
}

function drawOnMove(e, context) {
    if (paint) {
        addClick(e.pageX-this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw(context, save)
    }
}

function stopDraw(e) {
    paint = false;
}

function addClick(x, y, dragging) {
    save.clickX.push(x);
    save.clickY.push(y);
    save.clickDrag.push(dragging)
}



function redraw(context, save) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.strokeStyle = "#000";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (let i = 0; i < save.clickX.length; i++) {
        context.beginPath();
        if (save.clickDrag[i] && i) {
            context.moveTo(save.clickX[i-1], save.clickY[i-1])
        } else {
            context.moveTo(save.clickX[i]-1, save.clickY[i])
        }
        context.lineTo(save.clickX[i], save.clickY[i]);
        context.closePath();
        context.stroke();
    }
}

function saveCurrentDraw(e) {
    save.clickX = clickX
    save.clickY = clickY
    save.clickDrag = clickDrag

    console.log(save)
    let canvas = document.querySelector('canvas')
    canvas.remove()

    let newCanvas = document.createElement('canvas')

    newCanvas.height = '500'
    newCanvas.width = '800'
    canvasAreaDiv.append(newCanvas)

}

function drawCurrentSave(e) {
    let newCanvas = document.querySelector('canvas')
    let context = newCanvas.getContext('2d')
    console.log(save)
    redraw(context, save)
}

// Event listeners -----------

createFlipbookForm.addEventListener('submit', handleFlipbookCreation)

saveBtn.addEventListener('click', saveCurrentDraw)
drawBtn.addEventListener('click', drawCurrentSave)