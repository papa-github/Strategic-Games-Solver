import Matrix from "./Matrix";

function NashEquilibrium(props: {param: Matrix}) {
    let matrix = props.param

    function findPureNash() {
        const nashEquilibria = [];
        const rowMaxValues = matrix.matrixData.map(row => Math.max(...row.map(cell => Number(cell.split(",")[1]))));
        const colMaxValues = matrix.matrixData[0].map((_, j) => Math.max(...matrix.matrixData.map(row => Number(row[j].split(",")[0]))));
        
        for (let i = 0; i < matrix.matrixData.length; i++) {
          for (let j = 0; j < matrix.matrixData[i].length; j++) {
            const currentPayoff = matrix.matrixData[i][j].split(",").map(Number);
            const rowMax = rowMaxValues[i];
            const colMax = colMaxValues[j];
            
            if (currentPayoff[1] === rowMax && currentPayoff[0] === colMax) {
              nashEquilibria.push([i, j]);
            }
          }
        }
        
        return nashEquilibria;
    }
      

    function findMixedNash(): JSX.Element{

        if (matrix.matrixData.length !== 2 || matrix.matrixData[0].length !== 2){
            return(
                <div>
                    <p>I've got no idea how to calculate the mixed strategy if it's not a 2x2 matrix. Try this:</p>
                    <a href="https://cbom.atozmath.com/CBOM/GameTheory.aspx?q=bimatrix">Input your matrix into this website</a>
                </div>
            )
        }
        //For example, let's say this matrix is [[[1, 16], [4, 6]], [[2, 20], [3, 40]]]]
        //row headers (aka Player 1 choices) = ["Up, Down"]
        //column headers (aka PLayer 2 choices) = ["Left", "Right"]
        let numberMatrix = matrix.convertToNumberMatrix()

        // Following the example above, Player 1(row) must keep Player 2(Column) indifferent and must choose its Up option with a probability of p.
        //  p must satisfy: 16p + 20(1 – p) = 6p + 40(1 – p)
        // Rearrarranged, p = (40 - 20)/(16-6+40-20) = 2/3 = 0.667
        let p = (numberMatrix[1][1][1] - numberMatrix[1][0][1]) / (numberMatrix[0][0][1] - numberMatrix[0][1][1] + numberMatrix[1][1][1] - numberMatrix[1][0][1]) //Generalised

        // Following the example above, Player 2(Column) must keep Player 1(row) indifferent and must choose its left option with a probability of q.
        // q must satisfy: q + 4 (1 – q) = 2q + 3(1 – q)
        // Rearrarranged, q = (3-4) / (1-2+3-4) = 1/2 = 0.5
        let q = (numberMatrix[1][1][0]  - numberMatrix[0][1][0]) / (numberMatrix[0][0][0] - numberMatrix[1][0][0] + numberMatrix[1][1][0] - numberMatrix[0][1][0]) //Generalised version
        

        return(
            <div>
                <p>Mixed strategy for Player 1:</p>
                <p>p({matrix.rowHeaders[0]}) = {p.toFixed(2)}</p>
                <p>p({matrix.rowHeaders[1]}) = {(1-p).toFixed(2)}</p>
                <p>Mixed strategy for Player 2:</p>
                <p>p({matrix.colHeaders[0]}) = {q.toFixed(2)}</p>
                <p>p({matrix.colHeaders[1]}) = {(1-q).toFixed(2)}</p>
            </div>
        )
    }
      
      
                
      

    function render():JSX.Element{
        const pureResult = findPureNash()
        
        if (pureResult.length !== 0){
            return(
                matrix.display(pureResult)
            )
        }
        else{
            return findMixedNash()
        }
    }
    return(
        <div className="nash">
            <h2> Now we can find any Nash Equilibria</h2>
            {
                render()
            }
        </div>
    )
}

export default NashEquilibrium