class Bullet {
    constructor(x, y, vx, vy, damage = 1){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
        this.radius = 4;
        this.active = true;
    }

    update(){
        this.x += this.vx;
        this.y += this.vy;
        if(this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50){
            this.active = false;
        }
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd6e7";
        ctx.fill();
    }
}

class Player {
    constructor(){
        this.x = 0; this.y = 0;
        this.targetX = 0; this.targetY = 0;
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

    // Fuerza la ubicación correcta sin importar el tamaño del display
    initPosition(){
        this.x = canvas.width / 2;
        this.y = canvas.height - 180;
        this.targetX = this.x;
        this.targetY = this.y;
    }

    update(deltaTime){
        // Respaldo de seguridad si arranca en ceros
        if(this.x === 0 && this.y === 0){
            this.initPosition();
        }

        this.x += (this.targetX - this.x) * this.speed;
        this.y += (this.targetY - this.y) * this.speed;

        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        this.autoShoot();

        this.bullets.forEach(bullet => bullet.update());
        this.bullets = this.bullets.filter(bullet => bullet.active);

        if(this.shield){
            this.shieldTime -= deltaTime;
            if(this.shieldTime <= 0){
                this.shield = false;
                this.shieldTime = 0;
            }
        }
    }

    autoShoot(){
        const now = performance.now();
        if(now - this.lastShot < this.fireRate) return;
        this.lastShot = now;

        if(this.weaponLevel === 1){
            this.spawnBullet(this.x, this.y - 25, 0, -10);
            return;
        }

        if(this.weaponLevel === 2){
            this.spawnBullet(this.x - 10, this.y - 25, 0, -10);
            this.spawnBullet(this.x + 10, this.y - 25, 0, -10);
            return;
        }

        const shots = Math.min(this.weaponLevel, 6);
        for(let i = 0; i < shots; i++){
            const offset = (i - (shots - 1) / 2) * 12;
            this.spawnBullet(this.x + offset, this.y - 25, offset * 0.05, -12);
        }
    }

    spawnBullet(x, y, vx, vy){
        this.bullets.push(new Bullet(x, y, vx, vy, Math.ceil(this.weaponLevel / 2)));
    }

    upgradeWeapon(){
        if(this.weaponLevel < 10) this.weaponLevel++;
    }

    addShield(seconds = 5){
        this.shield = true;
        this.shieldTime = seconds * 1000;
    }

    takeDamage(){
        if(this.shield) return;
        this.lives--;
        if(this.lives < 0) this.lives = 0;
    }

    draw(ctx){
        if(this.shield){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 15, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(120,220,255,.25)";
            ctx.fill();
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(-18, 20);
        ctx.lineTo(0, 10);
        ctx.lineTo(18, 20);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        this.bullets.forEach(bullet => bullet.draw(ctx));
    }
}
