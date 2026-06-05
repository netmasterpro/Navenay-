// powerups.js

class PowerUp {

    constructor(
        x,
        y,
        type
    ){

        this.x = x;
        this.y = y;

        this.type = type;

        this.radius = 18;

        this.speed = 2;

        this.active = true;
    }

    update(){

        this.y += this.speed;

        if(
            this.y >
            canvas.height + 50
        ){
            this.active = false;
        }
    }

    draw(ctx){

        let emoji = "💎";

        switch(this.type){

            case "weapon":
                emoji = "🔫";
                break;

            case "speed":
                emoji = "⚡";
                break;

            case "heal":
                emoji = "❤️";
                break;

            case "shield":
                emoji = "🛡️";
                break;

            case "bomb":
                emoji = "💣";
                break;
        }

        ctx.font = "28px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            emoji,
            this.x,
            this.y
        );
    }
}

const powerUps = [];

function randomPowerType(){

    const types = [

        "weapon",
        "speed",
        "heal",
        "shield",
        "bomb"

    ];

    return types[
        Math.floor(
            Math.random() *
            types.length
        )
    ];
}

function spawnPowerUp(
    x,
    y
){

    powerUps.push(

        new PowerUp(
            x,
            y,
            randomPowerType()
        )

    );
}

function applyPowerUp(
    player,
    type
){

    switch(type){

        case "weapon":

            player.upgradeWeapon();

            break;

        case "speed":

            player.speed += 0.03;

            break;

        case "heal":

            player.lives++;

            if(
                player.lives > 5
            ){
                player.lives = 5;
            }

            break;

        case "shield":

            player.addShield(
                8
            );

            break;

        case "bomb":

            enemies.forEach(
                enemy => {

                    enemy.active =
                    false;

                }
            );

            break;
    }
}

function powerUpCollision(
    player,
    power
){

    const dx =
        player.x -
        power.x;

    const dy =
        player.y -
        power.y;

    const distance =
        Math.sqrt(
            dx*dx +
            dy*dy
        );

    return (

        distance <
        player.radius +
        power.radius

    );
}

function updatePowerUps(
    player
){

    powerUps.forEach(
        power => {

            power.update();

            if(
                powerUpCollision(
                    player,
                    power
                )
            ){

                applyPowerUp(
                    player,
                    power.type
                );

                power.active =
                false;
            }
        }
    );

    for(
        let i =
        powerUps.length - 1;

        i >= 0;

        i--
    ){

        if(
            !powerUps[i]
            .active
        ){

            powerUps.splice(
                i,
                1
            );
        }
    }
}

function drawPowerUps(){

    powerUps.forEach(
        power => {

            power.draw(
                ctx
            );

        }
    );
}

