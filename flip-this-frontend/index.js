// API ----------
const BASE_URL = "http://localhost:3000/"
const USERS_URL = BASE_URL + "users/"
const FLIPBOOKS_URL = BASE_URL + "flipbooks/"

function rToJson(resp) {
    return resp.json()
}

function get(url) {
    return fetch(url).then(rToJson)
}

function post(url, data) {
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(data)
    }
    return fetch(url, configObj).then(rToJson)
}

const API = {
    post,
    get
}
// Variables -------

// Login/signup
const loginBtn = document.querySelector('button#login-btn')
const signupBtn = document.querySelector('button#signup-btn')
const loginForm = document.querySelector('form#login-form')
const signupForm = document.querySelector('form#signup-form')

const cancelBtns = document.querySelectorAll('button.cancel-form')

// after login
const showFlipbooksButtonDiv = document.querySelector('div#display-users-flipbooks')
const showFlipbooksBtn = document.querySelector('button#show-flipbooks')

const modal = document.querySelector('div#flipbook-list-modal')

const flipbooksListContainer = document.querySelector('div#flipbooks-list-container')

let currentUser;


const createFlipbookForm = document.querySelector("#create-flipbook-form")
const mainContainerDiv = document.querySelector('div#main-container')

const canvasAreaDiv = document.querySelector("#canvas-area")
const animationConfigDiv = document.querySelector(".animation-config")
const saveBtn = document.querySelector('button#save')
const drawBtn = document.querySelector('button#draw-save')

// display buttons
const nextBtn = document.querySelector("button#next-page")
const backBtn = document.querySelector("button#back-page")
const playBtn = document.querySelector("button#play")

// layer buttons
const staticBtn = document.querySelector("button#static-background")
const newLayerBtn = document.querySelector("button#new-layer")

// animation buttons
const blinkAnimationBtn = document.querySelector("button#animate-blink")
const shakeAnimationBtn = document.querySelector("button#animate-shake")
const moveLeftAnimation = document.querySelector("button#animate-move-left")
const moveRightAnimation = document.querySelector("button#animate-move-right")
const moveUpAnimation = document.querySelector("button#animate-move-up")
const moveDownAnimation = document.querySelector("button#animate-move-down")


let paint;

let clickX = new Array();
let clickY = new Array();
let clickDrag = new Array();

let WIPFlipbook = {}

const save = {
    clickX, clickY, clickDrag
}


// Main Function definition area ---------

function handleFlipbookCreation(e) {
    e.preventDefault()

    while (canvasAreaDiv.firstChild) {
        canvasAreaDiv.removeChild(canvasAreaDiv.firstChild)
    }
    mainContainerDiv.style.display = 'flex'
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
            layers: [{
                clickX: [],
                clickY: [],
                clickDrag: []
            }]
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

function saveFlipBook(e) {
    let data = {
        user_id: currentUser.id,
        flipbook_object: JSON.stringify(WIPFlipbook)
    }
    
    API.post(FLIPBOOKS_URL, data).then(flipbook => {
        currentUser.flipbooks.push(flipbook)
        // console.log(flipbook)
        flipbooksListContainer.append(createFlipbookListItem(JSON.parse(flipbook.flipbook_object)))
    })

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
    WIPFlipbook.pages.forEach(page => page.layers.push({
        clickX: [],
        clickY: [],
        clickDrag: []
    }))
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
    for (let index = WIPFlipbook.currentPage-1; index < WIPFlipbook.totalPages; index++) {
        WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1] = alteredCoordinates[index-(WIPFlipbook.currentPage-1)] 
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
    for (let index = WIPFlipbook.currentPage-1; index < WIPFlipbook.totalPages; index++) {
        WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1] = alteredCoordinates[index-(WIPFlipbook.currentPage-1)] 
        drawCurrentSave(currentLayerPages[index], WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1])   
    }
}

function addMoveUpAnimation(e) {
    currentLayer = getCoOrdsBasedOnCurrentPageAndLayer()
    let currentLayerPages = document.querySelectorAll(`canvas[data-layer-num="${WIPFlipbook.currentLayer}"]`)
    let min = Math.min(...currentLayer.clickY)
    let totalDistanceToMove = min - 20
    let pagesLeft = WIPFlipbook.totalPages - WIPFlipbook.currentPage
    let incrementBy = Math.round(totalDistanceToMove/pagesLeft)
    let speed = incrementBy
    let alteredCoordinates = []
    for (let index = 0; index < pagesLeft; index++) {
        alteredCoordinates.push(JSON.parse(JSON.stringify(currentLayer)))
    }
    alteredCoordinates.forEach (layerObj => {
        layerObj.clickY = layerObj.clickY.map(yValue => yValue - speed)
        speed += incrementBy
    })
    alteredCoordinates.unshift(currentLayer)
    for (let index = WIPFlipbook.currentPage-1; index < WIPFlipbook.totalPages; index++) {
        WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1] = alteredCoordinates[index-(WIPFlipbook.currentPage-1)] 
        drawCurrentSave(currentLayerPages[index], WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1])   
    }
}

function addMoveDownAnimation(e) {
    currentLayer = getCoOrdsBasedOnCurrentPageAndLayer()
    let currentLayerPages = document.querySelectorAll(`canvas[data-layer-num="${WIPFlipbook.currentLayer}"]`)
    let max = Math.max(...currentLayer.clickY)
    let totalDistanceToMove = 480 - max
    let pagesLeft = WIPFlipbook.totalPages - WIPFlipbook.currentPage
    let incrementBy = Math.round(totalDistanceToMove/pagesLeft)
    let speed = incrementBy
    let alteredCoordinates = []
    for (let index = 0; index < pagesLeft; index++) {
        alteredCoordinates.push(JSON.parse(JSON.stringify(currentLayer)))
    }
    alteredCoordinates.forEach (layerObj => {
        layerObj.clickY = layerObj.clickY.map(yValue => yValue + speed)
        speed += incrementBy
    })
    alteredCoordinates.unshift(currentLayer)
    for (let index = WIPFlipbook.currentPage-1; index < WIPFlipbook.totalPages; index++) {
        WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1] = alteredCoordinates[index-(WIPFlipbook.currentPage-1)] 
        drawCurrentSave(currentLayerPages[index], WIPFlipbook.pages[index].layers[WIPFlipbook.currentLayer-1])   
    }
}

// Log in and signup

function showLoginForm(e) {
    mainContainerDiv.style.display = 'none'
    createFlipbookForm.style.display = 'none'
    signupForm.style.display = 'none'
    loginForm.style.display = 'block'
}

function showSignupForm(e) {
    mainContainerDiv.style.display = 'none'
    createFlipbookForm.style.display = 'none'
    signupForm.style.display = 'block'
    loginForm.style.display = 'none'
}

function showMainContent(e) {
    e.preventDefault()
    signupForm.style.display = 'none'
    loginForm.style.display = 'none'
    mainContainerDiv.style.display = 'block'
    createFlipbookForm.style.display = 'block'
}

function signupNewUser(e) {
    e.preventDefault()
    let username = e.target[0].value
    let data = {
        username
    }
    API.post(USERS_URL, data).then(user => {
        if (!user.errors) {
            currentUser = user
            let usernameSpan = document.querySelector('span#username')
            usernameSpan.innerText = currentUser.username
            loginBtn.style.display = 'none'
            signupBtn.style.display = 'none'
            signupForm.style.display = 'none'
            mainContainerDiv.style.display = 'flex'
            usernameSpan.parentNode.style.display = 'block'
            createFlipbookForm.style.display = 'block'
            showFlipbooksButtonDiv.style.display = 'block'

        } else {
            let error = document.createElement('h5')
            error.innerText = user.errors[0]
            error.style.color = 'red'
            signupForm.append(error)
            setTimeout(() => error.remove(), 5000)
        }
    }).catch(error => {
        alert('Server error')
    })
}

function loginUser(e){
    e.preventDefault()
    let username = e.target[0].value

    API.get(`${USERS_URL}${username}`)//.then(console.log)
    .then(user => {
        if (!user.errors) {
            currentUser = JSON.parse(JSON.stringify(user))
            let usernameSpan = document.querySelector('span#username')
            usernameSpan.innerText = currentUser.username
            loginBtn.style.display = 'none'
            signupBtn.style.display = 'none'
            loginForm.style.display = 'none'
            mainContainerDiv.style.display = 'flex'
            usernameSpan.parentNode.style.display = 'block'
            createFlipbookForm.style.display = 'block'
            showFlipbooksButtonDiv.style.display = 'block'

            let flipbooks = currentUser.flipbooks.map(flipbook => JSON.parse(flipbook.flipbook_object))
            appendAllFlipbooksToList(flipbooks)
        } else {
            let error = document.createElement('h5')
            error.innerText = user.errors[0]
            error.style.color = 'red'
            loginForm.append(error)
            setTimeout(() => error.remove(), 5000)
        }
    }).catch(error => {
        alert('Server error')
    })


}

// Displaying users flipbook list

function createFlipbookListItem(flipbook) {
    let div = document.createElement('div')
    div.classList.add('flipbook-list-item')
    div.setAttribute('data-title', flipbook.title)
    let p = document.createElement('p')
    p.innerText = flipbook.title
    div.append(p)
    div.addEventListener('click', handleFlipbookDrawAndDisplay)
    return div
}

function appendAllFlipbooksToList(flipbooks) {
    flipbooks.forEach(flipbook => {
        console.log(flipbook)
        flipbooksListContainer.append(createFlipbookListItem(flipbook))
    })
}

function displayUsersFlipbookList(e) {
    modal.style.display = 'block'
}

function handleFlipbookDrawAndDisplay(e) {
    let title = e.currentTarget.dataset.title
    console.log(title)
    console.log(currentUser)
    let obj = currentUser.flipbooks.find(flipbook => {
        return JSON.parse(flipbook.flipbook_object).title === title
    })
    let flipbookObj = JSON.parse(obj.flipbook_object)
    WIPFlipbook = flipbookObj
    drawFlipbook(WIPFlipbook)

}

function drawFlipbook(flipbook) {
    while (canvasAreaDiv.firstChild) {
        canvasAreaDiv.removeChild(canvasAreaDiv.firstChild)
    }
    let numOfPages = flipbook.pages.length
    createPageDivs(numOfPages)
    flipbook.pages.forEach((page, pageIndex) => {
        page.layers.forEach((layer, index) => {
            if (index === 0) {
                let canvas = document.querySelector(`div[data-page-num="${pageIndex+1}"] canvas`)
                drawCurrentSave(canvas, layer)
            } else {
                let div = document.querySelector(`div[data-page-num="${pageIndex+1}"]`)
                let newCanvas = createCanvas(index+1)
                drawCurrentSave(newCanvas, layer)
                div.append(newCanvas)
            }
        })
    })
    WIPFlipbook.currentPage = 1

}


// Event listeners -----------


// login and signup
loginBtn.addEventListener('click', showLoginForm)
signupBtn.addEventListener('click', showSignupForm)
cancelBtns.forEach(btn => btn.addEventListener('click', showMainContent))

signupForm.addEventListener('submit', signupNewUser)
loginForm.addEventListener('submit', loginUser)

// after login
showFlipbooksBtn.addEventListener('click', displayUsersFlipbookList)
window.onclick = e => {
    if (e.target === modal) modal.style.display = 'none'
}



createFlipbookForm.addEventListener('submit', handleFlipbookCreation)


saveBtn.addEventListener('click', saveFlipBook)
drawBtn.addEventListener('click', drawCurrentSave)

// display
nextBtn.addEventListener('click', handleNextPageClick)
backBtn.addEventListener('click', handleBackPageClick)
playBtn.addEventListener('click', handlePlayClick)


// layering
staticBtn.addEventListener('click', e => drawStaticLayerOnEachPage(e, save))

newLayerBtn.addEventListener('click', addNewLayerToAllPages)

// animations
blinkAnimationBtn.addEventListener('click', addBlinkAnimation)
shakeAnimationBtn.addEventListener('click', addShakeAnimation)
moveLeftAnimation.addEventListener('click', addMoveLeftAnimation)
moveRightAnimation.addEventListener('click', addMoveRightAnimation)
moveUpAnimation.addEventListener('click', addMoveUpAnimation)
moveDownAnimation.addEventListener('click', addMoveDownAnimation)