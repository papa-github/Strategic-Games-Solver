export default function ExternalityCalculations(props: { grid: (number | null)[][] }) {

    const grid = props.grid
    const newGrid: (number | null)[][] = []
    const newHeaders: string[] = ["Number choosing B", "Payoff to A", "Payoff to B", "Total Payoff", "Internality of choosing B", "Internality of choosing A", "Externality of choosing B", "Externality of choosing A"]
    const numPlayers = grid.length - 1

    for (let i = 0; i < grid.length; i++) {
        newGrid.push([])
        for (let j = 0; j < grid[i].length; j++) {
            newGrid[i].push(grid[i][j])
        }
        // Add total payoff: Payoff to A * (Number of players - Number choosing B)  + Payoff to B * Number choosing B
        // @ts-ignore: Object is possibly 'null'.
        newGrid[i].push(grid[i][1] * (numPlayers - grid[i][0]) + grid[i][2] * grid[i][0])

        // Add internality of choosing B: Payoff of next row choosing B - Payoff of current row choosing A
        if (grid[i+1] === undefined) {
            newGrid[i].push(null)
        }else if (grid[i+1][2] !== null || grid[i][1] !== null) {
            // @ts-ignore: Object is possibly 'null'.
            newGrid[i].push(grid[i+1][2] - grid[i][1])
        }else{
            newGrid[i].push(null)
        }

        // Add internality of choosing A: Payoff of previous row choosing A - Payoff of current row choosing B
        if (grid[i-1] === undefined) {
            newGrid[i].push(null)
        }else if (grid[i-1][1] !== null || grid[i][2] !== null) {
            // @ts-ignore: Object is possibly 'null'.
            newGrid[i].push(grid[i-1][1] - grid[i][2])
        }else{
            newGrid[i].push(null)
        }
        
        // Add externality of choosing B: Total Payoff of next row - Total Payoff of current row 
        if (grid[i+1] === undefined) {
            newGrid[i].push(null)
        }else if (grid[i+1][3] !== null || grid[i][3] !== null) {

            // Get next rows's total payoff (except for the last row)
            if (i !== grid.length - 1) {
                // @ts-ignore: Object is possibly 'null'.
                let nextTotalPayoff = grid[i+1][1] * (numPlayers - grid[i+1][0]) + grid[i+1][2] * grid[i+1][0]
                // @ts-ignore: Object is possibly 'null'.
                newGrid[i].push(nextTotalPayoff - newGrid[i][3])
            }else{
                newGrid[i].push(null)
            }
        }else{
            newGrid[i].push(null)
        }

        // Add externality of choosing A: Total Payoff of previous row - Total Payoff of current row
        if (grid[i-1] === undefined) {
            newGrid[i].push(null)
        }else if (grid[i-1][3] !== null || grid[i][3] !== null) {
            // @ts-ignore: Object is possibly 'null'.
            newGrid[i].push(newGrid[i-1][3] - newGrid[i][3])
        }else{
            newGrid[i].push(null)
        }



    }

    function generateTable(grid: (number | null)[][], headers: string[]): JSX.Element {
        return (
            <table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                        <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* If both internalities are less than or equal to 0, then assign 'highlighted' class to each cell in the row */}
                    {grid.map((row, rowIndex) => {
                        //null is treated as 9=0
                        // @ts-ignore: Object is possibly 'null'.
                        const isHighlighted = row[4] <= 0 && row[5] <= 0
                        return(
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className={isHighlighted ? "highlighted" : ""}>{cell}</td>
                        ))}
                    </tr>)
                    })}
                </tbody>
            </table>
        );
        }



    return (
        <div className="externality-calculations">
            <hr/>
            <h2>Calculations</h2>
            Internality: A cost or benefit imposed on the individual making the decision.<br/>
            Externality: A cost or benefit imposed on a third party, who did not agree to incur that cost <br/>
            <br></br>
            Internality of choosing B: Payoff of next row choosing B - Payoff of current row choosing A<br/>
            Internality of choosing A: Payoff of previous row choosing A - Payoff of current row choosing B<br/>
            Externality of choosing B: Total Payoff of next row - Total Payoff of current row<br/>
            Externality of choosing A: Total Payoff of previous row - Total Payoff of current row<br/>
            <br></br>
            To calculate the Nash equilibrium, we find the rows where there is no incentive to deviate (i.e. internality of choosing A and B must be 0 or less).<br/>
            This is highlighted in the table below.<br/>
            <br></br>
            {generateTable(newGrid, newHeaders)}
        </div>
    )
}