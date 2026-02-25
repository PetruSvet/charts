class PieChart {
  constructor(data, posX, posY, chartWidth, chartHeight) {
    this.data = data;
    this.posX = posX;
    this.posY = posY;
    this.chartWidth = chartWidth;
    this.chartHeight = chartHeight;

    this.cleanedData = [];
    this.hoveredSegment = null; // Because drawPie runs every frame we reset it to null

    this.arcParameter = "";
    this.areaParameter = "";

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

      if (!grouped[label]) grouped[label] = 0;
      grouped[label] += value;
    }

    // Convert to array
    let groupedArray = [];
    for (let key in grouped) {
      groupedArray.push({ label: key, value: grouped[key] });
    }

    // Sort largest → smallest
    groupedArray.sort((a, b) => b.value - a.value);

    // Keep top "?"
    let topCount = 8;
    let topSegments = groupedArray.slice(0, topCount);
    let remaining = groupedArray.slice(topCount);

    // Combine remaining into "Other"
    let otherTotal = 0;
    for (let i = 0; i < remaining.length; i++) {
      otherTotal += remaining[i].value;
    }

    if (otherTotal > 0) {
      topSegments.push({ label: "Other", value: otherTotal });
    }

    this.cleanedData = topSegments;

    // 6️⃣ Assign palette colours
    for (let i = 0; i < this.cleanedData.length; i++) {
      let label = this.cleanedData[i].label;
      this.colourMap[label] =
        this.palette[i % this.palette.length];
      this.legendKeys.push(label);
    }
  }

  drawPie() {
    let total = 0;
    for (let i = 0; i < this.cleanedData.length; i++) {
      total += this.cleanedData[i].value;
    }

    let radius = min(this.chartWidth, this.chartHeight) / 2;
    let lastAngle = 0;
    this.hoveredSegment = null;

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

      // Hover detection
      let dx = mouseX - (this.posX + this.chartWidth / 2);  // X offset from center
      let dy = mouseY - (this.posY - this.chartHeight / 2); // Y offset from center
      let distFromCenter = sqrt(dx * dx + dy * dy); // Distance from center
      let mouseAngle = atan2(dy, dx); // Angle of mouse position
      if (mouseAngle < 0) mouseAngle += TWO_PI; // Normalize angle

      if (
        distFromCenter < radius && // Check if mouse is within the pie segment
        mouseAngle > lastAngle && // Check if mouse angle is within segment
        mouseAngle < lastAngle + angle
      ) {
        this.hoveredSegment = {
          label: segment.label,
          value: segment.value,
          percent: ((segment.value / total) * 100).toFixed(2) // Percentage of total
        };
      }

      lastAngle += angle;
    }
  }

  drawSegmentLabels() {
    let total = 0;
    for (let i = 0; i < this.cleanedData.length; i++) {
      total += this.cleanedData[i].value;
    }

    let radius = min(this.chartWidth, this.chartHeight) / 2;
    let lastAngle = 0;

    textAlign(CENTER, CENTER);
    textSize(12);
    fill(255);
    noStroke();

    for (let i = 0; i < this.cleanedData.length; i++) {
      let segment = this.cleanedData[i];
      let angle = (segment.value / total) * TWO_PI;
      let percent = (segment.value / total) * 100;

      // Only show if >= 2%
      if (percent < 2) {
        lastAngle += angle;
        continue;
      }

      let middleAngle = lastAngle + angle / 2;
      let labelRadius = radius * 0.6;

      let x = cos(middleAngle) * labelRadius;
      let y = sin(middleAngle) * labelRadius;

      push();
      translate(this.chartWidth / 2, -this.chartHeight / 2);
      text(segment.label, x, y);
      pop();

      lastAngle += angle;
    }
  }

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

  drawTitle(title) {
    push();
    textAlign(CENTER, TOP);
    textSize(20);
    fill(30);
    textFont("Oswald");
    text(title, this.chartWidth / 2, -this.chartHeight -60);
    pop();
  }

  drawChart() {
    push();
    translate(this.posX, this.posY);

    this.drawTitle("Nationalities Distribution");
    this.drawPie();
    this.drawSegmentLabels();
    this.drawTooltip();

    pop();
  }
}