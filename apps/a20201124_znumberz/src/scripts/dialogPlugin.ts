export default class extends Phaser.Plugins.ScenePlugin {
    scene: Phaser.Scene;
    container: Phaser.GameObjects.Container;
    bg: Phaser.GameObjects.Rectangle;

    constructor (scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager);
        this.scene = scene;
    }

    boot (): void {
        const eventEmitter = this.systems.events;
        eventEmitter.on('destroy', this.sceneDestroy, this);
    }

    init (): void {
        this.bg = this.scene.add.rectangle(window.game.width / 2, window.game.height / 2, window.game.width, window.game.height, 0x000000, 0.8).setDepth(10).setInteractive();
        const rect = this.scene.add.rectangle(0, 0, 500, 250, 0x000000, 0.6);

        this.container = this.scene.add.container(window.game.width / 2, window.game.height / 2);

        rect.setStrokeStyle(2, 0xea225e, 1);
        this.container.add(rect);

        const text = this.scene.add.text(0, 0, 'you win🤩', {
            font: 'bold 50px Arial',
            fill: '#ea225e'
        }).setOrigin(0.5);

        this.container.add(text);

        this.container.setDepth(10);
        this.container.setScale(0);
        this.bg.setVisible(false);

        this.bg.on('pointerdown', () => {
            this.bg.setVisible(false);
            this.container.setScale(0);
        });
    }

    sceneDestroy(): void {
        this.scene.dialog.destroy();
    }

    show (): void {
        this.bg.setVisible(true);
        this.scene.add.tween({
            targets: this.container,
            props: {
                scale: 1
            },
            duration: 500,
            ease: Phaser.Math.Easing.Sine.In
        });
    }
}
