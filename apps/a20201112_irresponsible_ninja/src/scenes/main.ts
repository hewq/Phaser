export class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    preload(): void {
        console.log('preload');
    }

    create(): void {
        console.log('create');
    }
}