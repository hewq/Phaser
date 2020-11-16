import pngBtnStart from '@images/btn_start.png';
import pngTitle from '@images/title.png';

export default class extends Phaser.Scene {
    constructor() {
        super({
            key: 'StartScene',
            active: true
        });
    }

    preload(): void {
        this.load.image('imgBtnStart', pngBtnStart);
        this.load.image('imgTitle', pngTitle);
    }

    create(): void {
        this.add.rectangle(window.game.width / 2, window.game.height / 2, window.game.width, window.game.height, 0x000000, 0.5);

        this.add.image(window.game.width / 2, 240, 'imgTitle').setOrigin(0.5, 0);

        const btnStart = this.add.sprite(window.game.width / 2, window.game.height / 2, 'imgBtnStart').setInteractive();
        
        btnStart.on('pointerdown', () => {
            this.scene.start('MainScene');
        });

        this.add.tween({
            targets: btnStart,
            props: {
                y: (target) => {
                    return target.y + 20;
                }
            },
            yoyo: true,
            loop: -1,
            duration: 2000,
            ease: Phaser.Math.Easing.Sine.InOut
        });
    }
}