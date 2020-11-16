import 'phaser';
import { StartScene } from '@scenes/start';
import { MainScene } from '@scenes/main';
import { FootScene } from '@scenes/foot';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#106ba3',
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
        width: 750,
        height: 1624
    },
    scene: [StartScene, MainScene, FootScene]
};

class Game extends Phaser.Game {
    constructor (config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

new Game(config);