import 'phaser';

import IMG_PRELOADER from '../assets/preloader.gif';
import IMG_APPLE from '../assets/apple.png';
import IMG_APPLE_1 from '../assets/apple-1.png';
import IMG_APPLE_2 from '../assets/apple-2.png';
import IMG_BACKGROUND from '../assets/background.jpg';
import IMG_BANANA from '../assets/banana.png';
import IMG_BANANA_1 from '../assets/banana-1.png';
import IMG_BANANA_2 from '../assets/banana-2.png';
import IMG_BASAHA from '../assets/basaha.png';
import IMG_BASAHA_1 from '../assets/basaha-1.png';
import IMG_BASAHA_2 from '../assets/basaha-2.png';
import IMG_BEST from '../assets/best.png';
import IMG_BOMB from '../assets/bomb.png';
import IMG_DOJO from '../assets/dojo.png';
import IMG_GAME_OVER from '../assets/game-over.png';
import IMG_HOME_DESC from '../assets/home-desc.png';
import IMG_HOME_MASK from '../assets/home-mask.png';
import IMG_LOGO from '../assets/logo.png';
import IMG_LOSE from '../assets/lose.png';
import IMG_NEW_GAME from '../assets/new-game.png';
import IMG_NINJA from '../assets/ninja.png';
import IMG_PEACH from '../assets/peach.png';
import IMG_PEACH_1 from '../assets/peach-1.png';
import IMG_PEACH_2 from '../assets/peach-2.png';
import IMG_QUIT from '../assets/quit.png';
import IMG_SANDIA from '../assets/sandia.png';
import IMG_SANDIA_1 from '../assets/sandia-1.png';
import IMG_SANDIA_2 from '../assets/sandia-2.png';
import IMG_SCORE from '../assets/score.png';
import IMG_SHADOW from '../assets/shadow.png';
import IMG_SMOKE from '../assets/smoke.png';
import IMG_X from '../assets/x.png';
import IMG_XF from '../assets/xf.png';
import IMG_XX from '../assets/xx.png';
import IMG_XXF from '../assets/xxf.png';
import IMG_XXX from '../assets/xxx.png';
import IMG_XXXF from '../assets/xxxf.png';
import FONT_BITMAP_PNG from '../assets/bitmapFont.png';
import FONT_BITMAP_XML from '../assets/bitmapFont.xml';

var bootSceneConfig = {
    key: 'boot',
    active: true,
    preload: bootLoader,
    create: bootCreate
};

var loaderSceneConfig = {
    key: 'loader',
    active: false,
    preload: loading,
    create: loaderCreate
};

var mainSceneConfig = {
    key: 'main',
    active: false,
    create: create
};

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1624,
    height: 750,
    scene: [bootSceneConfig, loaderSceneConfig, mainSceneConfig]
};

var game = new Phaser.Game(config);

function bootLoader() {
    this.load.image('loader', IMG_PRELOADER);
}

function bootCreate() {
    this.scene.start('loader');
}

function loading() {
    var preloadSprite = this.add.sprite(game.config.width / 2, game.config.height / 2, 'loader');
    console.log(this.load)
    this.load.setPreloadSprite(preloadSprite);
    this.load.image('apple', IMG_APPLE);
    this.load.image('apple-1', IMG_APPLE_1);
    this.load.image('apple-2', IMG_APPLE_2);
    this.load.image('background', IMG_BACKGROUND);
    this.load.image('banana', IMG_BANANA);
    this.load.image('banana-1', IMG_BANANA_1);
    this.load.image('banana-2', IMG_BANANA_2);
    this.load.image('basaha', IMG_BASAHA);
    this.load.image('basaha-1', IMG_BASAHA_1);
    this.load.image('basaha-2', IMG_BASAHA_2);
    this.load.image('best', IMG_BEST);
    this.load.image('bomb', IMG_BOMB);
    this.load.image('dojo', IMG_DOJO);
    this.load.image('game-over', IMG_GAME_OVER);
    this.load.image('home-desc', IMG_HOME_DESC);
    this.load.image('home-mask', IMG_HOME_MASK);
    this.load.image('logo', IMG_LOGO);
    this.load.image('lose', IMG_LOSE);
    this.load.image('new-game', IMG_NEW_GAME);
    this.load.image('ninja', IMG_NINJA);
    this.load.image('peach', IMG_PEACH);
    this.load.image('peach-1', IMG_PEACH_1);
    this.load.image('peach-2', IMG_PEACH_2);
    this.load.image('quit', IMG_QUIT);
    this.load.image('sandia', IMG_SANDIA);
    this.load.image('sandia-1', IMG_SANDIA_1);
    this.load.image('sandia-2', IMG_SANDIA_2);
    this.load.image('score', IMG_SCORE);
    this.load.image('shadow', IMG_SHADOW);
    this.load.image('smoke', IMG_SMOKE);
    this.load.image('x', IMG_X);
    this.load.image('xf', IMG_XF);
    this.load.image('xx', IMG_XX);
    this.load.image('xxf', IMG_XXF);
    this.load.image('xxx', IMG_XXX);
    this.load.image('xxxf', IMG_XXXF);
    this.load.bitmapFont('number', FONT_BITMAP_PNG, FONT_BITMAP_XML);
}

function loaderCreate() {
    // this.scene.start('main');
}

function create() {

}