import { levelList } from '@data/gameData';

let container: Phaser.GameObjects.Container;
let tileTween: Phaser.Tweens.Tween;

const gameOptions = {
    tileSize: 100,
    filedSize: {
        rows: 6,
        cols: 6
    },
    margin: 5,
    colors: [0x333333, 0xea225e, 0xef6c00, 0x1674bc, 0x388e3c],
    directions: [
        new Phaser.Math.Vector2(0, -1),
        new Phaser.Math.Vector2(1, -1),
        new Phaser.Math.Vector2(1, 0),
        new Phaser.Math.Vector2(1, 1),
        new Phaser.Math.Vector2(0, 1),
        new Phaser.Math.Vector2(-1, 1),
        new Phaser.Math.Vector2(-1, 0),
        new Phaser.Math.Vector2(-1, -1)
    ]
};

export default class extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    preload (): void {
        this.load.spritesheet('title', require('@images/title.png').default, { frameWidth: 750, frameHeight: 100 });
        this.load.spritesheet('numbers', require('@images/numbers.png').default, { frameWidth: 50, frameHeight: 50 });
        this.load.spritesheet('btns', require('@images/btns.png').default, { frameWidth: 100, frameHeight: 100 });
    }

    create (): void {
        container = this.add.container(window.game.width + window.game.width / 2, window.game.height / 2).setInteractive();

        this.events.on('transitionstart', () => { 
            this.tweens.add({
                targets: container,
                props: {
                    x: window.game.width / 2,
                },
                duration: 300
            });
        });

        container.add(this.add.sprite(0, -560, 'title', 0));

        const btnMenu = this.add.sprite(-280, -320, 'btns', 0).setInteractive();
        const btnPrev = this.add.sprite(-180, -320, 'btns', 1).setInteractive();
        const btnNext = this.add.sprite(-80, -320, 'btns', 2).setInteractive();
        const btnRefresh = this.add.sprite(20, -320, 'btns', 3).setInteractive();

        container.add([btnMenu, btnPrev, btnNext, btnRefresh]);

        btnMenu.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            this.scene.transition({
                target: 'StartScene',
                duration: 300,
                onUpdate: this.transitionOut,
                data: {
                    x: window.game.width
                }
            });
        });

        const levelTxt = this.add.text(320, -270, '1/10', {
            fontSize: 74,
            fontFamily: 'Arail',
            color: '#ffffff'
        }).setOrigin(1);

        container.add(levelTxt);

        this.initTile();
    }

    transitionOut (progress: number): void {
        container.x = window.game.width / 2 + window.game.width * progress;
    }

    initTile (): void {
        const tileContainer = this.add.container().setSize(gameOptions.tileSize, gameOptions.tileSize);
        let rect: Phaser.GameObjects.Rectangle;
        let number: Phaser.GameObjects.GameObject;

        levelList[0].forEach((row) => {
            row.forEach((num) => {
                rect = this.add.rectangle(0, 0, gameOptions.tileSize, gameOptions.tileSize, gameOptions.colors[num]);
                rect.setInteractive();
                rect.setDataEnabled();
                rect.setData({
                    value: num
                });

                const _this = this;
                rect.on('pointerdown', function () {
                    console.log(this);
                    _this.addTween([this]);
                });

                number = this.add.sprite(0, 0, 'numbers', num - 1 > 0 ? num - 1 : 5);

                tileContainer.add(rect);
                tileContainer.add(number);

            });
        });
    }

    addTween (targets: Phaser.GameObjects.GameObject[]): void {
        tileTween = this.add.tween({
            targets: targets,
            props: {
                scale: 0.8
            },
            duration: 300,
            yoyo: true,
            loop: -1,
            ease: Phaser.Math.Easing.Sine.InOut
        });
    }
}