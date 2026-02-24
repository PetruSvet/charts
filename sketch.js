let barchart;
let piechart;
let data;
let canvasWidth = 750;
let canvasHeight = 750;
let chartMode = "bar";

// Colours
let backgroundColour = "#e3e3e3";

function preload() {
    data = loadTable("data/dataset.csv", "csv", "header");
    barchart = new StackedBarChart(data, 50, 450, 400, 400, 15);
    piechart = new PieChart(data, 50,550,450,450,15);
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    setupBarChart();
  setupPieChart();
}

function draw() {
  background(backgroundColour);
  if (chartMode === "bar") {
    barchart.drawChart();
  } else {
    piechart.drawChart();
  }
}

function setupPieChart()
{
  piechart.cleanData("Nationality","Goals");
  console.log(piechart.cleanedData);
}

function setupBarChart()
{
    barchart.cleanData("Club", "Position", "Appearances");
    console.log(barchart.cleanedData);
    console.log(barchart.numBars);
    console.log(barchart.maxValue);
}

function keyPressed() {
  if (chartMode === "bar") {
    chartMode = "pie";
  } else {
    chartMode = "bar";
  }
}

