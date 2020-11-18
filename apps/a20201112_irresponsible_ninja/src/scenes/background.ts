export default class extends Phaser.Scene {
    constructor() {
        super({
            key: 'BackgroundScene',
            active: true
        });
    }

    create(): void {
        const graphics = this.add.graphics();

        graphics.fillGradientStyle(0x241a47, 0x241a47, 0x274aa0, 0x274aa0);
        graphics.fillRect(0, 0, window.game.width, window.game.height);

        this.scene.launch('FootScene');
        this.scene.launch('StartScene');
    }
}