let model;
let state = "collection";
let bioStr = "";
let count = 0;

function setup() {
  var myCanvas = createCanvas(400, 400);
  myCanvas.parent("container");
  background(0);
  let options = {
    inputs: ["sections"],
    outputs: ["label"],
    task: "classification",
  };
  model = ml5.neuralNetwork(options);
}

function whileTraining(epoch, loss) {
  console.log("epoch: " + epoch);
  console.log(loss.loss);
}

function finishedTraining() {
  console.log("finishedTraining");
  state = "prediction";
}

function keyPressed() {
  if (key == "t") {
    console.log("t");
    state = "training";
    console.log("starting training");
    model.normalizeData();
    let options = {
      epochs: 200,
    };
    model.train(options, whileTraining, finishedTraining);
  } else {
    bioStr += key;
    console.log(bioStr);
  }
}

function mousePressed() {
  console.log("mousePressed");
  let input = {
    sections: bioStr,
  };
  let target = {
    label: "default",
  };
  if (count == 0) {
    console.log("count=0");
    target = {
      label: "first",
    };
  } else if (count == 1) {
    console.log("count=1");
    target = {
      label: "second",
    };
  }
  if (state == "collection") {
    console.log("added data:");
    console.log(input);
    console.log(target);
    model.addData(input, target);
    count += 1;
    bioStr = "";
    console.log("count: " + count);
    console.log("string: " + bioStr);
  } else if (state == "prediction") {
    model.classify(input, gotResults);
  }
}

function gotResults(error, results) {
  if (error) {
    console.error("error");
    bioStr = "";
    return;
  } else {
    console.log(results);
    bioStr = "";
  }
}
