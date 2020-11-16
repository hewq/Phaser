import imgBtnStart from '@images/btn_start.png';

export class StartScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'StartScene',
            active: true
        });
    }

    preload(): void {
        this.load.image('imgBtnStart', imgBtnStart);
    }

    create(): void {
        const btnStart = this.add.sprite(Number(this.game.config.width) / 2, Number(this.game.config.height) / 2, 'imgBtnStart').setInteractive();
        
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