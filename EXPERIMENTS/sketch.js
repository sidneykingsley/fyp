let model;
let targetLabel = "C";
let state = "collection";

let firstInt = true;

let notes = {
  C: 261.6256,
  D: 293.6648,
  E: 329.6276,
};

let env, wave;

function setup() {
  var myCanvas = createCanvas(400, 400);
  myCanvas.parent("container");
  env = new p5.Envelope();
  env.setADSR(0.05, 0.1, 0.5, 1);
  env.setRange(1.2, 0);

  wave = new p5.Oscillator();

  wave.setType("sine");
  wave.freq(440);
  wave.amp(env);

  let options = {
    inputs: ["x", "y"],
    outputs: ["label"],
    task: "classification",
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
    wave.freq(notes[targetLabel]);
    env.play();
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
    wave.freq(notes[targetLabel]);
    env.play();
  }
}
