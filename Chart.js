class Chart{
    constructor(_data, _posX, _posY, _chartWidth, _chartHeight, _barWidth){ 
        this.data = _data;
        this.posX = _posX;
		this.posY = _posY;
        this.chartWidth = _chartWidth;
        this.chartHeight = _chartHeight;
        this.barWidth = _barWidth;
        this.numBars;
        this.maxValue;
        this.yValues = "Goals";
        this.cleanedData = [];
        this.cleanData();

        // COLOURS
        this.axisColour = "#474747";
        this.axisThickness = 3;
        this.barColour = "#416096";
    }

    drawChart(){
        push()
        translate(this.posX,this.posY);
        this.drawAxis();
        this.drawBars();
        pop()
    }

   drawAxis() {
        noFill();
        stroke(this.axisColour);
        strokeWeight(this.axisThickness);
        line(0,0,this.chartWidth,0);
        line(0,0,0,-this.chartHeight);
    } 

    cleanData() {
        let columns = this.data.columns; // Get all column names from the csv file
        let max = 0; // Initialize max value tracker
        for (let i = 0; i < this.data.rows.length; i++) { // Grab all the column names so the function knows which fields to process for each row
            let row = this.data.rows[i].obj; // Loop through every row of the data
            columns.forEach(col => { // For each column in that row, get the value, for example: col = "Goals" value might be "0"
                let value = row[col];
                if (typeof value === "string") { // Remove extra spaces if the value is a string
                    value = value.trim();
                }
                if (!isNaN(value) && value !== "") { // Check if the string represents a number, including decimals
                    value = +value; // Converts a numeric string to a number
                }
                row[col] = value;  // Replace the original value in the row with the cleaned/converted value
            });

            this.cleanedData.push(row);
        }
        this.numBars = this.cleanedData.length;

        // Find max value specifically for the Goals column
        for (let i = 0; i < this.cleanedData.length; i++) {
            let goalValue = this.cleanedData[i][this.yValues];
            if (typeof goalValue === "number" && goalValue > max) {
                max = goalValue;
            }
        }

        // round max up to the nearest 5 so if max is 32 then rounds to 35
        this.maxValue = ceil(max / 5) * 5;
    }


    drawBars() {
        noStroke();
        fill(this.barColour);
        let barGap = (this.chartWidth - (this.barWidth * (this.numBars))) / (this.numBars + 1);

        push()
        translate(barGap,0)
        for (let i = 0; i < this.numBars; i++) {
            let jump = (barGap * i) + (this.barWidth * i);
            rect(jump, 0, this.barWidth, -this.scaler(this.cleanedData[i][this.yValues]));
            push();
            fill(this.axisColour);
            noStroke();
            textSize(10);
            textAlign(RIGHT, CENTER);
            pop();
    }
    
     pop();
 
    }

    scaler(num) {
        let scaledNumber = map(num,0,this.maxValue,0,this.chartHeight);
        return scaledNumber
    }

}