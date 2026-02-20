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
        this.groupBy = "Club";      // Switch between club and position
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
        let row = this.data.rows[i].obj;
        let group = row[this.groupBy];     
        let stack = row[this.stackBy];    
        let value = Number(row[this.yValues]);
        if (!grouped[group]) {
            grouped[group] = {};
        }
        if (!grouped[group][stack]) {
            grouped[group][stack] = 0;
        }
        grouped[group][stack] += value;
    }
    // Convert grouped object into chartData
    for (let group in grouped) {
        let total = 0;
        for (let stack in grouped[group]) {
            total += grouped[group][stack];
        }
        if (total > max) {
            max = total;
        }
        this.chartData.push({
            label: group,
            stacks: grouped[group]
        });
    }
    this.numBars = this.chartData.length;
    this.maxValue = ceil(max / 50) * 50;
}

    drawChart() {
        push();
        translate(this.posX, this.posY);

        this.drawAxis();
        this.drawBars();
        this.drawYAxisLabels();
        this.drawXAxisLabels();
        // this.drawLegend();

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
        let barGap = (this.chartWidth - (this.barWidth * this.numBars)) / (this.numBars + 1);  // Calculate the gap between bars 

        push();
        translate(barGap, 0);

        for (let i = 0; i < this.numBars; i++) {
            let bar = this.chartData[i];
            let x = i * (this.barWidth + barGap);

            let yOffset = 0;  
            let posObj = bar.stacks; // FOR EACH BAR

            // Draw stacked segments
            for (let pos in posObj) {     // Iterate over each position in the bar
                let value = posObj[pos];  // Get the value for the position (e.g Appearances)
                let h = this.scaler(value); // Scale the value to the chart height

                fill(this.positionColours[pos] || "#888");
                rect(x, -yOffset, this.barWidth, -h);  // Draw the next segment above the previous one

                yOffset += h;  // Increment the yOffset for the next segment
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
            text(bar.label, 0, 0);
            pop();
        }

        pop();
    }


    // drawLegend() {

    // let i = 0;
    // let x = this.chartWidth + 40;
    // let yStart = -this.chartHeight;

    // for (let pos in this.positionColours) {

    //     fill(this.positionColours[pos]);
    //     rect(x, yStart + (i * 25), 15, 15);

    //     fill(this.axisColour);
    //     textAlign(LEFT, CENTER);
    //     textSize(this.labelSize);
    //     text(pos, x + 25, yStart + (i * 25) + 8);

    //     i++;
    //     }   
    // }

}