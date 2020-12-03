import { levelList } from '@data/gameData';

let container: Phaser.GameObjects.Container;
let curTile: Phaser.GameObjects.Container;
let tmEvt: Phaser.Time.TimerEvent;
let levelTxt: Phaser.GameObjects.Text;
let lock: Phaser.GameObjects.Container;

let btnPrev: Phaser.GameObjects.Sprite;
let btnNext: Phaser.GameObjects.Sprite;

const storageKeyLevel = 'original_level';

const containerList: Phaser.GameObjects.Container[] = [];
let activeTileList: Phaser.GameObjects.Container[] = [];

let hasTw = false;
let clearTw = false;

let curLevel = 1;
let unlockLevel = 1;
const totalLevel = 10;

const RECT = 0;
const NUMBER = 1;

const gameOptions = {
    tileSize: 100,
    filedSize: {
        rows: 6,
        cols: 6
    },
    margin: 10,
    colors: [0x333333, 0xea225e, 0xef6c00, 0x1674bc, 0x388e3c, 0xffffff],
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
        this.load.image('lock', require('@images/lock.png').default);
    }

    create (): void {
        this.initUnlockLevel();

        container = this.add.container(window.game.width + window.game.width / 2, window.game.height / 2);

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
        const btnRefresh = this.add.sprite(20, -320, 'btns', 3).setInteractive();
        btnPrev = this.add.sprite(-180, -320, 'btns', 1).setInteractive();
        btnNext = this.add.sprite(-80, -320, 'btns', 2).setInteractive();

        this.setBtnStyle();

        container.add([btnMenu, btnPrev, btnNext, btnRefresh]);

        btnMenu.on('pointerdown', () => {
            this.scene.transition({
                target: 'StartScene',
                duration: 300,
                onUpdate: this.transitionOut,
                data: {
                    x: window.game.width
                }
            });
        });

        btnPrev.on('pointerdown', () => {
            this.switchLevel(-1);
        });

        btnNext.on('pointerdown', () => {
            this.switchLevel(1);
        });

        levelTxt = this.add.text(320, -270, `${curLevel}/10`, {
            fontSize: 74,
            fontFamily: 'Arail',
            color: '#ffffff'
        }).setOrigin(1);

        container.add(levelTxt);

        this.createTotalLevel();

        lock = this.add.container().setVisible(false);
        const lockRect = this.add.rectangle(4, 76, 750, 650, 0x000000, 0.5);
        lock.add(lockRect);
        lock.add(this.add.image(3, 80, 'lock'));
        lockRect.setInteractive();

        container.add(lock);
    }

    initUnlockLevel (): void {
        const level = localStorage.getItem(storageKeyLevel);
        if (level) {
            unlockLevel = Number(level);
            curLevel = unlockLevel;
        } else {
            localStorage.setItem(storageKeyLevel, String(unlockLevel));
        }
    }

    switchLevel (direction: number): void {
        const leverSwitchTo = curLevel + direction;
        if (leverSwitchTo > 0 && leverSwitchTo <= totalLevel) {
            this.add.tween({
                targets: containerList[curLevel - 1],
                props: {
                    x: window.game.width
                },
                duration: 300
            });
            this.add.tween({
                targets: containerList[leverSwitchTo - 1],
                props: {
                    x: 0
                },
                duration: 300
            });
            curLevel = leverSwitchTo;
            levelTxt.setText(`${curLevel}/${totalLevel}`);
        }

        this.setBtnStyle();
        this.setLock();
    }

    setLock (): void {
        if (curLevel > unlockLevel) {
            lock.setVisible(true);
        } else {
            lock.setVisible(false);
        }
    }

    setBtnStyle (): void {
        if (curLevel === 1) {
            btnPrev.setAlpha(0.5);
            btnNext.setAlpha(1);
        } else if (curLevel === totalLevel) {
            btnPrev.setAlpha(1);
            btnNext.setAlpha(0.5);
        } else {
            btnPrev.setAlpha(1);
            btnNext.setAlpha(1);
        }
    }

    createTotalLevel (): void {
        for (let i = 0; i < totalLevel; i++) {
            this.createTileBoard(i);
        }
    }

    transitionOut (progress: number): void {
        container.x = window.game.width / 2 + window.game.width * progress;
    }

    getNumberFrameIndex (num: number): number {
        return num - 1 < 0 ? 5 : num - 1;
    }

    createTileBoard (levelIndex: number): void {
        let rect: Phaser.GameObjects.Rectangle;
        let number: Phaser.GameObjects.GameObject;
        let itemContainer: Phaser.GameObjects.Container;

        const tileContainer = this.add.container();

        levelList[levelIndex].forEach((row, rowIndex) => {
            row.forEach((num, colIndex) => {
                itemContainer = this.add.container().setSize(gameOptions.tileSize, gameOptions.tileSize).setInteractive();
                rect = this.add.rectangle(0, 0, gameOptions.tileSize, gameOptions.tileSize, gameOptions.colors[num]);
                number = this.add.sprite(0, 0, 'numbers', this.getNumberFrameIndex(num));

                itemContainer.add(rect);
                itemContainer.add(number);

                itemContainer.setDataEnabled();
                itemContainer.setData({
                    value: num,
                    row: rowIndex,
                    col: colIndex
                });

                const _this = this;
                itemContainer.on('pointerdown', function () {
                    _this.clickHandler(this);
                });

                itemContainer.setPosition(-270 + (gameOptions.tileSize + gameOptions.margin) * colIndex, -200 + (gameOptions.tileSize + gameOptions.margin) * rowIndex);

                tileContainer.add(itemContainer);
            });
        });

        containerList.push(tileContainer);
        container.add(tileContainer);

        if (levelIndex !== 0) {
            tileContainer.setPosition(window.game.width, 0);
        }
    }

    clickHandler (tile: Phaser.GameObjects.Container): void {
        
        if (hasTw) {
            clearTw = true;
            hasTw = false;
        }

        if (tile.getData('value') <= 0) {
            if (tile.getData('active')) {
                this.setTile(tile);
            }

            this.resetTile(activeTileList);
            curTile = null;
        } else {
            this.resetTile(activeTileList);

            hasTw = true;
            curTile = tile;
            this.getActiveTileList();
            tmEvt = this.time.addEvent({
                callback: () => {
                    this.addTween([tile, ...activeTileList]);
                },
                delay: 100
            });
        }
        
    }

    resetTile (tiles: Phaser.GameObjects.Container[]): void {
        let rect: Phaser.GameObjects.Rectangle;

        tiles.forEach((tile) => {
            tile.setData('active', false);
            rect = tile.getAt(RECT) as Phaser.GameObjects.Rectangle;
            rect.setFillStyle(gameOptions.colors[0]);
        });
    }

    setTile (tile: Phaser.GameObjects.Container): void {
        const targetNum = tile.getAt(NUMBER) as Phaser.GameObjects.Sprite;
        const curNum = curTile.getAt(NUMBER) as Phaser.GameObjects.Sprite;
        const curRect = curTile.getAt(RECT) as Phaser.GameObjects.Rectangle;
        const curValue = curTile.getData('value');

        tile.setData('value', -1);
        curTile.setData('value', 0);

        targetNum.setFrame(this.getNumberFrameIndex(curValue));
        curNum.setFrame(this.getNumberFrameIndex(0));
        curRect.setFillStyle(gameOptions.colors[0]);
    }

    getActiveTileList (): void {
        let activeRow: number;
        let activeCol: number;
        let activeTile: Phaser.GameObjects.Container;
        let rect: Phaser.GameObjects.Rectangle;

        const [value, row, col] = curTile.getData(['value', 'row', 'col']);

        activeTileList = [];

        gameOptions.directions.forEach((direction) => {
            activeRow = row + value * direction.y;
            activeCol = col + value * direction.x;
            if (activeRow >= 0 && activeRow < gameOptions.filedSize.rows && activeCol >= 0 && activeCol < gameOptions.filedSize.cols) {
                activeTile = containerList[curLevel - 1].getAt(gameOptions.filedSize.cols * activeRow + activeCol) as Phaser.GameObjects.Container;
                if (activeTile.getData('value') === 0) {
                    activeTile.setData('active', true);
                    rect = activeTile.getAt(RECT) as Phaser.GameObjects.Rectangle;
                    rect.setFillStyle(gameOptions.colors[gameOptions.colors.length - 1]);
                    activeTileList.push(containerList[curLevel - 1].getAt(gameOptions.filedSize.cols * activeRow + activeCol) as Phaser.GameObjects.Container);
                }
            }
        });
    }

    addTween (targets: Phaser.GameObjects.GameObject[]): void {
        tmEvt && tmEvt.destroy();

        this.add.tween({
            targets: targets,
            props: {
                scale: 0.9
            },
            duration: 100,
            yoyo: true,
            repeat: -1,
            onRepeat: (tw) => {
                if (clearTw) {
                    tw.stop();
                    clearTw = false;
                }
            },
            ease: Phaser.Math.Easing.Sine.InOut
        });
    }
}
