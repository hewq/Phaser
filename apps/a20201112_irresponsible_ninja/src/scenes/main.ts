import pngTips from '@images/tips.png';
import pngProcess from '@images/process_border.png';
import pngSprites from '@images/sprites.png';
import pngNinja from '@images/ninja.png';

let txtDistance: Phaser.GameObjects.Text;
let rect: Phaser.GameObjects.Rectangle;
let stick: Phaser.GameObjects.Rectangle;

let processTimerEvent: Phaser.Time.TimerEvent;

let overContainer: Phaser.GameObjects.Container;
let gameContainer: Phaser.GameObjects.Container;

let prePlatformDistance: number;
let nextPlatformDistance: number;
let curPlatformWidth: number;
let prePlatformWidth: number;
let nextPlatformWidth: number;

let curPlatformX: number;
let nextPlatformX: number;

let ninja: Phaser.GameObjects.Sprite;

let distance = 0;
let isPlaying = false;
let isStart = false;

const config: GameConfig = {
    processLen: 500,
    processHeight: 29,
    platformHeight: 600,
    stickWidth: 10,
    stickHeight: -10
};

let stickHeight = config.stickHeight;
let processLen = config.processLen;

export default class extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    preload(): void {
        this.load.image('imgTips', pngTips);
        this.load.image('imgProcess', pngProcess);
        this.load.spritesheet('ssSprites', pngSprites, { frameWidth: 150, frameHeight: 150});
        this.load.spritesheet('ssNinja', pngNinja, { frameWidth: 462 / 6, frameHeight: 388 / 4});
    }

    create(): void {
        // tips
        const tips = this.add.image(window.game.width / 2, 400, 'imgTips');

        // process
        const process = this.add.image(0, 0, 'imgProcess');
        txtDistance = this.add.text(260, -24, 'DISTANCE: 0', {
            fontFamily: 'Arial',
            fontSize: 40,
            color: '#ffffff'
        }).setOrigin(1);

        rect = this.add.rectangle(-250, 0, config.processLen, config.processHeight, 0xffffff).setOrigin(0, 0.5);

        // timer container
        const timerContainer = this.add.container(window.game.width / 2, 400, [process, txtDistance, rect]);
        timerContainer.setAlpha(0);

        // game over container
        const btnPlay = this.add.sprite(-110, 0, 'ssSprites', 0).setInteractive();
        const btnHome = this.add.sprite(110, 0, 'ssSprites', 1).setInteractive();
        overContainer = this.add.container(window.game.width / 2, 1800, [btnPlay, btnHome]);
        overContainer.setAlpha(0.5);

        btnPlay.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            this.reset();
            this.scene.restart();
        });

        btnHome.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            this.reset();
            this.scene.start('StartScene');
        });

        // game container
        ninja = this.add.sprite(90, -600, 'ssNinja', 0).setOrigin(1);

        this.anims.create({
            key: 'stand',
            frames: this.anims.generateFrameNumbers('ssNinja', { start: 0, end: 11 }),
            frameRate: 12,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('ssNinja', { start: 12, end: 19 }),
            frameRate: 12,
            repeat: -1
        });

        ninja.play('stand');

        stick = this.add.rectangle(90, -config.platformHeight, config.stickWidth, config.stickHeight, 0x000000).setOrigin(1, 0);

        let stickTimerEvent: Phaser.Time.TimerEvent;
        
        this.input.on('pointerdown', () => {
            if (!isPlaying) {
                tips.setAlpha(0);
                timerContainer.setAlpha(1);
                // timer event
                if (!isStart) {
                    isStart = true;
                    processTimerEvent = this.time.addEvent({
                        callback: this.processTimer.bind(this),
                        loop: true,
                        delay: 1000
                    });
                }

                stickTimerEvent = this.time.addEvent({
                    callback: this.stickTimer,
                    loop: true,
                    delay: 10
                });
            }

        });

        this.input.on('pointerup', () => {
            if (stickTimerEvent && !isPlaying) {
                isPlaying = true;
                stickTimerEvent.destroy();
                this.createWalkTimeline();
            }
        });

        gameContainer = this.add.container(window.game.width / 2, window.game.height, [ninja, stick]);
        gameContainer.setSize(window.game.width, window.game.height);
        gameContainer.setPosition(0, window.game.height);

        // initial firstPlatform
        const firstPlatform = this.add.rectangle(0, 0, 100, config.platformHeight, 0x000000).setOrigin(0, 1);
        gameContainer.add(firstPlatform);
        gameContainer.bringToTop(ninja);
        curPlatformX = 0;
        curPlatformWidth = 100;
        prePlatformDistance = 0;

        this.createPlatform(false);
    }

    createWalkTimeline(): void {
        const walkTimeline = this.tweens.createTimeline();

        // stick
        walkTimeline.add({
            targets: stick,
            props: {
                angle: 90
            },
            duration: 500,
            ease: Phaser.Math.Easing.Bounce.Out,
            onComplete() {
                ninja.play('walk');
            }
        });

        // walk
        walkTimeline.add({
            targets: ninja,
            props: {
                x: (target) => {
                    return target.x + Math.abs(stickHeight) + ninja.getBounds().width / 2;
                },
                y: (target) => {
                    return target.y - 10;
                }
            },
            duration: 500,
            onComplete: () => {
                ninja.play('stand');
                this.calcDistance();
                walkTimeline.destroy();
            }
        });

        walkTimeline.play();
    }

    calcDistance(): void {
        const near = Phaser.Math.Distance.Between(stick.x, 0, nextPlatformX, 0);
        const far = Phaser.Math.Distance.Between(stick.x, 0, nextPlatformX + nextPlatformWidth, 0);

        curPlatformX = nextPlatformX;
        prePlatformWidth = curPlatformWidth;
        curPlatformWidth = nextPlatformWidth;
        prePlatformDistance = nextPlatformDistance;

        if (-stickHeight > near && -stickHeight < far) { // in safety zone
            this.createPlatform(true);
            txtDistance.setText(`DISTANCE: ${++distance}`);
        } else {
            this.gameover();
            if (-stickHeight < near) {
                this.add.tween({
                    targets: stick,
                    props: {
                        angle: 180
                    },
                    duration: 800,
                    ease: Phaser.Math.Easing.Bounce.Out
                });
            }
        }

        stickHeight = config.stickHeight;
    }

    createPlatform(playAnim: boolean): void {
        nextPlatformDistance = Phaser.Math.Between(150, 300);
        nextPlatformWidth = Phaser.Math.Between(80, 150);

        nextPlatformX = curPlatformX + nextPlatformDistance + curPlatformWidth;

        const rect = this.add.rectangle(nextPlatformX + 750, 0, nextPlatformWidth, config.platformHeight, 0x000000).setOrigin(0, 1);
        
        gameContainer.add(rect);
        gameContainer.bringToTop(ninja);

        if (playAnim) {
            this.add.tween({
                targets: gameContainer,
                props: {
                    x: (target) => {
                        return target.x - (prePlatformDistance + prePlatformWidth);
                    }
                },
                duration: 300,
                ease: Phaser.Math.Easing.Sine.In
            });

            this.add.tween({
                targets: rect,
                props: {
                    x: nextPlatformX
                },
                duration: 500,
                ease: Phaser.Math.Easing.Sine.In
            });

            this.add.tween({
                targets: ninja,
                props: {
                    y: (target) => {
                        return target.y + 10;
                    },
                    x: curPlatformX + (curPlatformWidth - 20)
                },
                duration: 300
            });

            this.add.tween({
                targets: stick,
                props: {
                    alpha: 0
                },
                duration: 300,
                onComplete: () => {
                    stick.setSize(config.stickWidth, config.stickHeight);
                    stick.setAngle(0);
                    stick.setX(curPlatformX + (curPlatformWidth - 10));
                    stick.setAlpha(1);
                    isPlaying = false;
                }
            });
        } else {
            rect.setPosition(nextPlatformX, 0);
        }
    }

    stickTimer(): void {
        stickHeight -= 25;
        stick.setSize(config.stickWidth, stickHeight);
    }

    gameover(): void {
        processTimerEvent.destroy();
        // shake
        const vec2 = new Phaser.Math.Vector2(0.005, 0.01);
        this.add.tween({
            targets: ninja,
            ease: Phaser.Math.Easing.Linear,
            duration: 600,
            props: {
                angle: 45,
                x: (target) => {
                    return target.x + 50;
                },
                y: 50
            },
            onComplete: () => {
                this.cameras.main.shake(200, vec2);
                this.scene.get('FootScene').cameras.main.shake(200, vec2);
                this.scene.get('BackgroundScene').cameras.main.shake(200, vec2);
            }
        });

        this.add.tween({
            targets: overContainer,
            props: {
                y: window.game.height / 2,
                alpha: 1
            },
            delay: 1200,
            duration: 800,
            ease: Phaser.Math.Easing.Back.InOut
        });

        this.add.tween({
            targets: gameContainer,
            props: {
                alpha: 0
            },
            delay: 1000,
            duration: 800,
            ease: Phaser.Math.Easing.Back.InOut
        });
    }

    processTimer(): void {
        processLen -= 5;
        rect.setSize(processLen, config.processHeight);
        if (processLen === 0) {
            processTimerEvent.destroy();

            this.gameover();
        }
    }

    reset(): void {
        processLen = config.processLen;
        isPlaying = false;
        isStart = false;
        distance = 0;
    }
}