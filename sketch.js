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
    histogram = new HistogramChart(data, 100, 500, 600, 400, 8);
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    setupBarChart();
    setupPieChart();
    setupHistogram();
}

function draw() {
  background(backgroundColour);
  if (chartMode === "bar") {
    barchart.drawChart();
  } else if (chartMode === "pie") {
    piechart.drawChart();
  } else if (chartMode === "histogram") {
    histogram.drawChart();
  }
}


function setupPieChart() {
  piechart.cleanData("Nationality", "Appearances");
  console.log(piechart.cleanedData);
}

function setupHistogram() {
  histogram.cleanData("Age");
  console.log(histogram.cleanedData);
}

function setupBarChart()
{
    barchart.cleanData("Club", "Position", "Appearances");
    console.log(data);
    console.log(barchart.cleanedData);
    console.log(barchart.numBars);
    console.log(barchart.maxValue);
    console.log(barchart.calculateMedian());
    console.log(barchart.calculateMean());
}

function keyPressed() {
  if (chartMode === "bar") {
    chartMode = "pie";
  } else if (chartMode === "pie") {
    chartMode = "histogram";
  } else if (chartMode === "histogram") {
    chartMode = "bar";
  }
}

