let chart;
let data;
let canvasWidth = 600;
let canvasHeight = 600;

// Colours
let backgroundColour = "#e3e3e3";

function preload() {
	data = loadTable("data/dataset.csv", "csv", "header");
}

function setup() {
	createCanvas(canvasWidth, canvasHeight);
	chart = new StackedBarChart(data, 50, 450, 400, 400, 15);
	chart.cleanData();
	console.log(chart.cleanedData);
	console.log(chart.numBars);
	console.log(chart.maxValue);
	noLoop();
}

function draw() {
	background(backgroundColour);
    chart.drawChart();
}