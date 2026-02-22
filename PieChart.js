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
    this.axisColour = "#474747"; 
    this.labelSize = 12; 
  }

  cleanData(arcParameter, areaParameter) {
    this.arcParameter = arcParameter;
    this.areaParameter = areaParameter;
    this.cleanedData = [];
    let grouped = [];

    // Loop through each row in the table
    for (let i = 0; i < this.data.rows.length; i++) {
      let row = this.data.rows[i].obj;
      let arcKey = row[arcParameter]; // Segment label
      let rawValue = row[areaParameter]; // Segment value
      let value = Number(rawValue);

      // Find existing segment
      let index = -1;
      for (let g = 0; g < grouped.length; g++) {
        if (grouped[g].label === arcKey) {
          index = g;
          break;
        }
      }
      // Create segment if missing
      if (index === -1) {
        grouped.push({ label: arcKey, value: 0 });
        index = grouped.length - 1;
      }
      grouped[index].value += value;
    }
    this.cleanedData = grouped;

    // Assign random colours to each segment
    this.legendKeys = [];
    for (let i = 0; i < grouped.length; i++) {
      let key = grouped[i].label;
      this.colourMap[key] = this.generateColour();
      this.legendKeys.push(key);
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
      fill(this.colourMap[segment.label]);
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
      let dx = mouseX - (this.posX + this.chartWidth / 2);
      let dy = mouseY - (this.posY - this.chartHeight / 2);
      let distFromCenter = sqrt(dx * dx + dy * dy);
      let mouseAngle = atan2(dy, dx);
      if (mouseAngle < 0) mouseAngle += TWO_PI;
      if (
        distFromCenter < radius &&
        mouseAngle > lastAngle &&
        mouseAngle < lastAngle + angle
      ) {
        this.hoveredSegment = {
          label: segment.label,
          value: segment.value,
          percent: ((segment.value / total) * 100).toFixed(2),
        };
      }
      lastAngle += angle;
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
      fill(this.colourMap[key]);
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
    text(title, this.chartWidth / 2, -this.chartHeight - 40);
    pop();
  }

  // Generates a random hex colour for segments
  generateColour() {
    return (
      "#" +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")
    );
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
    this.drawLegend();
    this.drawTooltip();
    pop();
  }
}