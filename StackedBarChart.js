class StackedBarChart {
  constructor(data, posX, posY, chartWidth, chartHeight, barWidth) {
    this.data = data;
    this.posX = posX;
    this.posY = posY;
    this.chartWidth = chartWidth;
    this.chartHeight = chartHeight;
    this.barWidth = barWidth;
    this.hoveredSegment = null;

    this.colourMap = {}; // Map to store colours for each stack
    this.legendKeys = []; // Store keys in an array
    this.cleanedData = [];

    this.maxValue = 0;
    this.numTicks = 8;
    this.barParameter = "";
    this.stackParameter = "";
    this.valueParameter = "";

    this.axisColour = "#474747";
    this.palette = [
    "#54478C",
    "#2C699A",
    "#048BA8",
    "#0DB39E",
    "#16DB93",
    "#83E377",
    "#B9E769",
    "#EFEA5A",
    "#F1C453",
    "#F29E4C"
    ];
    this.colorMap = {};
    this.axisThickness = 3;
    this.labelSize = 12;
  }

  cleanData(
    barParameter,  // What defines each bar
    stackParameter, // What defines each stack within a bar
    valueParameter  // What defines the value of each stack
  ) {
    this.barParameter = barParameter;
    this.stackParameter = stackParameter;
    this.valueParameter = valueParameter;

    this.cleanedData = [];
    let grouped = []; // array instead of object

    for (let i = 0; i < this.data.rows.length; i++) {
      let row = this.data.rows[i].obj;

      let barKey = row[barParameter];
      let stackKey = row[stackParameter];
      let rawValue = row[valueParameter];

      let value = Number(rawValue);

      // 1. Find the bar (group) by label
      let barIndex = -1; 
      for (let b = 0; b < grouped.length; b++) { 
        if (grouped[b].label === barKey) {  
          barIndex = b; 
          break;
        }
      }

      // If bar doesn't exist, create it
      if (barIndex === -1) {
        grouped.push({
          label: barKey,
          stacks: [], // array of { key, value }
        });
        barIndex = grouped.length - 1;
      }

      // 2. Find the stack inside the bar
      let stacks = grouped[barIndex].stacks;
      let stackIndex = -1;

      for (let s = 0; s < stacks.length; s++) {
        if (stacks[s].key === stackKey) {
          stackIndex = s;
          break;
        }
      }

      // If stack doesn't exist, create it
      if (stackIndex === -1) {
        stacks.push({ key: stackKey, value: 0 });
        stackIndex = stacks.length - 1;
      }

      // 3. Add the value
      stacks[stackIndex].value += value;
    }

    // Save the result
    this.cleanedData = grouped;
    this.numBars = grouped.length;

    // Compute maxValue using loops
    let max = 0;
    for (let i = 0; i < grouped.length; i++) {
      let sum = 0;
      let stacks = grouped[i].stacks;

      for (let s = 0; s < stacks.length; s++) {
        sum += stacks[s].value;
      }

      if (sum > max) {
        max = sum;
      }
    }

    let roundTo = 500;
    this.maxValue = Math.ceil(max / roundTo) * roundTo;

    // Assign colours
    this.legendKeys = []; // store keys in an array

    for (let i = 0; i < grouped.length; i++) {
      let stacks = grouped[i].stacks;

      for (let s = 0; s < stacks.length; s++) {
        let key = stacks[s].key;

        if (!this.colourMap[key]) { // If the colour is not already assigned
          this.colourMap[key] = this.generateColour();  // Generate a new colour
          this.legendKeys.push(key); // Store the key in the legend
        }
      }
    }
    this.meanValue = this.calculateMean(); // Set the mean value after cleaning data
  }

  drawChart() {
    push();
    translate(this.posX, this.posY);

    this.drawTitle("Stacked Bar Chart");
    this.drawAxis();
    this.drawBars();
    this.drawYAxisLabels();
    this.drawXAxisLabels();
    this.drawLegend();
    this.drawTooltip();
    this.drawMeanLine();

    pop();
  }

drawAxis() {
    noFill();
    stroke(this.axisColour);
    strokeWeight(this.axisThickness);

    line(0, 0, this.chartWidth, 0);
    line(0, 0, 0, -this.chartHeight);
  }

  scaler(num) {
    return map(num, 0, this.maxValue, 0, this.chartHeight);
  }


drawBars() {
  noStroke();
  this.hoveredSegment = null; // reset every frame

  let barGap =
    (this.chartWidth - this.barWidth * this.numBars) / (this.numBars + 1);

  push();
  translate(barGap, 0);

  for (let i = 0; i < this.numBars; i++) {
    let bar = this.cleanedData[i];
    let x = i * (this.barWidth + barGap);

    let yOffset = 0;
    let stacks = bar.stacks;

    for (let s = 0; s < stacks.length; s++) {
      let key = stacks[s].key;
      let value = stacks[s].value;
      let h = this.scaler(value);

      let rectX = x;
      let rectY = -yOffset;
      let rectW = this.barWidth;
      let rectH = -h;

      fill(this.colourMap[key]);
      rect(rectX, rectY, rectW, rectH);

      // Dectect mouse hover
      let globalX = this.posX + barGap + rectX;
      let globalY = this.posY + rectY;
      if (
        mouseX > globalX &&
        mouseX < globalX + rectW &&
        mouseY < globalY &&
        mouseY > globalY + rectH
      ) {
        this.hoveredSegment = {
          bar: bar.label,
          stack: key,
          value: value
        };
      }

      yOffset += h;  // Update yOffset for the next stack
    }
  }

  pop();
}
  drawYAxisLabels() {
    fill(this.axisColour);
    noStroke();
    textSize(this.labelSize);
    textAlign(RIGHT, CENTER);

    for (let i = 0; i <= this.numTicks; i++) {
      let value = (this.maxValue / this.numTicks) * i;
      let y = map(value, 0, this.maxValue, 0, -this.chartHeight);

      stroke(this.axisColour);
      line(-5, y, 0, y);

      noStroke();
      text(value.toFixed(0), -10, y);
    }
  }

  drawXAxisLabels() {
    fill(this.axisColour);
    noStroke();
    textSize(this.labelSize);
    textAlign(RIGHT, TOP);

    let barGap =
      (this.chartWidth - this.barWidth * this.numBars) / (this.numBars + 1);

    push();
    translate(barGap, 0);

    for (let i = 0; i < this.numBars; i++) {
      let bar = this.cleanedData[i];
      let x = i * (this.barWidth + barGap) + this.barWidth / 2;

      // Rotate label -45 degrees
      push();
      translate(x, 6);
      rotate(-PI / 4);
      text(bar.label, 0, 0);
      pop();
    }

    pop();
  }

  generateColour() {
    return (
      "#" + 
      Math.floor(Math.random() * 0xffffff) 
        .toString(16)  
        .padStart(6, "0") 
    );
  }
  
  drawLegend() {
    let x = this.chartWidth + 40;
    let yStart = -this.chartHeight;

    textAlign(LEFT, CENTER);
    textSize(this.labelSize);

    for (let i = 0; i < this.legendKeys.length; i++) {
      let key = this.legendKeys[i];

      fill(this.colourMap[key]);
      rect(x, yStart + i * 25, 15, 15);

      fill(this.axisColour);
      text(key, x + 25, yStart + i * 25 + 8);
    }
  }

    drawTitle(title) {
    push();
    textAlign(CENTER, TOP);
    textSize(20);
    fill(30);
    noStroke();
    textFont("Oswald");
    text(title, this.chartWidth / 2, -this.chartHeight - 30);
    pop();
  }

    drawTooltip() {
     if (!this.hoveredSegment) return;

    let padding = 8;    

    let textContent =
        this.hoveredSegment.bar +
        " | " +
        this.hoveredSegment.stack +
        ": " +
        this.hoveredSegment.value;

    textSize(12);
    let w = textWidth(textContent) + padding * 2;
    let h = 24;

    fill(0, 200);
    rect(mouseX + 10 -this.posX, mouseY - 25 -this.posY, w, h, 5);

    fill(255);
    noStroke();
    textAlign(LEFT, CENTER);
    text(textContent, mouseX + 10 + padding -this.posX, mouseY - 13 -this.posY);
    }

    calculateMean() {
    let totalSum = 0;

    for (let i = 0; i < this.cleanedData.length; i++) { //Add all stacks 
        let bar = this.cleanedData[i];
        let barTotal = 0;

        for (let s = 0; s < bar.stacks.length; s++) {
        barTotal += bar.stacks[s].value;
        }

        totalSum += barTotal;
    }

    return totalSum / this.cleanedData.length;
    }

    drawMeanLine() {
    if (!this.meanValue) return;

    let y = -this.scaler(this.meanValue);

    stroke("#c0392b");
    strokeWeight(2);
    drawingContext.setLineDash([6, 6]);

    line(0, y, this.chartWidth, y);

    noStroke();
    fill("#c0392b");
    textSize(12);
    textAlign(LEFT, CENTER);
    text("Mean: " + this.meanValue.toFixed(0), 5, y - 5);
    }

}