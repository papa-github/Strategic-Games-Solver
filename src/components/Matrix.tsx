class Matrix {
    private _matrixData: string[][];
    private _rowHeaders: string[];
    private _colHeaders: string[];
    private _player1Name: string;
    private _player2Name: string;
  
    constructor(
      matrixData: string[][] = [
        ["1,2", "3,4"],
        ["5,6", "7,8"],
      ],
      rowHeaders: string[] = ["A", "B"],
      colHeaders: string[] = ["C", "D"],
      player1name: string = "Player 1",
      player2name: string = "Player 2"
    ) {
        this._matrixData = matrixData;
        this._rowHeaders = rowHeaders;
        this._colHeaders = colHeaders;
        this._player1Name = player1name;
        this._player2Name = player2name;
        let errormsg = this.validateMatrixData()
        if (!( errormsg === "SUCCESS")){
            throw new Error("Invalid Matrix: " + errormsg);
        }
    }
        
  
    // Getter for matrixData
    get matrixData(): string[][] {
      return this._matrixData;
    }
  
    // Setter for matrixData
    set matrixData(matrixData: string[][]) {
      const oldMatrixData = this._matrixData.map((inner) => inner.slice());
      this._matrixData = matrixData.map((inner) => inner.slice());
      if (this.validateMatrixData() !== "SUCCESS") {
        this._matrixData = oldMatrixData;
        alert("Set matrixData has failed");
      }
    }
  
    // Getter for rowHeaders
    get rowHeaders(): string[] {
      return this._rowHeaders;
    }
  
    // Setter for rowHeaders
    set rowHeaders(rowHeaders: string[]) {
      const oldRowHeaders = [...this._rowHeaders];
      this._rowHeaders = [...rowHeaders];
      if (this.validateMatrixData() !== "SUCCESS") {
        this._rowHeaders = oldRowHeaders;
        alert("Headers are misaligned with rows");
      }
    }
  
    // Getter for colHeaders
    get colHeaders(): string[] {
      return this._colHeaders;
    }
  
    // Setter for colHeaders
    set colHeaders(colHeaders: string[]) {
      const oldColHeaders = [...this._colHeaders];
      this._colHeaders = [...colHeaders];
      if (this.validateMatrixData() !== "SUCCESS") {
        this._colHeaders = oldColHeaders;
        alert("Headers are misaligned with columns");
      }
    }
  
    // Getter for player1Name
    get player1Name(): string {
      return this._player1Name;
    }
  
    // Setter for player1Name
    set player1Name(player1Name: string) {
      this._player1Name = player1Name;
    }
  
    // Getter for player2Name
    get player2Name(): string {
      return this._player2Name;
    }
  
    // Setter for player2Name
    set player2Name(player2Name: string) {
      this._player2Name = player2Name;
    }

    validateMatrixData(){
        //Check cells are correctly formatted
        for (let i = 0; i < this.matrixData.length; i++) {
            for (let j = 0; j < this.matrixData[0].length; j++) {
              const cellValue = this.matrixData[i][j].trim();
              if (!/^-?\d+\s*,\s*-?\d+$/.test(cellValue)) {
                return "Input format is incorrect. Please enter numbers separated by commas.";
              }
              this.matrixData[i][j] = cellValue.replace(/\s/g, '');
            }
        }

        //Check headers are unique
        this._rowHeaders = (this._rowHeaders.map(x => x.trim()))
        this._colHeaders = (this._colHeaders.map(x => x.trim()))

        if (new Set(this._rowHeaders).size !== this._rowHeaders.length){
            return('You have duplicate choices in your rows')
        }
        if (new Set(this._colHeaders).size !== this._colHeaders.length){
            return('You have duplicate choices in your columns')
        }
        
        //Check that all the lengths match

        if (this._matrixData[0].length !== this._colHeaders.length || this._matrixData.length !== this._rowHeaders.length){
            return("Matrix and headers are misaligned")
        }

        return "SUCCESS"
    }

    clone(){
        return new Matrix(this._matrixData.map((inner) => inner.slice()),[...this._rowHeaders],[...this._colHeaders],this.player1Name, this.player2Name)
    }

    getPlayer1Payoffs():number[][]{
        const result = [];
        for (let i = 0; i < this.matrixData.length; i++) {
            const row = [];
            for (let j = 0; j < this.matrixData[i].length; j++) {
            const cell = this.matrixData[i][j].split(",").map(Number);
            row.push(cell[0]);
            }
            result.push(row);
        }
        return result;
    }

    getPlayer2Payoffs():number[][]{
        const transposed = this.matrixData[0].map((_, colIndex) => this.matrixData.map(row => row[colIndex].split(',')[1]));
        return transposed.map(row => row.map(val => Number(val)));
    }

    removeRow(rowHeader: string){
      let index = this.rowHeaders.indexOf(rowHeader)
      if (index === -1 ){
        throw new Error(`Remove Row - Index could not be found\nRequested header: ${rowHeader}\nCurrent headers: ${this.rowHeaders}`);
      }
      this.matrixData.splice(index, 1);
      this.rowHeaders.splice(index, 1);
      this.validateMatrixData()
    }
    removeCol(colHeader: string){
      let index = this.colHeaders.indexOf(colHeader)
      for (let i = 0; i < this.matrixData.length; i++) {
          this.matrixData[i].splice(index, 1);
      }
      this.colHeaders = this.colHeaders.filter((_, i) => i !== index);
    }

    size(): number {
      let count = 0;
      for (let row of this.matrixData) {
        count += row.length;
      }
      return count;
    }

    convertToNumberMatrix(): number[][][] {
      const numRows = this.matrixData.length;
      const numCols = this.matrixData[0].length;
      const numberMatrix: number[][][] = [];
    
      for (let i = 0; i < numRows; i++) {
        numberMatrix.push([]);
        for (let j = 0; j < numCols; j++) {
          const cellData = this.matrixData[i][j];
          const cellValues = cellData.split(",").map((val) => parseFloat(val));
          numberMatrix[i][j] = cellValues
        }
      }
    
      return numberMatrix;
    }
    

    display(highlightCells: number[][] = []): JSX.Element {
      return (
        <div>
          <div className="matrix-container">
            <div className="player1">{this.player1Name}</div>
            <div className="player2">{this.player2Name}</div>
            <div className="matrixTable">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    {this.colHeaders.map((colHeader, index) => (
                      <th key={index}>
                        {colHeader}
                      </th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.matrixData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <th>
                        {this.rowHeaders[rowIndex]}
                      </th>
                      {row.map((cellData, colIndex) => {
                        const isHighlighted = highlightCells.some((cell) => cell[0] === rowIndex && cell[1] === colIndex);
                        return (
                          <td key={colIndex} className={isHighlighted ? "highlighted" : ""}>
                            {cellData}
                          </td>
                        );
                      })}
                      <td></td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    {this.colHeaders.map((_, index) => (
                      <td key={index}></td>
                    ))}
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
}

export default Matrix