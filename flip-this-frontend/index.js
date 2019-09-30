// API ----------


// Variables -------
const createFlipbookForm = document.querySelector("#create-flipbook-form")
const canvasAreaDiv = document.querySelector("#canvas-area")
const animationConfigDiv = document.querySelector("#animation-config")
const saveBtn = document.querySelector('button#save')
const drawBtn = document.querySelector('button#draw-save')
const nextBtn = document.querySelector("button#next-page")
const playBtn = document.querySelector("button#play")

let paint;

let clickX = new Array();
let clickY = new Array();
let clickDrag = new Array();

const WIPFlipbook = {}

const save = {
    clickX, clickY, clickDrag
}


// Main Function definition area ---------

function handleFlipbookCreation(e) {
    e.preventDefault()

    let flipbookTitle = e.target[0].value
    let totalPages = parseInt(e.target[1].value)

    WIPFlipbook.title = flipbookTitle
    WIPFlipbook.pages = []
    WIPFlipbook.totalPages = totalPages

    WIPFlipbook.currentPage = 1;

    addPagesToWIPBook(totalPages, flipbookTitle)

    // Post ??
    
    createFlipbookForm.style.display = 'none'
    createCanvas()

}

function addPagesToWIPBook(number, flipbookTitle) {
    for (let i = 1; i <= number; i++) {
        WIPFlipbook.pages.push({
            layers: []
        })
    }
}

function createCanvas() {
    let canvas = document.createElement('canvas')
    canvas.setAttribute('data-page-num', WIPFlipbook.currentPage)
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
    
    WIPFlipbook.pages[WIPFlipbook.currentPage-1].layers.push(JSON.parse(JSON.stringify(save)))
    console.log(WIPFlipbook)
}

function drawCurrentSave(e) {
    let newCanvas = document.querySelector('canvas')
    let context = newCanvas.getContext('2d')
    console.log(save)
    redraw(context, save)
}

function handleNextPageClick(e) {
    if (WIPFlipbook.currentPage !== WIPFlipbook.totalPages) {
        let currentLayers = Array.from(document.querySelectorAll(`canvas[data-page-num="${WIPFlipbook.currentPage}"]`))
        currentLayers.forEach(layer => {
            layer.style.display = 'none'
        })
        WIPFlipbook.currentPage+=1
        console.log(WIPFlipbook.currentPage)
        save.clickX = []
        save.clickY = []
        save.clickDrag = []
    
        createCanvas()
    } else {
        alert("Last Page")
    }
}

// Play

function handlePlayClick(e) {
    console.log("hello")
    let lastLayer = document.querySelector(`canvas[data-page-num="${WIPFlipbook.currentPage}"]`)
    console.log(lastLayer)
    lastLayer.style.display = 'none'

    let allCanvases = Array.from(document.querySelectorAll('canvas'))
    let time = 700
    allCanvases.forEach(canvas => {
        setTimeout(() => {
            canvas.style.display = 'block'
            setTimeout(() => canvas.style.display = 'none', 600)
        }, time)
        time+=700
    })
}

// Event listeners -----------

createFlipbookForm.addEventListener('submit', handleFlipbookCreation)

saveBtn.addEventListener('click', saveCurrentDraw)
drawBtn.addEventListener('click', drawCurrentSave)
nextBtn.addEventListener('click', handleNextPageClick)
playBtn.addEventListener('click', handlePlayClick)