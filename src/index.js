var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var calculator;
var key;
var door;
var coins;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var TitleScene;

    //for title screen
// import TitleScene from './scenes/TitleScene';
// let TitleScene = new TitleScene();

var game = new Phaser.Game(config);

    //for title screen
// game.scene.add('TitleScene');
// game.scene.start('TitleScene');

function preload() {
    this.load.image('background2', 'assets/background2.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('coin', 'assets/Bitcoin.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('key', 'assets/key.png');
    this.load.image('door', 'assets/door.png');
    this.load.image('calculator', 'assets/calculator.png');
}

function create() {
    //  A simple background for our game
    this.add.image(400, 300, 'background2');

    //  this gives the plarforms physics 
    platforms = this.physics.add.staticGroup();

    //  this creates the floor. The 'calculator' is along here
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 567, 'ground').setScale(2).refreshBody();
    calculator = this.physics.add.image(800, 520, 'calculator');
    calculator.setCollideWorldBounds(true);

    //  creates some ledges
    platforms.create(600, 432, 'ground');
    platforms.create(750, 220, 'ground');


    // this platfrom is where the key is
    platforms.create(200, 250, 'ground');
    key = this.physics.add.image(50, 0, 'key');
    // this restricts the key from going out of the world
    key.setCollideWorldBounds(true);

    // allow the key to bounce when it hits the ground
    key.setBounce(1);

    //this platform is where the door is
    platforms.create(800, 100, 'ground');
    door = this.physics.add.image(626, 53, 'door');
    door.setCollideWorldBounds(true);



    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');


    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 9 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some coins to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    coins = this.physics.add.group({
        key: 'coin',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    coins.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and all assets to make them solid
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(coins, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(key, platforms);
    this.physics.add.collider(door, platforms);
    this.physics.add.collider(player, door);
    this.physics.add.collider(player, key); 
    this.physics.add.collider(player, calculator);
    this.physics.add.collider(calculator, platforms); 

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, coins, collectcoin, null, this);


    this.physics.add.overlap(player, key, collectkey, null, this);

    this.physics.add.overlap(player, calculator, collectcalculator, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}


////
// Additional functions
////

