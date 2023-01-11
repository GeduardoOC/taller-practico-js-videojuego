const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

//botones de movimiento
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
window.addEventListener('keydown', moveBykeys);

//player position
const playerPosition = {
    x: undefined,
    y: undefined,
}

//constador vidas
const spanLives = document.querySelector('#lives');

//Cronometro
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
let timeStart;
let timePlayer;
let timeInterval;

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;    
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
}

function startGame() {
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if(!map) {
        gameWin();
        return;
    }

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    showLives();

    enemyPositions = [];
    game.clearRect(0,0,canvasSize, canvasSize);
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize*(colI+1.2);
            const posY = elementsSize*(rowI+0.8);

            if(col == 'O') {
                if(!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemyPositions.push({x: posX, y: posY,})
            }

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
}

//movimiento del jugador
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

//giftPosition
const giftPosition = {
    x: undefined,
    y: undefined,
};

//bombPosition
let enemyPositions = [];

function moveUp() {
    if((playerPosition.y - elementsSize) < 0) {
        console.log('OUT');
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    if((playerPosition.x - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}

function moveRight() {
    if((playerPosition.x + elementsSize) > canvasSize+20) {
        console.log('OUT');
    } else {
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown() {
    if((playerPosition.y + elementsSize) > canvasSize) {
        console.log('OUT');
    } else {
        playerPosition.y += elementsSize;
        startGame();
    }
}

function moveBykeys(event) {
    if(event.key == 'ArrowUp') moveUp(); 
    else if(event.key == 'ArrowLeft') moveLeft();
    else if(event.key == 'ArrowRight') moveRight();
    else if(event.key == 'ArrowDown') moveDown();
}

function movePlayer() {
    const giftCollisionX = Math.round(playerPosition.x) == Math.round(giftPosition.x);
    const giftCollisionY = Math.round(playerPosition.y) == Math.round(giftPosition.y);
    const giftCollision = giftCollisionX && giftCollisionY;


    if(giftCollision) {
        levelWin();  
    }

    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = Math.round(enemy.x) == Math.round(playerPosition.x);
        const enemyCollisionY = Math.round(enemy.y) == Math.round(playerPosition.y);

        return enemyCollisionX && enemyCollisionY;
    });

    if(enemyCollision) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    level++;
    startGame();
}

function levelFail() {
    lives--;

    if(lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    console.log('Terminaste!!!!');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;
    
    if(recordTime) {
        if(recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = ('Hazme un hijo porfa')
        } else {
            pResult.innerHTML = ('Que malo eres XD');
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Puto';
    }

    console.log({recordTime, playerTime});
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']); //[1,2,3]
    
    spanLives.innerHTML = "";
    heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}