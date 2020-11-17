import '@scripts/rem';

import 'phaser';
import StartScene from '@scenes/start';
import MainScene from '@scenes/main';
import FootScene from '@scenes/foot';
import BackgroundScene from '@scenes/background';

declare global {
    interface Window { game: Game; }
}

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
    scene: [BackgroundScene, FootScene, MainScene, StartScene]
};

class Game extends Phaser.Game {
    width = Number(this.config.width);
    height = Number(this.config.height);

    constructor (config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.game = new Game(config);
