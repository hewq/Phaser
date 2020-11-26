let container: Phaser.GameObjects.Container;

export default class extends Phaser.Scene {
    constructor() {
        super({
            key: 'StartScene'
        });
    }

    preload (): void {
        this.load.image('logo', require('@images/logo.png').default);
    }

    create (data: data): void {
        container = this.add.container(window.game.width / 2 + (data.x || 0), window.game.height / 2);
        container.add(this.add.image(0, -550, 'logo'));
        this.input.on('pointerdown', () => {
            this.scene.transition({
                target: 'MainScene',
                duration: 300,
                onUpdate: this.transitionOut
            });
        });

        this.events.on('transitionstart', () => {
            this.add.tween({
                targets: container,
                props: {
                    x: window.game.width / 2
                },
                duration: 300
            });
        });
    }

    transitionOut (progress: number): void {
        container.x = window.game.width / 2 + window.game.width * progress;
    }
}