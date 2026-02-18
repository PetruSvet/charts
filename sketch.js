let chart;
let data;

let canvasWidth = 1000;
let canvasHeight = 600;

// Colours
let backgroundColour = "#d5c4c4ff";


function preload() {
	data = loadTable(
		"data/dataset.csv",
		"csv",
		"header",
	);
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    chart = new Chart(data,50,450,800,400,25);
    console.log(chart.cleanedData); 
	console.log("Max Value:", this.maxValue);
    noLoop();
}


function draw() {
	background(backgroundColour);
    chart.drawChart();
}