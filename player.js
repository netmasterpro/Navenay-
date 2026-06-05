// player.js

class Bullet {
    constructor(x, y, vx, vy, damage = 1) {
        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.damage = damage;

        this.radius = 4;

        this.active = true;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (
            this.x < -50 ||
            this.x > canvas.width + 50 ||
            this.y < -50 ||
            this.y > canvas.height + 50
        ) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd6e7";
        ctx.fill();
    }
}

class Player {

    constructor() {

        this.x = canvas.width / 2;
        this.y = canvas.height - 180;

        this.targetX = this.x;
        this.targetY = this.y;

        this.radius = 28;

        this.speed = 0.15;

        this.weaponLevel = 1;

        this.fireRate = 250;
        this.lastShot = 0;

        this.lives = 5;

        this.shield = false;
        this.shieldTime = 0;

        this.bullets = [];
    }

    update(deltaTime) {

        this.x +=
            (this.targetX - this.x) *
            this.speed;

        this.y +=
            (this.targetY - this.y) *
            this.speed;

        this.autoShoot();

        this.bullets.forEach(
            bullet => bullet.update()
        );

        this.bullets =
            this.bullets.filter(
                bullet => bullet.active
            );

        if (this.shield) {

            this.shieldTime -= deltaTime;

            if (this.shieldTime <= 0) {

                this.shield = false;
                this.shieldTime = 0;
            }
        }
    }

    autoShoot() {

        const now = performance.now();

        if (
            now - this.lastShot <
            this.fireRate
        ) {
            return;
        }

        this.lastShot = now;

        switch (this.weaponLevel) {

            case 1:

                this.spawnBullet(
                    this.x,
                    this.y - 25,
                    0,
                    -10
                );

                break;

            case 2:

                this.spawnBullet(
                    this.x - 10,
                    this.y - 25,
                    0,
                    -10
                );

                this.spawnBullet(
                    this.x + 10,
                    this.y - 25,
                    0,
                    -10
                );

                break;

            case 3:

                this.spawnBullet(
                    this.x,
                    this.y - 25,
                    0,
                    -11
                );

                this.spawnBullet(
                    this.x - 12,
                    this.y - 25,
                    -1,
                    -10
                );

                this.spawnBullet(
                    this.x + 12,
                    this.y - 25,
                    1,
                    -10
                );

                break;

            default:

                for (
                    let i = 0;
                    i < this.weaponLevel;
                    i++
                ) {

                    const offset =
                        (i - this.weaponLevel / 2) * 8;

                    this.spawnBullet(
                        this.x + offset,
                        this.y - 25,
                        offset * 0.05,
                        -12
                    );
                }

                break;
        }
    }

    spawnBullet(x, y, vx, vy) {

        this.bullets.push(

            new Bullet(
                x,
                y,
                vx,
                vy,
                1
            )

        );
    }

    upgradeWeapon() {

        if (
            this.weaponLevel < 10
        ) {

            this.weaponLevel++;
        }
    }

    addShield(seconds = 5) {

        this.shield = true;

        this.shieldTime =
            seconds * 1000;
    }

    takeDamage() {

        if (this.shield) {
            return;
        }

        this.lives--;

        if (this.lives < 0) {
            this.lives = 0;
        }
    }

    draw(ctx) {

        ctx.save();

        if (this.shield) {

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.radius + 15,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "rgba(150,220,255,0.25)";

            ctx.fill();
        }

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();

        ctx.moveTo(
            this.x,
            this.y - 30
        );

        ctx.lineTo(
            this.x - 18,
            this.y + 18
        );

        ctx.lineTo(
            this.x,
            this.y + 10
        );

        ctx.lineTo(
            this.x + 18,
            this.y + 18
        );

        ctx.closePath();

        ctx.fill();

        ctx.restore();

        this.bullets.forEach(
            bullet => bullet.draw(ctx)
        );
    }
}
