// API ----------


// Variables -------
const createFlipbookForm = document.querySelector("#create-flipbook-form")
const canvasAreaDiv = document.querySelector("#canvas-area")
const animationConfigDiv = document.querySelector("#animation-config")
const saveBtn = document.querySelector('button#save')
const drawBtn = document.querySelector('button#draw-save')
const nextBtn = document.querySelector("button#next-page")
const backBtn = document.querySelector("button#back-page")
const playBtn = document.querySelector("button#play")
const staticBtn = document.querySelector("button#static-background")
const newLayerBtn = document.querySelector("button#new-layer")
const blinkAnimationBtn = document.querySelector("button#animate-blink")
const shakeAnimationBtn = document.querySelector("button#animate-shake")
const moveLeftAnimation = document.querySelector("button#animate-move-left")
const moveRightAnimation = document.querySelector("button#animate-move-right")


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
    WIPFlipbook.currentLayer = 1;

    addPagesToWIPBook(totalPages, flipbookTitle)

    // Post ??
    
    createFlipbookForm.style.display = 'none'

    // let firstPage = createCanvas(1,1)
    // canvasAreaDiv.append(firstPage)
    // for (let i = 0; i < totalPages-1; i++) {
    //     let newCanvas = createCanvas(i+2, 1)
    //     newCanvas.style.display = 'none'
    //     canvasAreaDiv.append(newCanvas)
    // }

    createPageDivs(totalPages)

}

function createPageDivs(totalPages) {
    for (let i = 0; i < totalPages; i++) {
        let newDiv = createPageDiv(i+1)
        if (i !== 0) {
            newDiv.style.display = 'none'
        }
        canvasAreaDiv.append(newDiv)
    }
}

function createPageDiv(pageNum) {
    let pageDiv = document.createElement('div')
    pageDiv.setAttribute('data-page-num', pageNum)
    pageDiv.classList.add('page-wrapper')

    let firstLayer = createCanvas(1)
    pageDiv.append(firstLayer)

    return pageDiv
}


function addPagesToWIPBook(number, flipbookTitle) {
    for (let i = 1; i <= number; i++) {
        WIPFlipbook.pages.push({
            layers: [{}]
        })
    }
}

function createCanvas(layerNum) {
    let canvas = document.createElement('canvas')

    canvas.setAttribute('data-layer-num', layerNum)
    canvas.style.zIndex = layerNum-1
    let context = canvas.getContext('2d')

    canvas.height = '500'
    canvas.width = '800'

    canvas.addEventListener("mousedown", e => recordAndDraw.call(canvas, e, context))
    canvas.addEventListener("mousemove", e => drawOnMove.call(canvas, e, context))
    canvas.addEventListener("mouseup", stopDraw)
    canvas.addEventListener("mouseleave", stopDraw)
    
    
    return canvas
}

// canvas drawing functions

function recordAndDraw(e, context) {
    let mouseX = e.pageX - canvasAreaDiv.offsetLeft;
    // let mouseX = e.pageX;
    let mouseY = e.pageY - canvasAreaDiv.offsetTop;
    // let mouseY = e.pageY;

    paint = true;
    addClick(mouseX, mouseY)

    let currentCanvasCoOrds = getCoOrdsBasedOnCurrentPageAndLayer()

    // redraw(context, save)
    redraw(context, currentCanvasCoOrds)
}


function drawOnMove(e, context) {
    if (paint) {
        addClick(e.pageX-canvasAreaDiv.offsetLeft, e.pageY - canvasAreaDiv.offsetTop, true);
        // addClick(e.pageX, e.pageY, true);
        let currentCanvasCoOrds = getCoOrdsBasedOnCurrentPageAndLayer()

        redraw(context, currentCanvasCoOrds)
        // redraw(context, save)
    }
}

function stopDraw(e) {
    paint = false;
}

function addClick(x, y, dragging) {
    let currentCanvasCoOrds = getCoOrdsBasedOnCurrentPageAndLayer()
    console.log(currentCanvasCoOrds)
    if (Array.isArray(currentCanvasCoOrds.clickX) && Array.isArray(currentCanvasCoOrds.clickY) && Array.isArray(currentCanvasCoOrds.clickDrag)) {
        currentCanvasCoOrds.clickX.push(x);
        currentCanvasCoOrds.clickY.push(y);
        currentCanvasCoOrds.clickDrag.push(dragging)
    } else {
        currentCanvasCoOrds.clickX = []
        currentCanvasCoOrds.clickY = []
        currentCanvasCoOrds.clickDrag = []
        currentCanvasCoOrds.clickX.push(x);
        currentCanvasCoOrds.clickY.push(y);
        currentCanvasCoOrds.clickDrag.push(dragging)
    }
    // save.clickX.push(x);
    // save.clickY.push(y);
    // save.clickDrag.push(dragging)
}

function getCoOrdsBasedOnCurrentPageAndLayer() {
    return WIPFlipbook.pages[WIPFlipbook.currentPage-1].layers[WIPFlipbook.currentLayer-1]
}


function redraw(context, currenCanvasCoords) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.strokeStyle = "#000";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (let i = 0; i < currenCanvasCoords.clickX.length; i++) {
        context.beginPath();
        if (currenCanvasCoords.clickDrag[i] && i) {
            context.moveTo(currenCanvasCoords.clickX[i-1], currenCanvasCoords.clickY[i-1])
        } else {
            context.moveTo(currenCanvasCoords.clickX[i]-1, currenCanvasCoords.clickY[i])
        }
        context.lineTo(currenCanvasCoords.clickX[i], currenCanvasCoords.clickY[i]);
        context.closePath();
        context.stroke();
    }
}

function saveCurrentDraw(e) {
    WIPFlipbook.pages[WIPFlipbook.currentPage-1].layers.push(JSON.parse(JSON.stringify(save)))
    console.log(WIPFlipbook)
}

function drawCurrentSave(canvas, currentCanvasCoOrds) {
    let context = canvas.getContext('2d')
    redraw(context, currentCanvasCoOrds)
}

function drawStaticLayerOnEachPage(e, currentDrawData) {
    let currentLayerPages = document.querySelectorAll(`canvas[data-layer-num="${WIPFlipbook.currentLayer}"]`)
    let currentCanvasCoOrds = getCoOrdsBasedOnCurrentPageAndLayer()
    currentLayerPages.forEach((layer, index) => {
        WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1] = JSON.parse(JSON.stringify(currentCanvasCoOrds))
        drawCurrentSave(layer, currentCanvasCoOrds)
    })
    
}

// NEXT and BACK

function handleNextPageClick(e) {
    if (WIPFlipbook.currentPage !== WIPFlipbook.totalPages) {
        let currentPage = document.querySelector(`div[data-page-num="${WIPFlipbook.currentPage}"]`)
        currentPage.style.display = 'none'

        WIPFlipbook.currentPage+=1

        // save.clickX = []
        // save.clickY = []
        // save.clickDrag = []

        let nextPageDiv = document.querySelector(`div[data-page-num="${WIPFlipbook.currentPage}"]`)
        nextPageDiv.style.display = 'block'
        
    } else {
        alert("Last Page")
    }
}

function handleBackPageClick(e) {
    if (WIPFlipbook.currentPage !== 1) {
        let currentPage = document.querySelector(`div[data-page-num="${WIPFlipbook.currentPage}"]`)

        currentPage.style.display = 'none'

        WIPFlipbook.currentPage-=1

        // save.clickX = []
        // save.clickY = []
        // save.clickDrag = []

        let prevPageDiv = document.querySelector(`div[data-page-num="${WIPFlipbook.currentPage}"]`)
        prevPageDiv.style.display = 'block'
    } else {
        alert('first page')
    }
}

// Play

function handlePlayClick(e) {
    
    let lastPage = document.querySelector(`div[data-page-num="${WIPFlipbook.currentPage}"]`)
    lastPage.style.display = 'none'

    let allPages = Array.from(document.querySelectorAll('div#canvas-area>div'))
    let time = 400
    allPages.forEach((page, index) => {
        if (index === 0) {
            page.style.display = "block"
        } else {
            setTimeout(() => {
                allPages[index-1].style.display = 'none'
                page.style.display = 'block'
                // setTimeout(() => canvas.style.display = 'none', 600)
            }, time)
            time+=400
        }
    })
    WIPFlipbook.currentPage = WIPFlipbook.totalPages
}

function getAllPageDivs() {
    return document.querySelectorAll(`div#canvas-area>div`)
}

// add layer to all pages

function addNewLayerToAllPages(e) {
    WIPFlipbook.currentLayer++
    let allPages = getAllPageDivs()
    allPages.forEach(div => {
        let newLayer = createCanvas(WIPFlipbook.currentLayer)
        div.append(newLayer)
    })
    addNewLayersToWIP()
}

function addNewLayersToWIP() {
    WIPFlipbook.pages.forEach(page => page.layers.push({}))
}


// animation functions

function addBlinkAnimation (e) {
    currentLayer = getCoOrdsBasedOnCurrentPageAndLayer()
    let currentLayerPages = document.querySelectorAll(`canvas[data-layer-num="${WIPFlipbook.currentLayer}"]`)
    allPages = WIPFlipbook.pages
    console.log(allPages)
    for (let index = WIPFlipbook.currentPage-1; index < WIPFlipbook.totalPages; index +=2) {
        console.log(allPages[index])
        allPages[index].layers[WIPFlipbook.currentLayer-1] = JSON.parse(JSON.stringify(currentLayer));
       drawCurrentSave(currentLayerPages[index], allPages[index].layers[WIPFlipbook.currentLayer-1])
    }
}

function addShakeAnimation (e) {
    currentLayer = getCoOrdsBasedOnCurrentPageAndLayer()
    let currentLayerPages = document.querySelectorAll(`canvas[data-layer-num="${WIPFlipbook.currentLayer}"]`)
    shookLayer =  JSON.parse(JSON.stringify(currentLayer))
    shookLayer.clickX = shookLayer.clickX.map ((coordinate) => coordinate +5)
    shookLayer.clickY = shookLayer.clickY.map ((coordinate) => coordinate +5)
    allPages = WIPFlipbook.pages
    for (let index = WIPFlipbook.currentPage-1; index < WIPFlipbook.totalPages; index ++) {
        if (index%2 === 0){ allPages[index].layers[WIPFlipbook.currentLayer-1] = JSON.parse(JSON.stringify(currentLayer));
       drawCurrentSave(currentLayerPages[index], allPages[index].layers[WIPFlipbook.currentLayer-1])}
       else{
         allPages[index].layers[WIPFlipbook.currentLayer-1] = JSON.parse(JSON.stringify(shookLayer));
            drawCurrentSave(currentLayerPages[index], allPages[index].layers[WIPFlipbook.currentLayer-1])
       }
    }
}

function addMoveLeftAnimation (e){
    currentLayer = getCoOrdsBasedOnCurrentPageAndLayer()
    let currentLayerPages = document.querySelectorAll(`canvas[data-layer-num="${WIPFlipbook.currentLayer}"]`)
    let min = Math.min(...currentLayer.clickX)
    let totalDistanceToMove = min -20
    let pagesLeft = WIPFlipbook.totalPages - WIPFlipbook.currentPage
    let incrementBy = Math.round(totalDistanceToMove/pagesLeft)
    let speed = incrementBy
    let alteredCoordinates = []
    for (let index = 0; index < pagesLeft; index++) {
        alteredCoordinates.push(JSON.parse(JSON.stringify(currentLayer)))
    }
    alteredCoordinates.forEach (layerObj => {
        layerObj.clickX = layerObj.clickX.map(xValue => xValue - speed)
        speed += incrementBy
    })
    alteredCoordinates.unshift(currentLayer)
    // currentLayerPages.forEach((layer, index) => {
    //     WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1] = JSON.parse(JSON.stringify(currentCanvasCoOrds))
    //     drawCurrentSave(layer, currentCanvasCoOrds)
    for (let index = WIPFlipbook.currentPage-1; index < WIPFlipbook.totalPages; index++) {
        console.log({altered: alteredCoordinates[index-(WIPFlipbook.currentPage-1)]})
        WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1] = alteredCoordinates[index-(WIPFlipbook.currentPage-1)] 
        
        console.log(WIPFlipbook.pages[index])//.layers[WIPFlipbook.currentLayer-1])
        
        drawCurrentSave(currentLayerPages[index], WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1])
        
    }
}

function addMoveRightAnimation (e) {
    currentLayer = getCoOrdsBasedOnCurrentPageAndLayer()
    let currentLayerPages = document.querySelectorAll(`canvas[data-layer-num="${WIPFlipbook.currentLayer}"]`)
    let max = Math.max(...currentLayer.clickX)
    let totalDistanceToMove = 780 - max
    let pagesLeft = WIPFlipbook.totalPages - WIPFlipbook.currentPage
    let incrementBy = Math.round(totalDistanceToMove/pagesLeft)
    let speed = incrementBy
    let alteredCoordinates = []
    for (let index = 0; index < pagesLeft; index++) {
        alteredCoordinates.push(JSON.parse(JSON.stringify(currentLayer)))
    }
    alteredCoordinates.forEach (layerObj => {
        layerObj.clickX = layerObj.clickX.map(xValue => xValue + speed)
        speed += incrementBy
    })
    alteredCoordinates.unshift(currentLayer)
    // currentLayerPages.forEach((layer, index) => {
    //     WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1] = JSON.parse(JSON.stringify(currentCanvasCoOrds))
    //     drawCurrentSave(layer, currentCanvasCoOrds)
    for (let index = WIPFlipbook.currentPage-1; index < WIPFlipbook.totalPages; index++) {
        console.log({altered: alteredCoordinates[index-(WIPFlipbook.currentPage-1)]})
        WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1] = alteredCoordinates[index-(WIPFlipbook.currentPage-1)] 
        
        console.log(WIPFlipbook.pages[index])//.layers[WIPFlipbook.currentLayer-1])
        
        drawCurrentSave(currentLayerPages[index], WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1])
        
    }

}



// Event listeners -----------

createFlipbookForm.addEventListener('submit', handleFlipbookCreation)

saveBtn.addEventListener('click', saveCurrentDraw)
drawBtn.addEventListener('click', drawCurrentSave)
nextBtn.addEventListener('click', handleNextPageClick)
backBtn.addEventListener('click', handleBackPageClick)
playBtn.addEventListener('click', handlePlayClick)

staticBtn.addEventListener('click', e => drawStaticLayerOnEachPage(e, save))

newLayerBtn.addEventListener('click', addNewLayerToAllPages)

blinkAnimationBtn.addEventListener('click', addBlinkAnimation)
shakeAnimationBtn.addEventListener('click', addShakeAnimation)
moveLeftAnimation.addEventListener('click', addMoveLeftAnimation)
moveRightAnimation.addEventListener('click', addMoveRightAnimation)