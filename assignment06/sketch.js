let capture;
let poseNet;
let poses = [];
let modelIsReady = false;
let coinX, coinY, coinC;
let blast;
let microphone;
let points = 0;



function setup() {
    pixelDensity(1);
    let c = createCanvas(640, 480);
    c.parent('#canvas-container');

    microphone = new p5.AudioIn();
    microphone.start();

    
    // start up our web cam
    capture = createCapture(VIDEO);
    capture.size(width, height);


    poseNet = ml5.poseNet(capture, modelReady);
    poseNet.on('pose', function(results) {
        poses = results;
    });

    capture.hide();
  
    pickRandomCoinLocation();
}

function draw() {
    background(0);

    // capture.loadPixels();
    if (modelIsReady) {
        let v = microphone.getLevel();

        image(capture, 0, 0);



        fill(coinC);
        ellipse(coinX, coinY, 50, 50);
        if ( blast ) {
          blast.act();
        }
    
        // figure out where the user's hands are
        if (poses.length > 0 && poses[0].pose.rightWrist && poses[0].pose.leftWrist) {
          let right = {x: poses[0].pose.rightWrist.x, y: poses[0].pose.rightWrist.y};
          let left = {x: poses[0].pose.leftWrist.x, y: poses[0].pose.leftWrist.y};
          
          slope = (right.y - left.y)/(right.x - left.x);
          // stroke(0, 255, 0);
          // line(left.x, left.y, right.x, right.y);

          if ( v > 0.1 && !blast ) {
            // create blast
            blast = new Blast(left, slope);
            console.log("blast!");
          }
          if ( blast ) {
            if ( blast.x > width || blast.x < 0 || blast.y > height || blast.y < 0 ) {
              delete blast;
              blast = null;
            }
          }
        }
    }
    else {
        textSize(50);
        textAlign(CENTER);
        fill(255);
        text("Model Loading", width/2, height/2);
    }


    fill(255);
    text("Points: " + points, 100, 50);

}

function modelReady() {
    console.log("ready!");
    modelIsReady = true;
}

// debug: click the mouse to see all poseNet properties
function mousePressed() {
    // iterate over all pose properties and give us a readout of where these features can be found
    if (poses.length > 0) {
      for (let property in poses[0].pose) {
        if (poses[0].pose[property].x) {
          console.log(`${property} ${poses[0].pose[property].x} ${poses[0].pose[property].y}`)
        }
      }
    }
}

function pickRandomCoinLocation() {
    coinX = random(30, width-30);
    coinY = random(30, height-30);
    coinC = color(random(255), random(255), random(255));
}


class Blast {
    constructor(source, slope) {
      this.x = source.x;
      this.y = source.y;
      this.slope = slope;
      this.color = color(random(255), random(255), random(255));
    }

    act() {
      // move
      this.x += 1;
      this.y += 1 * this.slope;
    
      // display
      fill(this.color);
      ellipse(this.x, this.y, 20, 20);

      // detect coin
      if (dist(this.x, this.y, coinX, coinY) < 35) {
        pickRandomCoinLocation();
        points += 1;
        this.x = width+1;
      }
    }
}