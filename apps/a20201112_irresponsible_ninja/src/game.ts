import 'phaser';
import { MainScene } from '@scenes/main';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
        width: 750,
        height: 1624
    },
    scene: MainScene
};

class Game extends Phaser.Game {
    constructor (config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

new Game(config);