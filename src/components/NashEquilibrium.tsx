import Matrix from "./Matrix";
import '../styles/mixednash.css'
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Dominance from "./Dominance";

function NashEquilibrium(props: {param: Matrix}) {
    let [matrix, dominated] = Dominance(props.param)

    function findPureNash(): JSX.Element {
        const nashEquilibria = [];
        const rowMaxValues = matrix.matrixData.map(row => Math.max(...row.map(cell => Number(cell.split(",")[1]))));
        const colMaxValues: number[] = matrix.matrixData[0].map((_, j) => Math.max(...matrix.matrixData.map(row => Number(row[j].split(",")[0]))));
        
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
        if (nashEquilibria.length === 0){return <p> There is no pure Nash equilibrium in this game</p> }
        return ( matrix.display(nashEquilibria));
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
        let solveP1: Object;
        let solveQ1: Object;
        
        try {
          solveP1 = nerdamer.solveEquations(joinEquations(Array.from(p2ExpectedPayoff.values())))
          solveQ1 =  nerdamer.solveEquations(joinEquations(Array.from(p1ExpectedPayoff.values())))
        } catch (error) {
          return(
            <p>There is no mixed strategy nash in this game</p>
          )
        }
        
        
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
        let eq2 = (nerdamer(payoff2).evaluate(solveP1)).text('fractions')

        const p1PayoffKeys =   Array.from(p1ExpectedPayoff.keys())
        const p1PayoffValues = Array.from(p1ExpectedPayoff.values())
        const p2PayoffKeys =  Array.from(p2ExpectedPayoff.keys())
        const p2PayoffValues = Array.from(p2ExpectedPayoff.values())
        
        return (
            <div className="mixed-nash">
              <p>The game has a mixed strategy Nash equilibrium</p>
              <p>
              Each player can choose a mix of pure strategies so as to make every other player indifferent between any mix of the pure strategies that appear in their own mixed strategy.
              </p>
              <p>
                For a player to be mixing their strategies in Nash Equilibrium, then each strategy must yield the same expected payoff.
              </p>
              <p>
                Assume that <b>{matrix.player1Name}</b> plays <InlineMath>{formatExpression(player1Strategies.join(" , ").toString())}</InlineMath> with probabilities <InlineMath>{formatExpression(pProbs.join(" , "))}</InlineMath>
              </p>
              <p>
                Assume that <b>{matrix.player2Name}</b> plays <InlineMath>{formatExpression(player2Strategies.join(" , ").toString())}</InlineMath> with probabilities <InlineMath>{formatExpression(qProbs.join(" , "))}</InlineMath>
              </p>
              <hr />
              <h3><b>{matrix.player1Name}'s</b> Expected Payoff:</h3>
              <div className="expected-payoff-formulas">
                {p1PayoffKeys.map((key, index) => (
                  <div key={index}>
                    <p>
                      <InlineMath>{formatExpression(key + " = " + p1ExpectedPayoff.get(key))}</InlineMath>
                    </p>
                  </div>
                ))}
              </div>
              <p>
                Once again, in a mixed strategy Nash Equilibrium, each strategy must have the same expected payoff:
              </p>
              <p>
                <InlineMath>{formatExpression(p1PayoffKeys.join(" = ").toString())}</InlineMath>
              </p>
              <p>
                <InlineMath>{formatExpression(p1PayoffValues.join(" = ").toString())}</InlineMath>
              </p>
              {solution2}
              <hr />
              <h3><b>{matrix.player2Name}'s</b> Expected Payoff:</h3>
              <div className="expected-payoff-formulas">
                {p2PayoffKeys.map((key, index) => (
                  <div key={index}>
                    <InlineMath>{formatExpression(key + " = " + p2ExpectedPayoff.get(key))}</InlineMath>
                  </div>
                ))}
              </div>
              <p>
                Once again, in a mixed strategy Nash Equilibrium, each strategy must have the same expected payoff:
              </p>
              <p>
                <InlineMath>{formatExpression(p2PayoffKeys.join(" = ").toString())}</InlineMath>
              </p>
              <p>
                <InlineMath>{formatExpression(p2PayoffValues.join(" = ").toString())}</InlineMath>
              </p>
              {solution1}
              <hr />
              <p>Following this mixed strategy:</p>
              <p><b>{matrix.player1Name}'s</b> payoff is:</p>
              <p>
                <InlineMath>
                  {formatExpression(strReplace(solveQ1, p1PayoffValues[0]) + " = " + eq)}
                </InlineMath>
              </p>
              <p><b>{matrix.player2Name}'s</b> payoff is:</p>
              <p>
                <InlineMath>
                  {formatExpression(strReplace(solveP1, p2PayoffValues[0]) + " = " + eq2)}
                </InlineMath>
              </p>
            </div>
        );
          
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
        if (num === 1) {console.log(num === 1)};
        
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

    function formatExpression(str: string): string {
        const matches = str.match(/[a-zA-Z]+\d+/g);
        let formattedStr = str;
      
        if (matches !== null) {
          matches.forEach((match) => {
            // Extract variable name and subscript from match
            const varName = match.match(/[a-zA-Z]+/)![0];
            const sub = match.match(/\d+/)![0];
            
            // Replace match with formatted variable name (with subscript)
            formattedStr = formattedStr.replace(match, `${varName}_${sub}`);
          });
        }
      
        // Match fractions (e.g. "2/3") and format them using LaTeX
        formattedStr = formattedStr.replace(/(\d+)\/(\d+)/g, "\\frac{$1}{$2}");
      
        return  formattedStr;
    }
      

    const renderSolution = (solveP: Object, prob1: string)  => {
        var nerdamer = require('nerdamer');
        require('nerdamer/Solve');
        return (
            <div>
                {
                    Object.keys(solveP).map((key, index) => (
                    <div key={index}>
                        <p><InlineMath>{formatExpression(key + " = " + nerdamer(solveP[key as keyof typeof solveP]).text('fractions'))}</InlineMath></p>
                        
                    </div>
                    ))
                }
            </div>
        );
    };
      
      
    function render():JSX.Element{
        return(
            <div>
              {findPureNash()}
              <hr />
              {findMixedNash()}
            </div>
        )      
    }

    return(
        <div>
          <div className="matrix-calculation">
                {dominated}
          </div>
          <div className="matrix-calculation">
            <h3>Pure Strategy Nash Equilibrium</h3>
            {findPureNash()}
            <hr />
            <h3>Mixed Strategy Nash Equilibrium</h3>
            {findMixedNash()}
          </div>
        </div>
    )
}

export default NashEquilibrium