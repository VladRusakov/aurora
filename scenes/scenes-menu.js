import tilemapPng from '../assets/tileset/Dungeon_Tileset.png'
import menuBackgroundJson from '../assets/menu_background.json'

const scenes = [
    'StartingScene', 
    'GroupAlignmentScene', 
    'SteeringWanderScene', 
    'SteeringEvadeScene', 
    'SteeringEvadeVsPursuitScene', 
    'SteeringSeekScene', 
    'SteeringFleeScene'];

let MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,
    scenesButtons: [],
    _runningScene: null, 

    initialize: function MenuScene() {
        Phaser.Scene.call(this, {key: 'MenuScene'});
    },

    preload: function () {
        //loading map tiles and json with positions
        this.load.image('tiles', tilemapPng);
        this.load.tilemapTiledJSON('menu_map', menuBackgroundJson);
    },

    create: function () {
        const map = this.make.tilemap({key: 'menu_map'});
        const tileset = map.addTilesetImage('Dungeon_Tileset', 'tiles');
        map.createStaticLayer('Main', tileset, 0, 0);

        this.add.text(32 * 7 - 4, 32 * 2 + 4, 'SCENES', {fill: '#FFF', fontSize : 28})
            .setShadow(2,2,'#000', true);

        let k = 0;
        this.scenesButtons = scenes.map(text => {
            return this.add.text(32 * 7, 32 * 3 + (k++ * 32), text, {fill: '#AAA'})
                .setInteractive()
                .setFixedSize(32 * 10, 32)
                .setPadding({ top: 8 })
                .setShadow(1,1,'#000')
                .on('pointerdown', () => this.actionOnClick(text));
        });

        this.input.keyboard.on("keydown_ESC", event => {
            if (this._runningScene !== null) {
                this.scene.pause(this._runningScene);
                this.scene.stop(this._runningScene);
                this._runningScene = null;
            }
        });
    },

    update: function () {
        if (this._runningScene == null) {
            this.scenesButtons.forEach(e => {
                const [x, y] = [this.input.x, this.input.y]
                if (e.input.hitArea.contains(x-e.x,y-e.y)) {
                    e.setFill('#FFF')
                } else {
                    e.setFill('#AAA')
                }
            });
        };
    },
    
    actionOnClick: function (sceneName) {
        if (this._runningScene == null) {
            this._runningScene = sceneName;
            this.scene.run(sceneName);

            const hint = new Hint(32, 32, 'Press ESC to return', 2000);

            try {
                this.scene.add('HintScene_' + hint.index, hint, true);
            } catch (error) { /* Cannot add a Scene with duplicate key */ }
        }
    },
});

class Hint extends Phaser.Scene {
    constructor(x = 0, y = 0, text = '', time = 2000) {
        super();
        this.pos = {x, y}
        this.text = text;
        this.ttl = time;

        this._drawingText;
        this._drawingText;
        this._index = Math.floor(Math.random() * 10000000);
    }

    get index() {
        return this._index;
    }

    preload() {
        this._startTime = this.time.now;
    }

    create() {
        const pos = this.pos;
        this._drawingText = this.add.text(
            pos.x, pos.y,
            this.text, 
            { 
                fill: '#fff',
                backgroundColor: '#333',
                padding: {
                    x : 8,
                    y : 8
                },
                alpha : 0
            }
        );

        this.tweens.add({
            targets: this._drawingText,
            alpha: {from : 0, to : 1},
            y: '+=4',
            ease: 'Linear',
            duration: 200,
            repeat: 0
        });    

        this.tweens.add({
            targets: this._drawingText,
            alpha: {from : 1, to : 0},
            ease: 'Linear',
            y: '+=4',
            delay: this.ttl - 400,
            duration: 200,
            repeat: 0
        });    
    }

    update(time) {
        if (time > this._startTime + this.ttl) {
            this.scene.remove(this);
        }
    }
}

export default MenuScene