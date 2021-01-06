import { levelList, levelNotZeroNumList } from '@data/gameData';

// 最外层容器
let container: Phaser.GameObjects.Container;

// 当前被点击的 tile
let curTile: Phaser.GameObjects.Container;

// 计时器
let tmEvt: Phaser.Time.TimerEvent;

// 关卡文案
let levelTxt: Phaser.GameObjects.Text;

// 关卡锁
let lock: Phaser.GameObjects.Container;

// 切换关卡按钮
let btnPrev: Phaser.GameObjects.Sprite;
let btnNext: Phaser.GameObjects.Sprite;

// localstorage key
const storageKeyLevel = 'original_level';

// 所有关卡容器列表
let containerList: Phaser.GameObjects.Container[] = [];

// 被激活的 tile 列表
let activeTileList: Phaser.GameObjects.Container[] = [];

// 当前是否有动画在进行
let hasTw = false;

// 是否清除动画
let clearTw = false;

// 当前关卡
let curLevel = 1;
let curLevelIndex = 0;

// 已解锁关卡
let unlockLevel = 1;

// 关卡总数
const totalLevel = 10;

// 当前关卡已移动的 tile 个数
let curMoveTileNum = 0;

// tile 容器的对应的 index
const RECT = 0;
const NUMBER = 1;

const gameOptions = {
    tileSize: 100, // tile 大小
    filedSize: { // 棋盘大小
        rows: 6,
        cols: 6
    },
    margin: 10, // tile 间距
    colors: [0x333333, 0xea225e, 0xef6c00, 0x1674bc, 0x388e3c, 0xffffff], // tile 颜色值
    directions: [ // 可移动方向
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
    randomPlugin;
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

    init (): void {
        this.restart();
        this.initUnlockLevel();
        this.dialog.init();
    }

    create (): void {
        container = this.add.container(window.game.width + window.game.width / 2, window.game.height / 2);
        container.setSize(window.game.width, window.game.height);
        container.setInteractive();

        // 场景过渡动画
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

        let isPress = false;
        container.on('pointerdown', () => {
            isPress = true;
        });
        container.on('pointerup', () => {
            isPress = false;
        });
        const pressEvt = this.time.addEvent({
            callback: () => {
                if (isPress) {
                    localStorage.removeItem(storageKeyLevel);
                    console.log(`localStorage storageKeyLevel already clear`);
                    pressEvt.destroy();
                }
            },
            delay: 5000
        });

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

        btnRefresh.on('pointerdown', () => {
            this.refresh();
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

    // 设置当前关卡 index
    setCurLevelIndex (): void {
        curLevelIndex = curLevel - 1;
    }

    // 初始化已解锁数据
    initUnlockLevel (): void {
        const level = Number(localStorage.getItem(storageKeyLevel));
        if (level) {
            unlockLevel = level > totalLevel ? totalLevel : level;
            curLevel = unlockLevel;
            this.setCurLevelIndex();
        } else {
            localStorage.setItem(storageKeyLevel, String(unlockLevel));
        }
    }

    // 切换关卡
    switchLevel (direction: number): void {
        const leverSwitchTo = curLevel + direction;
        if (leverSwitchTo > 0 && leverSwitchTo <= totalLevel) {
            this.refresh();
            this.add.tween({
                targets: containerList[curLevelIndex],
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
            this.setCurLevelIndex();
            levelTxt.setText(`${curLevel}/${totalLevel}`);
        }

        this.setBtnStyle();
        this.setLock();
    }

    // 关卡上锁
    setLock (): void {
        if (curLevel > unlockLevel) {
            lock.setVisible(true);
        } else {
            lock.setVisible(false);
        }
    }

    // 设置按钮样式
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

    // 生成所有关卡棋盘
    createTotalLevel (): void {
        for (let i = 0; i < totalLevel; i++) {
            this.createTileBoard(i);
        }
    }

    // 过渡动画
    transitionOut (progress: number): void {
        container.x = window.game.width / 2 + window.game.width * progress;
    }

    // 获取数字对应的精灵图位置
    getNumberFrameIndex (num: number): number {
        return num - 1 < 0 ? 5 : num - 1;
    }

    // 生成单个关卡棋盘
    createTileBoard (levelIndex: number): void {
        // 单个小矩形
        let rect: Phaser.GameObjects.Rectangle;
        // 矩形上的数字
        let number: Phaser.GameObjects.GameObject;
        // 矩形和数字一起放到这个容器下
        let itemContainer: Phaser.GameObjects.Container;

        const tileContainer = this.add.container();

        levelList[levelIndex].forEach((row, rowIndex) => {
            row.forEach((num, colIndex) => {
                itemContainer = this.add.container().setSize(gameOptions.tileSize, gameOptions.tileSize).setInteractive();
                rect = this.add.rectangle(0, 0, gameOptions.tileSize, gameOptions.tileSize, gameOptions.colors[num]);
                number = this.add.sprite(0, 0, 'numbers', this.getNumberFrameIndex(num));

                itemContainer.add(rect);
                itemContainer.add(number);

                // 给每个小矩形打上印记
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

        if (levelIndex !== curLevelIndex) {
            tileContainer.setPosition(window.game.width, 0);
        }
    }

    // 是否过关
    isWin (): boolean {
        if (curMoveTileNum === levelNotZeroNumList[curLevelIndex]) {
            return true;
        }

        return false;
    }

    // 过关处理事件
    winHandler (): void {
        if (curLevel !== totalLevel) { // 不是最后一关
            if (curLevel === unlockLevel) {
                localStorage.setItem(storageKeyLevel, String(++unlockLevel));
            }
            
            this.switchLevel(1);
            this.dialog.show();
        }
    }

    // tile 点击事件
    clickHandler (tile: Phaser.GameObjects.Container): void {
        
        this.removeTween();

        if (tile.getData('value') <= 0) {
            if (tile.getData('active')) {
                this.setTile(tile);
                curMoveTileNum++;
                if (this.isWin()) {
                    this.winHandler();
                }
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

    // 重置被激活的 tile
    resetTile (tiles: Phaser.GameObjects.Container[]): void {
        tiles.forEach((tile) => {
            tile.setData('active', false);
            (tile.getAt(RECT) as Phaser.GameObjects.Rectangle).setFillStyle(gameOptions.colors[0]);
        });
    }

    // 处理操作成功的 tile
    setTile (tile: Phaser.GameObjects.Container): void {
        const curValue = curTile.getData('value');

        tile.setData('value', -1);
        curTile.setData('value', 0);

        (tile.getAt(NUMBER) as Phaser.GameObjects.Sprite).setFrame(this.getNumberFrameIndex(curValue));
        (curTile.getAt(NUMBER) as Phaser.GameObjects.Sprite).setFrame(this.getNumberFrameIndex(0));
        (curTile.getAt(RECT) as Phaser.GameObjects.Rectangle).setFillStyle(gameOptions.colors[0]);
    }

    // 获取被激活的 tile
    getActiveTileList (): void {
        let activeRow: number;
        let activeCol: number;
        let activeTile: Phaser.GameObjects.Container;

        const [value, row, col] = curTile.getData(['value', 'row', 'col']);

        activeTileList = [];

        gameOptions.directions.forEach((direction) => {
            activeRow = row + value * direction.y;
            activeCol = col + value * direction.x;
            if (activeRow >= 0 && activeRow < gameOptions.filedSize.rows && activeCol >= 0 && activeCol < gameOptions.filedSize.cols) {
                activeTile = containerList[curLevelIndex].getAt(gameOptions.filedSize.cols * activeRow + activeCol) as Phaser.GameObjects.Container;
                if (activeTile.getData('value') === 0) {
                    activeTile.setData('active', true);
                    (activeTile.getAt(RECT) as Phaser.GameObjects.Rectangle).setFillStyle(gameOptions.colors[gameOptions.colors.length - 1]);
                    activeTileList.push(containerList[curLevelIndex].getAt(gameOptions.filedSize.cols * activeRow + activeCol) as Phaser.GameObjects.Container);
                }
            }
        });
    }

    // 添加动画
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

    // 清除动画
    removeTween (): void {
        if (hasTw) {
            clearTw = true;
            hasTw = false;
        }
    }

    // 重启游戏
    restart (): void {
        containerList = [];
        activeTileList = [];
        hasTw = false;
        clearTw = false;
        curLevel = 1;
        curLevelIndex = 0;
        unlockLevel = 1;
        curMoveTileNum = 0;
    }

    // 刷新当前关卡
    refresh (): void {
        const curContainer = containerList[curLevelIndex].list;
        let itemContainer: Phaser.GameObjects.Container;
        levelList[curLevelIndex].forEach((row, rowIndex) => {
            row.forEach((num, colIndex) => {
                itemContainer = curContainer[rowIndex * gameOptions.filedSize.cols + colIndex] as Phaser.GameObjects.Container;

                (itemContainer.getAt(RECT) as Phaser.GameObjects.Rectangle).setFillStyle(gameOptions.colors[num]);
                (itemContainer.getAt(NUMBER) as Phaser.GameObjects.Sprite).setFrame(this.getNumberFrameIndex(num));

                // 给每个小矩形打上印记
                itemContainer.setData({
                    value: num
                });
            });
        });
        
        activeTileList = [];
        curMoveTileNum = 0;

        this.removeTween();
    }
}
