let model;
let targetLabel = "C";
let state = "collection";

function setup() {
  var myCanvas = createCanvas(400, 400);
  myCanvas.parent("container");
  let options = {
    inputs: ["x", "y"],
    outputs: ["label"],
    task: "classification",
    debug: "true",
  };
  model = ml5.neuralNetwork(options);
  background(0);
}

function keyPressed() {
  if (key == "t") {
    state = "training";
    console.log("starting training");
    model.normalizeData();
    let options = {
      epochs: 200,
    };
    model.train(options, whileTraining, finishedTraining);
  } else {
    targetLabel = key.toUpperCase();
  }
}

function whileTraining(epoch, loss) {
  console.log("epoch: " + epoch);
  console.log(loss.loss);
}

function finishedTraining() {
  console.log("finishedTraining");
  state = "prediction";
}

function mousePressed() {
  if (firstInt === true) {
    wave.start();
    firstInt = false;
  }

  let inputs = {
    x: mouseX,
    y: mouseY,
  };

  if (state == "collection") {
    let target = {
      label: targetLabel,
    };
    model.addData(inputs, target);
    stroke(255);
    noFill();
    ellipse(mouseX, mouseY, 24);
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    text(targetLabel, mouseX, mouseY);
  } else if (state == "prediction") {
    model.classify(inputs, gotResults);
  }
}

function gotResults(error, results) {
  if (error) {
    console.error();
    return;
  } else {
    stroke(255);
    fill(10, 200, 10, 255);
    ellipse(mouseX, mouseY, 24);
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    targetLabel = results[0].label;
    text(targetLabel, mouseX, mouseY);
  }
}
