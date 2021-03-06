import { Entity } from "./entity.js";
import { HealthBar } from "../healthBar.js";
import { Projectile } from "../projectile.js";
import { Sprite } from "../sprite.js";

import assets from "../../assets/assets.json" assert {type: 'json'};
import allies from "../../assets/allies/allies.json" assert {type: 'json'};

export class Defender {
    constructor(ctx, x, y, width, height) {
        this.ctx = ctx;

        this.entity = new Entity(x, y, width, height, 100, false);
        this.healthBar = new HealthBar(this, this.entity);
        this.spawnSprite = new Sprite(assets.Teleport);
        this.sprite = new Sprite(allies.Minotaur3);
    }

    draw() {
        this.sprite.draw(this.ctx, this.entity.x, this.entity.y);
        this.spawnSprite.draw(this.ctx, this.entity.x, this.entity.y);
        this.healthBar.draw();
    }


    update(projectiles, frame) {
        this.spawnSprite.update(frame);

        if (!this.entity.shooting) {
            this.entity.timer = 0;
            return;
        }

        this.sprite.update(frame);

        if (this.entity.timer % 80 === 0) {
            projectiles.push(new Projectile(this.ctx, this.entity.x + 70, this.entity.y + 50));
        }

        this.entity.timer++;

    }
}

export function handleDefenders(defenders, enemies, enemyPos, projectiles, frame, collision) {

    for (let i = 0; i < defenders.length; i++) {

        defenders[i].update(projectiles, frame);
        defenders[i].draw();

        if (enemyPos.indexOf(defenders[i].entity.y) !== -1) {
            defenders[i].entity.shooting = true;
        } else {
            defenders[i].entity.shooting = false;
        }

        //Check collision
        for (let j = 0; j < enemies.length; j++) {
            if (defenders[i] && collision(defenders[i], enemies[j])) {
                enemies[j].entity.movement = 0;
                defenders[i].entity.health -= 0.1;
            }
            if (defenders[i] && defenders[i].entity.health <= 0) {
                
                //Reset movement on row
                for (let n = 0; n < enemies.length; n++) {
                    if (enemies[n].entity.y === defenders[i].entity.y){
                        enemies[n].entity.movement = enemies[n].entity.speed;
                    }
                }
                
                defenders.splice(i, 1);
                i--;
                
            }
        }
    }
}