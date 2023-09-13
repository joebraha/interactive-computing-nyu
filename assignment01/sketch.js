function setup() {
    // set the background size of our canvas
    createCanvas(400, 400);
  
    // erase the background with a "grey" color
    background(0);
  

    noStroke();
    for (var i = 0; i < random(100, 1000); i++) {
        fill(random(255), random(255), random(255), random(255));
        rect(random(400), random(400), random(100), random(100));
      }


    // create a random string of "Hello, World."
    str = "helloworld";
    arr = str.split("");
    shuffle(arr, true);
    arr.splice(5, 0, ", ");
    arr[0] = arr[0].toUpperCase();
    arr[6] = arr[6].toUpperCase();
    arr.push(".");
    str = arr.join("");

    // set all content drawn from this point forward
    // so that it uses "white" (0 = black, 255 = white)
    fill(255);
    textSize(20);
    // write some text at position 100,100
    text(str,170,207);
  
    // draw a rectangle at position 100,200
    // size = 50x50
    rect(100,190,50,50);
  
    // draw an ellipse at 200,200
    // radius = 25
    ellipse(200,233, 25, 25);
  }


  