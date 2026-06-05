// enemies.js

class Enemy {

    constructor(
        x,
        y,
        size = "small"
    ) {

        this.x = x;
        this.y = y;

        this.size = size;

        this.active = true;

        switch(size){

            case "small":

                this.radius = 15;
                this.hp = 1;
                this.speed = 2.5;

                break;

            case "medium":

                this.radius = 28;
                this.hp = 3;
                this.speed = 1.8;

                break;

            case "large":

                this.radius = 45;
                this.hp = 8;
                this.speed = 1.2;

                break;

            case "giant":

                this.radius = 70;
                this.hp = 15;
                this.speed = 0.8;

                break;
        }
    }

    update(targetX,targetY){

        const dx =
            targetX - this.x;

        const dy =
            targetY - this.y;

        const dist =
            Math.sqrt(
                dx*dx +
                dy*dy
            );

        if(dist > 0){

            this.x +=
                (dx / dist)
                * this.speed;

            this.y +=
                (dy / dist)
                * this.speed;
        }
    }

    takeDamage(damage){

        this.hp -= damage;

        if(this.hp <= 0){

            this.destroy();
        }
    }

    destroy(){

        this.active = false;

        if(
            typeof spawnPowerUp ===
            "function"
        ){

            if(
                Math.random()
                < 0.15
            ){

                spawnPowerUp(
                    this.x,
                    this.y
                );
            }
        }
    }

    draw(ctx){

        let color =
            "#ff6b9f";

        if(
            this.size ===
            "medium"
        ){
            color = "#ff4d88";
        }

        if(
            this.size ===
            "large"
        ){
            color = "#ff2d6f";
        }

        if(
            this.size ===
            "giant"
        ){
            color = "#c9184a";
        }

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            color;

        ctx.fill();
    }
}

const enemies = [];

function spawnEnemy(size="small"){

    const side =
        Math.floor(
            Math.random() * 4
        );

    let x;
    let y;

    switch(side){

        case 0:

            x =
            Math.random()
            * canvas.width;

            y = -50;

            break;

        case 1:

            x =
            canvas.width + 50;

            y =
            Math.random()
            * canvas.height;

            break;

        case 2:

            x =
            Math.random()
            * canvas.width;

            y =
            canvas.height + 50;

            break;

        default:

            x = -50;

            y =
            Math.random()
            * canvas.height;
    }

    enemies.push(

        new Enemy(
            x,
            y,
            size
        )

    );
}

function splitEnemy(enemy){

    if(
        enemy.size ===
        "giant"
    ){

        enemies.push(
            new Enemy(
                enemy.x-30,
                enemy.y,
                "large"
            )
        );

        enemies.push(
            new Enemy(
                enemy.x+30,
                enemy.y,
                "large"
            )
        );

        return;
    }

    if(
        enemy.size ===
        "large"
    ){

        enemies.push(
            new Enemy(
                enemy.x-20,
                enemy.y,
                "medium"
            )
        );

        enemies.push(
            new Enemy(
                enemy.x+20,
                enemy.y,
                "medium"
            )
        );

        return;
    }

    if(
        enemy.size ===
        "medium"
    ){

        enemies.push(
            new Enemy(
                enemy.x-10,
                enemy.y,
                "small"
            )
        );

        enemies.push(
            new Enemy(
                enemy.x+10,
                enemy.y,
                "small"
            )
        );
    }
}

function updateEnemies(
    targetX,
    targetY
){

    enemies.forEach(enemy=>{

        enemy.update(
            targetX,
            targetY
        );
    });

    for(
        let i =
        enemies.length - 1;

        i >= 0;

        i--
    ){

        if(
            !enemies[i].active
        ){

            splitEnemy(
                enemies[i]
            );

            enemies.splice(
                i,
                1
            );
        }
    }
}

function drawEnemies(){

    enemies.forEach(enemy=>{

        enemy.draw(ctx);

    });
}
