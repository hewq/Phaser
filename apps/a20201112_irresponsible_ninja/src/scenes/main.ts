import pngBg from '@images/bg.png';

export default class extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene',
            active: true
        });
    }

    preload(): void {
        this.load.image('imgBg', pngBg);
    }

    create(): void {
        this.add.sprite(window.game.width / 2, window.game.height / 2, 'imgBg');
    }
}