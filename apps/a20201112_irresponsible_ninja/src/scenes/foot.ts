import pngCloud from '@images/cloud.png';

export default class extends Phaser.Scene {
    constructor() {
        super({
            key: 'FootScene',
            active: true
        });
    }

    preload(): void {
        this.load.spritesheet('ssCloud', pngCloud, { frameWidth: 256, frameHeight: 256});
    }

    create(): void {
        
        const footConfig: footConfig = {
            circleNum: 7,
            blueCircleFrame: 0,
            whileCircleFrame: 1,
            blueCloudY: window.game.height + 70,
            whileCloudY: window.game.height + 100
        };

        const blueGroup = this.add.group([], {
            key: 'ssCloud',
            frame: [footConfig.blueCircleFrame],
            frameQuantity: footConfig.circleNum,
            setXY: {
                y: footConfig.blueCloudY,
                stepX: 120,
                stepY: 0
            }
        });

        const whileGroup = this.add.group([], {
            key: 'ssCloud',
            frame: [footConfig.whileCircleFrame],
            frameQuantity: footConfig.circleNum,
            setXY: {
                y: footConfig.whileCloudY,
                stepX: 120,
                stepY: 0
            }
        });

        this.add.tween({
            targets: blueGroup.getChildren(),
            props: {
                y: (target) => {
                    return target.y + Phaser.Math.Between(-5, 0);
                },
                scale: (target) => {
                    return target.scale + Phaser.Math.FloatBetween(-0.05, 0.05);
                }
            },
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: Phaser.Math.Easing.Sine.InOut
        });

        this.add.tween({
            targets: whileGroup.getChildren(),
            props: {
                y: (target) => {
                    return target.y + Phaser.Math.Between(-5, 0);
                },
                scale: (target) => {
                    return target.scale + Phaser.Math.FloatBetween(0, 0.1);
                }
            },
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: Phaser.Math.Easing.Sine.InOut
        });
    }
}