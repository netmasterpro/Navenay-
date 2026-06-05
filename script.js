// script.js

const canvas =
document.getElementById(
    "gameCanvas"
);

const ctx =
canvas.getContext(
    "2d"
);

function resizeCanvas(){

    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);

const levelElement =
document.getElementById(
    "level"
);

const scoreElement =
document.getElementById(
    "score"
);

const livesElement =
document.getElementById(
    "lives"
);

const weaponElement =
document.getElementById(
    "weapon-level"
);

const messageElement =
document.getElementById(
    "message-text"
);

const startScreen =
document.getElementById(
    "start-screen"
);

const victoryScreen =
document.getElementById(
    "victory-screen"
);

const startBtn =
document.getElementById(
    "start-btn"
);

const restartBtn =
document.getElementById(
    "restart-btn"
);

let gameRunning =
false;

let score = 0;

let level = 1;

let gameTime = 0;

let spawnTimer = 0;

let bossStarted =
false;

let lastTime =
performance.now();

const heart = {

    x:0,
    y:0,

    radius:40,

    lives:5,

    update(){

        this.x =
        canvas.width/2;

        this.y =
        canvas.height-70;
    },

    draw(){

        ctx.save();

        ctx.fillStyle =
        "#ff4d88";

        drawHeart(
            this.x,
            this.y,
            this.radius
        );

        ctx.restore();
    }
};

heart.update();

function drawHeart(
    x,
    y,
    size
){

    ctx.beginPath();

    ctx.moveTo(
        x,
        y
    );

    ctx.bezierCurveTo(
        x-size,
        y-size,

        x-size*2,
        y+size/2,

        x,
        y+size*2
    );

    ctx.bezierCurveTo(
        x+size*2,
        y+size/2,

        x+size,
        y-size,

        x,
        y
    );

    ctx.fill();
}

const player =
new Player();

function setTarget(
    x,
    y
){

    player.targetX = x;
    player.targetY = y;
}

canvas.addEventListener(
    "mousemove",
    e => {

        setTarget(
            e.clientX,
            e.clientY
        );
    }
);

canvas.addEventListener(
    "touchmove",
    e => {

        const touch =
        e.touches[0];

        setTarget(
            touch.clientX,
            touch.clientY
        );

    },
    {
        passive:true
    }
);

function showMessage(
    text
){

    messageElement.textContent =
    text;
}

function circleCollision(
    x1,
    y1,
    r1,
    x2,
    y2,
    r2
){

    const dx = x1 - x2;
    const dy = y1 - y2;

    const distance =
    Math.sqrt(
        dx * dx +
        dy * dy
    );

    return (
        distance <
        r1 + r2
    );
}

function handleBulletEnemyCollisions(){

    player.bullets.forEach(
        bullet => {

            enemies.forEach(
                enemy => {

                    if(
                        !bullet.active ||
                        !enemy.active
                    ){
                        return;
                    }

                    if(

                        circleCollision(

                            bullet.x,
                            bullet.y,
                            bullet.radius,

                            enemy.x,
                            enemy.y,
                            enemy.radius

                        )

                    ){

                        bullet.active =
                        false;

                        enemy.takeDamage(
                            bullet.damage
                        );

                        score += 10;
                    }
                }
            );
        }
    );
}

function handleEnemyHeartCollisions(){

    enemies.forEach(
        enemy => {

            if(
                !enemy.active
            ){
                return;
            }

            if(

                circleCollision(

                    enemy.x,
                    enemy.y,
                    enemy.radius,

                    heart.x,
                    heart.y,
                    heart.radius

                )

            ){

                enemy.active =
                false;

                heart.lives--;

                showMessage(
                    "💔 El corazón fue golpeado"
                );

                if(
                    heart.lives <= 0
                ){

                    gameOver();
                }
            }
        }
    );
}

function handleEnemyPlayerCollisions(){

    enemies.forEach(
        enemy => {

            if(
                !enemy.active
            ){
                return;
            }

            if(

                circleCollision(

                    enemy.x,
                    enemy.y,
                    enemy.radius,

                    player.x,
                    player.y,
                    player.radius

                )

            ){

                enemy.active =
                false;

                player.takeDamage();

                if(
                    player.lives <= 0
                ){

                    gameOver();
                }
            }
        }
    );
}

function handleBossCollisions(){

    if(
        !boss.active
    ){
        return;
    }

    player.bullets.forEach(
        bullet => {

            if(
                !bullet.active
            ){
                return;
            }

            if(

                bulletBossCollision(
                    bullet,
                    boss
                )

            ){

                bullet.active =
                false;

                boss.takeDamage(
                    bullet.damage
                );

                score += 25;
            }
        }
    );
}

function updateLevel(){

    if(
        score >= 200 &&
        level === 1
    ){

        level = 2;

        showMessage(
            "❤️ Nivel 2"
        );
    }

    if(
        score >= 500 &&
        level === 2
    ){

        level = 3;

        showMessage(
            "💖 Nivel 3"
        );
    }

    if(
        score >= 900 &&
        level === 3
    ){

        level = 4;
    }

    if(
        score >= 1400 &&
        level === 4
    ){

        level = 5;
    }

    if(
        score >= 2000 &&
        level === 5
    ){

        level = 6;
    }

    if(
        score >= 2800 &&
        level === 6
    ){

        level = 7;
    }

    if(
        score >= 3800 &&
        level === 7
    ){

        level = 8;
    }

    if(
        score >= 5000 &&
        level === 8
    ){

        level = 9;
    }

    if(
        score >= 6500 &&
        level === 9
    ){

        level = 10;

        showMessage(
            "💀 JEFE FINAL"
        );
    }
}

function spawnEnemies(){

    spawnTimer++;

    let delay = 90;

    if(level >= 3)
        delay = 70;

    if(level >= 6)
        delay = 50;

    if(level >= 9)
        delay = 35;

    if(
        spawnTimer <
        delay
    ){
        return;
    }

    spawnTimer = 0;

    let type =
    "small";

    if(
        level >= 2 &&
        Math.random() < .4
    ){
        type =
        "medium";
    }

    if(
        level >= 4 &&
        Math.random() < .25
    ){
        type =
        "large";
    }

    if(
        level >= 7 &&
        Math.random() < .15
    ){
        type =
        "giant";
    }

    spawnEnemy(type);
}

// ======================================
// UPDATE
// ======================================

function update(deltaTime){

    if(!gameRunning){
        return;
    }

    gameTime += deltaTime;

    heart.update();

    player.update(
        deltaTime
    );

    updateEnemies(
        heart.x,
        heart.y
    );

    updatePowerUps(
        player
    );

    handleBulletEnemyCollisions();

    handleEnemyHeartCollisions();

    handleEnemyPlayerCollisions();

    updateLevel();

    spawnEnemies();

    if(
        level >= 10 &&
        !bossStarted
    ){

        bossStarted = true;

        boss.start();

        showMessage(
            "💀 JEFE FINAL 💀"
        );
    }

    boss.update();

    handleBossCollisions();

    levelElement.textContent =
    level;

    scoreElement.textContent =
    score;

    livesElement.textContent =
    player.lives;

    weaponElement.textContent =
    player.weaponLevel;
}

// ======================================
// RENDER
// ======================================

function drawBackground(){

    const gradient =
    ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
    );

    gradient.addColorStop(
        0,
        "#060818"
    );

    gradient.addColorStop(
        1,
        "#1d1238"
    );

    ctx.fillStyle =
    gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for(
        let i=0;
        i<120;
        i++
    ){

        const x =
        (i * 157)
        % canvas.width;

        const y =
        (i * 91)
        % canvas.height;

        ctx.fillStyle =
        "rgba(255,255,255,.35)";

        ctx.fillRect(
            x,
            y,
            2,
            2
        );
    }
}

function render(){

    drawBackground();

    heart.draw();

    drawEnemies();

    drawPowerUps();

    boss.draw(ctx);

    player.draw(ctx);
}

// ======================================
// GAME OVER
// ======================================

function gameOver(){

    gameRunning =
    false;

    startScreen.classList.remove(
        "hidden"
    );

    showMessage(
        "💔 GAME OVER"
    );
}

// ======================================
// VICTORY
// ======================================

function victory(){

    gameRunning =
    false;

    victoryScreen
    .classList
    .remove(
        "hidden"
    );

    showMessage(
        "❤️ VICTORIA ❤️"
    );
}

// ======================================
// RESET
// ======================================

function resetGame(){

    enemies.length = 0;

    powerUps.length = 0;

    player.bullets.length = 0;

    score = 0;

    level = 1;

    gameTime = 0;

    spawnTimer = 0;

    bossStarted =
    false;

    heart.lives = 5;

    player.lives = 5;

    player.weaponLevel = 1;

    player.shield = false;

    boss.active = false;
}

// ======================================
// GAME LOOP
// ======================================

function gameLoop(timestamp){

    const deltaTime =
    timestamp -
    lastTime;

    lastTime =
    timestamp;

    update(
        deltaTime
    );

    render();

    requestAnimationFrame(
        gameLoop
    );
}

// ======================================
// BUTTONS
// ======================================

startBtn.addEventListener(
    "click",
    () => {

        startScreen
        .classList
        .add(
            "hidden"
        );

        resetGame();

        gameRunning =
        true;
    }
);

restartBtn.addEventListener(
    "click",
    () => {

        victoryScreen
        .classList
        .add(
            "hidden"
        );

        resetGame();

        gameRunning =
        true;
    }
);

// ======================================
// START ENGINE
// ======================================

requestAnimationFrame(
    gameLoop
);
