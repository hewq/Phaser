import 'phaser';
import { MainScene } from '@scenes/main';

const config: Phaser.Types.Core.GameConfig = {
    width: 750,
    height: 1624,
    type: Phaser.AUTO,
    parent: 'game',
    scene: MainScene
};

class Game extends Phaser.Game {
    constructor (config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

new Game(config);