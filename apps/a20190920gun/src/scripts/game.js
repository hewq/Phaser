let game;
let gameOptions = {

	pathWidth: 500,

	pathHeight: 800,

	curveRadius: 50,

	targets: 5,

	targetSpeed: {
		min: 6000,
		max: 10000
	},

	targetSize: {
		min: 100,
		max: 200
	},

	gunSpeed: 5000,

	gunThrust: 2,

	maxGunSpeedMultiplier: 15,

	gunFriction: 0.9

};

window.onload = function () {
	let gameConfig = {
		type: Phaser.AUTO, // webgl 优先，否则 canvas
		backgroundColor: 0x222222,
		scale: {
			mode: Phaser.Scale.FIT, // 缩放模式
			autoCenter: Phaser.Scale.CENTER_BOTH,
			parent: "thegame",
			width: 750,
			height: 1334
		},
		scene: playGame // 开始场景
	};
	game = new Phaser.Game(gameConfig);
	window.focus();
}

class playGame extends Phaser.Scene {
	constructor() {
		super("PlayGame");
	}

	preload() {
		this.load.image('tile', 'src/images/tile.png');
		this.load.image('gun', 'src/images/gun.png');
		this.load.image('fireline', 'src/images/fireline.png');
	}

	create() {
		let offset = new Phaser.Math.Vector2((game.config.width - gameOptions.pathWidth) / 2, (game.config.height - gameOptions.pathHeight) / 2);

		this.path = new Phaser.Curves.Path(offset.x + gameOptions.curveRadius, offset.y);
		this.path.lineTo(offset.x + gameOptions.pathWidth - gameOptions.curveRadius, offset.y);
		this.path.ellipseTo(-gameOptions.curveRadius, -gameOptions.curveRadius, 90, 180, false, 0);
                this.path.lineTo(offset.x + gameOptions.pathWidth, offset.y + gameOptions.pathHeight - gameOptions.curveRadius);
                this.path.ellipseTo(-gameOptions.curveRadius, -gameOptions.curveRadius, 180, 270, false, 0);
                this.path.lineTo(offset.x + gameOptions.curveRadius, offset.y + gameOptions.pathHeight);
                this.path.ellipseTo(-gameOptions.curveRadius, -gameOptions.curveRadius, 270, 0, false, 0);
                this.path.lineTo(offset.x, offset.y + gameOptions.curveRadius);
                this.path.ellipseTo(-gameOptions.curveRadius, -gameOptions.curveRadius, 0, 90, false, 0);

                this.graphics = this.add.graphics();
                this.graphics.lineStyle(4, 0xffff00, 1);
                this.path.draw(this.graphics);

                this.fireLine = this.add.sprite(game.config.width / 2, game.config.height / 2, 'fireline');
                this.fireLine.setOrigin(0, 0.5);
                this.fireLine.displayWidth = 700;
                this.fireLine.displayHeight = 8;
                this.fireLine.visible = false;

                this.gun = this.add.sprite(game.config.width / 2, game.config.height / 2, 'gun');

                this.targets = this.add.group();
                for (let i = 0; i < gameOptions.targets; i++) {
                	let target = this.add.follower(this.path, offset.x + gameOptions.curveRadius, offset.y, 'tile');
                	target.alpha = 0.8;
                	target.displayWidth = Phaser.Math.RND.between(gameOptions.targetSize.min, gameOptions.targetSize.max);
                	this.targets.add(target);

                	target.startFollow({
                		duration: Phaser.Math.RND.between(gameOptions.targetSpeed.min, gameOptions.targetSpeed.max),
                		repeat: -1,
                		rotateToPath: true,
                		verticalAdjust: true,
                		startAt: Phaser.Math.RND.frac()
                	});
                }

                this.gunTween = this.tweens.add({
                	targets: [this.gun],
                	angle: 360,
                	duration: gameOptions.gunSpeed,
                	repeat: -1,
                	callbackScope: this,
                	onRepeat: function () {
                		this.gunTween.timeScale = Math.max(1, this.gunTween.timeScale * gameOptions.gunFriction);
                	}
                });

                let that = this;

                this.input.on('pointerdown', function (pointer) {
                	if (!that.fireLine.visible) {
                		that.fireLine.visible = true;
                		that.fireLine.angle = that.gun.angle;

                		that.gunTween.timeScale = Math.min(gameOptions.maxGunSpeedMultiplier, that.gunTween.timeScale * gameOptions.gunThrust)
                		
                		that.time.addEvent({
                			delay: 50,
                			callbackScope: that,
                			callback:function () {
                				that.fireLine.visible = false;
                			}
                		})
                	}

                	let radians = Phaser.Math.DegToRad(that.fireLine.angle);
                	let fireStartX = game.config.width / 2;
                	let fireStartY = game.config.height / 2;
                	let fireEndX = fireStartX + game.config.height / 2 * Math.cos(radians);
                	let fireEndY = fireStartY + game.config.height / 2 * Math.sin(radians);
                	let lineOfFire = new Phaser.Geom.Line(fireStartX, fireStartY, fireEndX, fireEndY);

                	that.targets.getChildren().forEach(function(target) {
                		if (target.visible) {
                			let bounds = target.getBounds();

                			if (Phaser.Geom.Intersects.LineToRectangle(lineOfFire, bounds)) {
                				target.visible = false;
                				that.time.addEvent({
                					delay: 3000,
                					callback: function () {
                						target.visible = true;
                					}
                				})
                			}
                		}
                	}.bind(that))
                })
	}
}