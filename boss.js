// boss.js

class Boss {

    constructor(){

        this.x =
            canvas.width / 2;

        this.y = -200;

        this.radius = 120;

        this.hp = 500;

        this.maxHp = 500;

        this.active = false;

        this.entered = false;

        this.spawnTimer = 0;
    }

    start(){

        this.active = true;

        this.entered = false;

        this.hp =
            this.maxHp;

        this.y = -200;
    }

    update(){

        if(
            !this.active
        ){
            return;
        }

        if(
            !this.entered
        ){

            this.y += 1;

            if(
                this.y >= 180
            ){
                this.entered =
                true;
            }

            return;
        }

        this.spawnTimer++;

        if(
            this.spawnTimer >
            180
        ){

            this.spawnTimer = 0;

            spawnEnemy(
                "medium"
            );

            spawnEnemy(
                "large"
            );
        }
    }

    draw(ctx){

        if(
            !this.active
        ){
            return;
        }

        ctx.save();

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#2a0a2a";

        ctx.fill();

        ctx.lineWidth = 8;

        ctx.strokeStyle =
            "#ff4d88";

        ctx.stroke();

        ctx.restore();

        this.drawHealthBar(
            ctx
        );
    }

    drawHealthBar(
        ctx
    ){

        const width =
            400;

        const height =
            20;

        const x =
            canvas.width/2
            - width/2;

        const y = 30;

        ctx.fillStyle =
            "#333";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        ctx.fillStyle =
            "#ff4d88";

        ctx.fillRect(
            x,
            y,
            width *
            (
                this.hp /
                this.maxHp
            ),
            height
        );
    }

    takeDamage(
        damage
    ){

        if(
            !this.active
        ){
            return;
        }

        this.hp -= damage;

        if(
            this.hp <= 0
        ){

            this.hp = 0;

            this.die();
        }
    }

    die(){

        this.active =
            false;

        if(
            typeof victory
            ===
            "function"
        ){

            victory();
        }
    }
}

const boss =
    new Boss();
    
    function bulletBossCollision(
    bullet,
    boss
){

    const dx =
        bullet.x -
        boss.x;

    const dy =
        bullet.y -
        boss.y;

    const distance =
        Math.sqrt(
            dx*dx +
            dy*dy
        );

    return (

        distance <
        boss.radius

    );
}

