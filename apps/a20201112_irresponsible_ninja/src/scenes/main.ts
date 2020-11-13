import bg from '@images/bg.png';

export class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    preload(): void {
        this.load.image('bg', bg);
    }

    create(): void {
        this.add.sprite(Number(this.game.config.width) / 2, Number(this.game.config.height) / 2, 'bg');
    }
}