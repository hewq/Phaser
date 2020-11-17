import pngTips from '@images/tips.png';

export default class extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    preload(): void {
        this.load.image('imgTips', pngTips);
    }

    create(): void {
        this.add.image(window.game.width / 2, 100, 'imgTips');
    }
}