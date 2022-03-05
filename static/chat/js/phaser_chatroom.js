var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function BootScene () {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },
    preload: function (){
        this.load.image('tiles', '/static/chat/assets/map/global.png');
        this.load.tilemapTiledJSON('map', '/static/chat/assets/map/tilemap1.json');

        this.load.spritesheet('self_player', '/static/chat/assets/char/char1_walk.png', { frameWidth: 32, frameHeight: 32 })
    },
    create: function (){
        this.scene.start('GameScene');
    }
});

var GameScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function GameScene () {
        Phaser.Scene.call(this, { key: 'GameScene' });
    },
    preload: function (){
        
    },
    create: function (){
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('global', 'tiles');
        var floor = map.createLayer('Tile Layer 1', tiles),
            wall = map.createLayer('Tile Layer 2', tiles),
            obstacles = map.createLayer('Tile Layer 3', tiles);
    
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        this.player = this.physics.add.sprite(180, 240, 'self_player', 0);
        this.player.setCollideWorldBounds(true);

        wall.setCollisionByExclusion([-1]);
        obstacles.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, wall);
        this.physics.add.collider(this.player, obstacles);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('self_player', {start: 24, end: 31}),
            frameRate: 100,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('self_player', {start: 16, end: 23}),
            frameRate: 100,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('self_player', {start: 8, end: 15}),
            frameRate: 100,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('self_player', {start: 0, end: 7}),
            frameRate: 100,
            repeat: -1
        });

    },
    update: function(time, delta){
        this.player.body.setVelocity(0);
        if (this.cursors.left.isDown){
            this.player.body.setVelocityX(-80);
            this.player.anims.play('left', true);
        }else if (this.cursors.right.isDown){
            this.player.body.setVelocityX(80);
            this.player.anims.play('right', true);
        }else{
            this.player.anims.stop();
        }

        if (this.cursors.up.isDown){
            this.player.body.setVelocityY(-80);
            this.player.anims.play('up', true);
        }else if (this.cursors.down.isDown){
            this.player.body.setVelocityY(80);
            this.player.anims.play('down', true);
        }else{
            this.player.anims.stop();
        }

    }
});


var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.AUTO,
        width: 164,
        height: 164,
    },
    parent: 'phaser-chatroom',
    domCreateContainer: true,
    expandParent: true,
    zoom: 1,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [ 
        BootScene,
        GameScene
    ]
};
var game = new Phaser.Game(config);