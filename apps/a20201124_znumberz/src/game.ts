import 'phaser';
import dialogPlugin from '@scripts/dialogPlugin';
import MainScene from '@scenes/main';
import StartScene from '@scenes/start';

declare global {
    interface Window { game: Game; }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#202020',
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
        width: 750,
        height: 1624
    },
    plugins: {
        scene: [
            { key: 'dialogPlugin', plugin: dialogPlugin, mapping: 'dialog'}
        ]
    },
    scene: [StartScene, MainScene]
};

class Game extends Phaser.Game {
    width = Number(this.config.width);
    height = Number(this.config.height);

    constructor (config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.game = new Game(config);
