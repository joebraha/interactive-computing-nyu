let world;
let floorBuffer, ftexture;
let bubbles = [];
let disc, skyBox, centerBox, container;

function setup() {
    noCanvas();
    
    world = new World('VRScene');

	let sky = new Sky({
		asset: 'sky'
	});
	world.add(sky);
    
    floorBuffer = createGraphics(1024, 1024);
    ftexture = world.createDynamicTextureFromCreateGraphics( floorBuffer );
    
    floorBuffer.noStroke();
    floorBuffer.translate(512, 512);

    let floor = new Plane({
        x: 0,
        y: 0,
        z: 0,
        width: 100,
        height: 100,
        rotationX: -90,
        asset: ftexture,
        side: 'front',
		dynamicTexture: true,
		dynamicTextureWidth: 1024,
		dynamicTextureHeight: 1024
    });
    world.add(floor);

    container = new Container3D({
        x:0, 
        y:0, 
        z:0
     });

    centerBox = new Box({
        x: 0,
        y: 0.1,
        z: 10,
        width: 1,
        height: 1,
        depth: 1,
        asset: 'stonebrick',
        repeatX: 10,
        repeatY: 10,
        clickFunction: function(theDisc) {
            // update color
            theDisc.setColor( random(255), random(255), random(255) );

            world.teleportToObject( theDisc );
        }
    });

    skyBox = new Box({
        x: 0,
        y: 20,
        z: 10,
        width: 1,
        height: 1,
        depth: 1,
        asset: 'stonebrick',
        repeatX: 10,
        repeatY: 10,
        clickFunction: function(theDisc) {
            // update color
            theDisc.setColor( random(255), random(255), random(255) );

            world.teleportToObject( theDisc );
        }
    });


    container.addChild(centerBox);
    container.addChild(skyBox);
    world.add(container);
     
	disc = new OBJ({
		asset: 'disc_obj',
		mtl: 'disc_mtl',
		x: 2,
		y: 5,
		z: 5,
		rotationX:90,
		rotationY:90,
		scaleX:2,
		scaleY:2,
		scaleZ:2
	});
	world.add(disc);
}

function draw() {

    floorBuffer.background(0);

    container.spinY(.5);
    disc.spinZ(.1);

    if ( bubbles.length < 3 ) {
        generateBubble();
    }

    for ( let i = 0; i < bubbles.length; i++ ) {
        bubbles[i].act();
    }

}


class Bubble {
    constructor(x, z) {
        this.x = x;
        this.z = z;
        this.red = random(255);
        this.green = random(255);
        this.blue = random(255);
        this.opac = 0;
        this.size = random(5, 10);
        this.height = random(15, 25);
        this.state = 0;
        this.shape = random([Sphere, Box, Cone, Dodecahedron, Torus]);

        this.box = new this.shape({
            x: this.x,
            z: this.z,
            y: -this.size,
            red: this.red,
            green: this.green,
            blue: this.blue,
            opacity: .5,
            radius: this.size/2,
            radiusTop: this.size/2, // for Cone
            width: this.size,
            height: this.size,
            depth: this.size,
            radiusBottom: 0,
            parent: this,
            upFunction: function(theBox) {
                world.remove(theBox);
                for ( let i = 0; i < bubbles.length; i++ ) {
                    if ( bubbles[i].box == theBox ) {
                        bubbles.splice(i, 1);
                    }
                }
            }
        });
        world.add(this.box);
    }
    
    act() {
        // draw circle
        floorBuffer.fill(this.red, this.green, this.blue, this.opac);
        floorBuffer.ellipse(this.x*10.24, this.z*10.24, this.size*10.24, this.size*10.24);

        if ( this.state == 0 ) { // increase circle opacity
            this.opac+=.5;
            if ( this.opac >= 100 ) {
                this.state++;
            }
        }
        else if ( this.state == 1 ) { // make bubble go up
            this.box.nudge(0,.1,0);
            if ( this.box.getY() >= this.height ) {
                this.state++;
                generateBubble();
            }
        }

    }
}

function generateBubble() {
    bubbles.push(new Bubble(random(-50, 50), random(-50, 50)));
}


/* 
 * Attribution for assets
 * https://sci.esa.int/web/gaia/-/60196-gaia-s-sky-in-colour-equirectangular-projection
 * https://www.turbosquid.com/3d-models/3d-axie-infinity-shard-or-axs-blue-coin-with-cartoon-style-model-1983350
*/