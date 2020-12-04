declare module "*.png";

declare type data = {
    x: number;
};

declare interface Object {
    dialog: Phaser.Plugins.ScenePlugin;
    show();
}

declare type dimensions = {
    x: number;
    y: number;
    rectWidth: number;
    rectHeight: number;
}
