class StackedBarChart {
    constructor(data, posX, posY, chartWidth, chartHeight, barWidth) {
        this.data = data;
        this.posX = posX;
        this.posY = posY;
        this.chartWidth = chartWidth;
        this.chartHeight = chartHeight;
        this.barWidth = barWidth;

        this.cleanedData = {}; 
        this.chartData = [];
        this.numBars = 0;
        this.maxValue = 0;
        this.numTicks = 7;
        this.groupBy = "Club";      // what creates the bars
        this.yValues = "Appearances";   // what gets summed

        this.axisColour = "#474747";
        this.axisThickness = 3;
        this.labelSize = 12;

        this.positionColours = {
            "Goalkeeper": "#f1c40f",
            "Defender": "#3498db",
            "Midfielder": "#2ecc71",
            "Forward": "#e74c3c"
        };
    }

    cleanData() {

    this.chartData = [];

    let grouped = {};
    let max = 0;

    for (let i = 0; i < this.data.rows.length; i++) {
        let group = this.data.rows[i].obj[this.groupBy];   // e.g. GK, DEF
        let value = Number(this.data.rows[i].obj[this.yValues]); // e.g. Appearances
        if (!grouped[group]) {
            grouped[group] = 0;
        }
        grouped[group] += value;
    }

    // Convert grouped object into array (so draw() still works)
    for (let key in grouped) {

        if (grouped[key] > max) {
            max = grouped[key];
        }

        this.chartData.push({
            club: key,
            positions: {
                [this.groupBy]: grouped[key]
            }
        });
    }

    this.numBars = this.chartData.length;

    // round max up to nearest 5
    this.maxValue = ceil(max / 5) * 5;
}

    drawChart() {
        push();
        translate(this.posX, this.posY);

        this.drawAxis();
        this.drawBars();
        this.drawYAxisLabels();
        this.drawXAxisLabels();
        this.drawLegend();

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
        let barGap = (this.chartWidth - (this.barWidth * this.numBars)) / (this.numBars + 1);

        push();
        translate(barGap, 0);

        for (let i = 0; i < this.numBars; i++) {
            let bar = this.chartData[i];
            let x = i * (this.barWidth + barGap);

            let yOffset = 0;
            let posObj = bar.positions;

            // Draw stacked segments
            for (let pos in posObj) {
                let value = posObj[pos];
                let h = this.scaler(value);

                fill(this.positionColours[pos] || "#888");
                rect(x, -yOffset, this.barWidth, -h);

                yOffset += h;
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

        let barGap = (this.chartWidth - (this.barWidth * this.numBars)) / (this.numBars + 1);

        push();
        translate(barGap, 0);

        for (let i = 0; i < this.numBars; i++) {
            let bar = this.chartData[i];
            let x = i * (this.barWidth + barGap) + this.barWidth / 2;

            // Rotate label -45 degrees 
            push();
            translate(x, 6); 
            rotate(-PI / 4);
            text(bar.club, 0, 0);
            pop();
        }

        pop();
    }


    drawLegend() {

    let i = 0;
    let x = this.chartWidth + 40;
    let yStart = -this.chartHeight;

    for (let pos in this.positionColours) {

        fill(this.positionColours[pos]);
        rect(x, yStart + (i * 25), 15, 15);

        fill(this.axisColour);
        textAlign(LEFT, CENTER);
        textSize(this.labelSize);
        text(pos, x + 25, yStart + (i * 25) + 8);

        i++;
        }   
    }

}