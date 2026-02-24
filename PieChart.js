class PieChart {
  constructor(data, posX, posY, chartWidth, chartHeight) {
    this.data = data;
    this.posX = posX; 
    this.posY = posY; 
    this.chartWidth = chartWidth; // Width of chart area
    this.chartHeight = chartHeight; // Height of chart area
    this.hoveredSegment = null; 
    this.cleanedData = []; 
    this.arcParameter = ""; // Column for pie segments
    this.areaParameter = ""; // Column for segment values
    this.colourMap = {};
    this.legendKeys = []; 

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
    this.axisColour = "#474747"; 
    this.labelSize = 12; 
  }

  cleanData(arcParameter, areaParameter) {
    this.arcParameter = arcParameter;
    this.areaParameter = areaParameter;
    this.cleanedData = [];
    this.colourMap = {};
    this.legendKeys = [];

    let grouped = {};

    // Group values
    for (let i = 0; i < this.data.rows.length; i++) {
      let row = this.data.rows[i].obj;
      let label = row[arcParameter];
      let value = Number(row[areaParameter]);

      if (!grouped[label]) {
        grouped[label] = 0;
      }
      grouped[label] += value;
    }

    // Convert object into array
    let labels = Object.keys(grouped).sort();

    for (let i = 0; i < labels.length; i++) {
      let label = labels[i];

      this.cleanedData.push({
        label: label,
        value: grouped[label]
      });

      this.colourMap[label] =
        this.palette[i % this.palette.length];

      this.legendKeys.push(label);
    }
  }

  // Draws the pie chart arcs and handles mouse hover detection
  drawPie() {
    let total = 0;
    for (let i = 0; i < this.cleanedData.length; i++) {
      total += this.cleanedData[i].value;
    }
    let radius = min(this.chartWidth, this.chartHeight) / 2;
    let lastAngle = 0;
    this.hoveredSegment = null;

    // Draw each segment
    for (let i = 0; i < this.cleanedData.length; i++) {
      let segment = this.cleanedData[i];
      let angle = (segment.value / total) * TWO_PI;
      fill(this.colourMap[this.cleanedData[i].label]);
      stroke(255);
      strokeWeight(1);
      arc(
        this.chartWidth / 2,
        -this.chartHeight / 2,
        radius * 2,
        radius * 2,
        lastAngle,
        lastAngle + angle,
        PIE
      );
      // Mouse hover detection
      let dx = mouseX - (this.posX + this.chartWidth / 2);  // Calculate x offset
      let dy = mouseY - (this.posY - this.chartHeight / 2); // Calculate y offset
      let distFromCenter = sqrt(dx * dx + dy * dy);  // Calculate distance from center
      let mouseAngle = atan2(dy, dx); // Calculate the angle of the mouse position
      if (mouseAngle < 0) mouseAngle += TWO_PI; // Normalize angle to be positive
      if (
        distFromCenter < radius && // Check if mouse is within the radius
        mouseAngle > lastAngle && // Check if mouse angle is within segment
        mouseAngle < lastAngle + angle // Check if mouse angle is within segment
      ) {
        this.hoveredSegment = { // Store hovered segment information
          label: segment.label, // Segment label
          value: segment.value, // Segment value
          percent: ((segment.value / total) * 100).toFixed(2), // Segment percentage
        };
      }
      lastAngle += angle; // Update lastAngle for the next segment
    }

  }

  // Draws the legend for the pie chart
  drawLegend() {
    let x = this.chartWidth + 40; 
    let yStart = -this.chartHeight;
    textAlign(LEFT, CENTER);
    textSize(this.labelSize);
    for (let i = 0; i < this.legendKeys.length; i++) {
      let key = this.legendKeys[i];
      fill(this.colorMap[this.cleanedData[i].label]);
      rect(x, yStart + i * 25, 15, 15);
      fill(this.axisColour);
      text(key, x + 25, yStart + i * 25 + 8);
    }
  }

  // Draws the chart title at the top
  drawTitle(title) {
    push();
    textAlign(CENTER, TOP);
    textSize(20);
    fill(30);
    textFont("Oswald");
    text(title, this.chartWidth / 2, -this.chartHeight - 30);
    pop();
  }

  // Draws a tooltip when hovering over a segment
  drawTooltip() {
    if (!this.hoveredSegment) return;
    let padding = 8;
    let textContent =
      this.hoveredSegment.label +
      ": " + 
      this.hoveredSegment.value +
      " (" +
      this.hoveredSegment.percent +
      "%)";
    textSize(12);
    let w = textWidth(textContent) + padding * 2;
    let h = 24;
    fill(0, 200);
    rect(mouseX + 10 - this.posX, mouseY - 25 - this.posY, w, h, 5);
    fill(255);
    noStroke();
    textAlign(LEFT, CENTER);
    text(
      textContent,
      mouseX + 10 + padding - this.posX,
      mouseY - 13 - this.posY
    );
  }

  // Draws the full chart (title, pie, legend, tooltip)
  drawChart() {
    push();
    translate(this.posX, this.posY);
    this.drawTitle("Pie Chart");
    this.drawPie();
    this.drawTooltip();
    pop();
  }
}