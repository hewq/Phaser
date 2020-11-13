import cloud from '@images/cloud.png';

export class FootScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'FootScene',
            active: true
        });
    }

    preload(): void {
        this.load.image('cloud', cloud);
    }

    create(): void {
        this.add.sprite(0, Number(this.game.config.height), 'cloud');
    }
}