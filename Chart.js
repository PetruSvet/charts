class Chart{
    constructor(_data, _posX, _posY, _chartWidth, _chartHeight) {
        this.data = _data;
        this.posX = _posX;
		this.posY = _posY;
        this.chartWidth = _chartWidth;
        this.chartHeight = _chartHeight;

        this.cleanedData = [];
        this.yValues = [];

        this.cleanData();

        // COLOURS
        this.axisColour = "#474747";
        this.axisThickness = 3;
    }

    drawChart(){
        push()
        translate(this.posX,this.posY);
        this.drawAxis()
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
    }


}