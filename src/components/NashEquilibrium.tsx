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
        var nerdamer = require('nerdamer');
        require('nerdamer/Solve');
        const player1Payoffs:number[][] = matrix.getPlayer1Payoffs()
        const player2Payoffs:number[][] = matrix.getPlayer2Payoffs()
        const player1Strategies:string[] = matrix.rowHeaders
        const player2Strategies:string[] = matrix.colHeaders

        const pProbs: string[] = generateStrings("p", player1Strategies.length);
        const qProbs: string[] = generateStrings("q", player2Strategies.length);
        
        //Calculate Expected Payoffs Formulas for Player 1
        const p1ExpectedPayoff: Map<string, string> = new Map<string, string>(
            player1Strategies.map((strategy, i) => {
            let string = player1Payoffs[i]
                .map((payoff, j) => `(${payoff})*(${qProbs[j]})`)
                .join("+");
            return [`EU(${strategy})`, string];
            })
        );
  
        //Calculate Expected Payoffs Formulas for Player 2
        const p2ExpectedPayoff: Map<string, string> = new Map<string, string>(
            player2Strategies.map((strategy, i) => {
            let string = player2Payoffs[i]
                .map((payoff, j) => `(${payoff})*(${pProbs[j]})`)
                .join("+");
            return [`EU(${strategy})`, string];
            })
        );
        nerdamer.set('SOLUTIONS_AS_OBJECT', true)
        const solveP1: Object  = nerdamer.solveEquations(joinEquations(Array.from(p2ExpectedPayoff.values())))
        const solveQ1: Object  = nerdamer.solveEquations(joinEquations(Array.from(p1ExpectedPayoff.values())))
        
        // Probability of the last choice is an expression of the other probabilities (e.g. 1 - p1 - p2 - p3 ...)
        // must be set separately
        solveP1[(pProbs[pProbs.length - 1]) as keyof typeof solveP1] = nerdamer(pProbs[pProbs.length - 1]).evaluate(solveP1)
        solveQ1[(qProbs[pProbs.length - 1]) as keyof typeof solveQ1] = nerdamer(qProbs[pProbs.length - 1]).evaluate(solveQ1)
        
        //Using solveP1 and solveQ1 to calculate the payoffs messes up the solveP1 and solveQ1 objects, so render solution before.
        delete solveP1["e" as keyof typeof solveP1]; delete solveP1["pi" as keyof typeof solveP1]
        delete solveQ1["e" as keyof typeof solveQ1]; delete solveQ1["pi" as keyof typeof solveQ1]
        const solution1 = renderSolution(solveP1, pProbs[pProbs.length -1])
        const solution2 = renderSolution(solveQ1, qProbs[pProbs.length -1])
        

        
        let payoff1: string = p1ExpectedPayoff.get(`EU(${player1Strategies[0]})`) as string;
        let eq = (nerdamer(payoff1).evaluate(solveQ1)).text('fractions');
        let payoff2: string = p2ExpectedPayoff.get(`EU(${player2Strategies[0]})`) as string;
        let eq2 = (nerdamer(payoff2).evaluate(solveP1)).text('fractions');

        console.log(solveP1)

        const p1PayoffKeys =   Array.from(p1ExpectedPayoff.keys())
        const p1PayoffValues = Array.from(p1ExpectedPayoff.values())
        const p2PayoffKeys =  Array.from(p2ExpectedPayoff.keys())
        const p2PayoffValues = Array.from(p2ExpectedPayoff.values())

        return(
            <div className="mixed-nash">
                <p>Each player must choose a mix of pure strategies so as to make every other player indifferent between any mix of the pure strategies that appear in their own mixed strategy.</p>
                <p>For a player to be mixing their strategies in Nash Equilibrium, then each strategy must yield the same expected payoff.</p>
                <p>Assume that {matrix.player1Name} plays {player1Strategies.join(" , ").toString()} with probabilties {pProbs.join(" , ")}</p>
                <p>Assume that {matrix.player2Name} plays {player2Strategies.join(" , ").toString()} with probabilties {qProbs.join(" , ")}</p>
                <hr />
                <p>{matrix.player1Name}'s Expected Payoff:</p>
                <div className="expected-payoff-formulas">{
                        p1PayoffKeys.map((key, index) => (
                        <div key={index}>
                            <p>{key} = {p1ExpectedPayoff.get(key)}</p>
                        </div>
                        ))
                    }
                </div>
                <p> Once again, in a mixed strategy nash equilibrium, each strategy must have the same expected payoff: </p>
                <p> 
                    {
                        //Create a map function that joins every key in the p1ExpectedPayoff map with an equals sign
                        (p1PayoffKeys.join(" = ")).toString()
                    }
                    
                </p>
                <p>
                    {
                        (p1PayoffValues.join(" = ")).toString()
                    }
                </p>
                {solution2}
                <hr />
                <p>{matrix.player2Name}'s Expected Payoff:</p>
                <div className="expected-payoff-formulas">{
                        p2PayoffKeys.map((key, index) => (
                        <div key={index}>
                            <p>{key} = {p2ExpectedPayoff.get(key)}</p>
                        </div>
                        ))
                    }
                </div>
                <p> Once again, in a mixed strategy nash equilibrium, each strategy must have the same expected payoff: </p>
                <p> 
                    {
                        //Create a map function that joins every key in the p1ExpectedPayoff map with an equals sign
                        (p2PayoffKeys.join(" = ")).toString()
                    }
                </p>
                <p>
                    {
                        (p2PayoffValues.join(" = ")).toString()
                    }
                </p>
                {solution1}
                <hr />
                <p>Following this mixed strategy: </p>
                <p>{matrix.player1Name}'s' payoff is: </p>
                <p> {
                        strReplace(solveQ1, p1PayoffValues[0])
                    } = {eq}
                </p>
                <p>{matrix.player2Name}'s' payoff is: </p>
                <p> {
                        strReplace(solveP1, p2PayoffValues[0])
                    } = {eq2}
                </p>
            </div>
        )
    }

    function joinEquations(arr: string[]): string[] {
        const result: string[] = [];
        for (let i = 0; i < arr.length - 1; i++) {
            result.push(`${arr[i]} = ${arr[i+1]}`);
        }
        return result;
    }

    function generateStrings(letter: string, num: number): string[] {
        const result: string[] = [];
        for (let i = 1; i < num; i++) {
          result.push(`${letter}${i}`);
        }
        const sum = result.join('-');
        result.push(`1-${sum}`);
        return result;
    }

    function strReplace(obj: { [key: string]: any }, str: string): string {
        for (const key in obj) {
          const regExp = new RegExp(key, "g");
          str = str.replace(regExp, obj[key].toString());
        }
        return str;
    }
      

    const renderSolution = (solveP: Object, prob1: string)  => {
        var nerdamer = require('nerdamer');
        require('nerdamer/Solve');
        return (
            <div>
                {
                    Object.keys(solveP).map((key, index) => (
                    <div key={index}>
                        <p>{key} = {nerdamer(solveP[key as keyof typeof solveP]).text('fractions')}</p>
                        
                    </div>
                    ))
                }
            </div>
        );
    };
      
      
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