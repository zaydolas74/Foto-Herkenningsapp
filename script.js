let mobileNet;
let video;
let label = "";
let prob = "";
let lastPredictionTime = 0;
const predictionInterval = 2000; // Update every 2 seconds

function modelReady() {
  console.log("Model is ready!");
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    console.log(results);

    // Haal de label op van het eerste resultaat
    const originalLabel = results[0].label;

    // Splits de label op basis van komma's
    const labelParts = originalLabel.split(",");

    // Houd alleen de eerste drie delen vast
    const limitedLabelParts = labelParts.slice(0, 3);

    // Combineer de delen weer tot een enkele string
    label = limitedLabelParts.join(", ");

    // Neem de confidence van het eerste resultaat (optioneel)
    prob = Math.round(results[0].confidence * 100) + "%";
  }
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  background(0);

  mobileNet = ml5.imageClassifier("MobileNet", video, modelReady);
}

function draw() {
  if (millis() - lastPredictionTime > predictionInterval) {
    mobileNet.predict(video, gotResults);
    lastPredictionTime = millis();
  }

  image(video, 0, 0, width, height);

  // Resultaten weergeven met animatie
  if (label !== "" && prob !== "") {
    // Tekstkleur
    fill(255);
    // Tekst achtergrondkleur met transparantie
    let bgColor = color(0, 100); // Semi-transparante witte achtergrond
    // Tekst achtergrond
    rectMode(CENTER);
    fill(bgColor);
    rect(width / 2, height - 45, 500, 60, 10); // Positie en grootte van de achtergrond

    // Lettertype
    textFont("Pixelify Sans");
    // Grootte van de tekst
    textSize(20);
    // Tekst uitlijnen
    textAlign(CENTER, CENTER);
    // Tekstkleur
    fill("white ");
    // Tekst
    text(label, width / 2, height - 55); // Label
    textSize(18);
    // Tekst
    text("Confidence: " + prob, width / 2, height - 30); // Vertrouwen
  } else {
    // Weergeven van een wachttekst tijdens het voorspellingsproces
    // Tekstkleur
    fill(255);
    // Lettertype
    textFont("Pixelify Sans");
    // Grootte van de tekst
    textSize(24);
    // Tekst uitlijnen
    textAlign(CENTER, CENTER);
    // Tekst
    text("Analyzing...", width / 2, height - 20); // Analyseren
  }
}
