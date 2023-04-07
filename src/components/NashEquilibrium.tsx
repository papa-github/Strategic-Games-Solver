import Matrix from "./Matrix";
import '../styles/mixednash.css'
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Dominance from "./Dominance";
import getPareto from "../helper/getPareto";

function NashEquilibrium(props: {param: Matrix}) {
    let [matrix, dominated] = Dominance(props.param)
    let payoffDominant: number[][] | null = null;
    let riskDominant: number[][] | null = null;

    function findPureNash(): JSX.Element {
        const nashEquilibria: number[][] = [];
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
        else {
          if (nashEquilibria.length === 1){ // if there is only one pure nash equilibrium, then it is both payoff and risk dominant
            payoffDominant = nashEquilibria; riskDominant = nashEquilibria
          }
          else
          {
            //getPareto should return an array containing the pareto superior equilibria (in an array of array but only the first one is needed)
            let paretoEquilibra = getPareto(getPayoffs(nashEquilibria.map(cell => matrix.matrixData[cell[0]][cell[1]])))
            //paretoEquilibria is specifies the indexes in nashEquilibria that are pareto superior. We can then use those indexes to get the matrix indexes.
            payoffDominant = paretoEquilibra.map(cell => nashEquilibria[cell[0]])
            riskDominant = getRiskDominant(nashEquilibria)
        }
        }
        return ( matrix.display(nashEquilibria));
    }

    function getPayoffs(inputs: string[]): number[][][] {
      const matrix: number[][][] = [];
      for (let i = 0; i < inputs.length; i++) {
        matrix[i] = [];
        const payoffs: number[] = inputs[i].split(',').map(Number);
        matrix[i][i] = payoffs;
        for (let j = 0; j < inputs.length; j++) {
          if (i !== j) {
            matrix[i][j] = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
          }
        }
      }
      return matrix;
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

    function getRiskDominant(nashEquilibria: number[][]): number[][] {
      if (nashEquilibria.length === 1) return nashEquilibria; // There is only one nash equilibrium, so it is risk dominant
      let riskDominantArray: number[][] = [];
      let numberMatrix = matrix.convertToNumberMatrix();
      
      for (let i = 0; i < nashEquilibria.length; i++) {
        // We are now at a specific nash equilibrium
        let rDominant: boolean = true;
        for (let k = 0; k < nashEquilibria.length; k++) {
          if (i === k) continue; // We don't want to compare the same nash equilibrium
          // We are now at a different nash equilibrium
          //Now we must get the product of the deviation losses
          let p1DeviateFromCurrent = numberMatrix[nashEquilibria[i][0]][nashEquilibria[i][1]][0] - numberMatrix[nashEquilibria[k][0]][nashEquilibria[i][1]][0];
          let p2DeviateFromCurrent = numberMatrix[nashEquilibria[i][0]][nashEquilibria[i][1]][1] - numberMatrix[nashEquilibria[i][0]][nashEquilibria[k][1]][1];
          let p1DeviateFromOther = numberMatrix[nashEquilibria[k][0]][nashEquilibria[k][1]][0] - numberMatrix[nashEquilibria[i][0]][nashEquilibria[k][1]][0];
          let p2DeviateFromOther = numberMatrix[nashEquilibria[k][0]][nashEquilibria[k][1]][1] - numberMatrix[nashEquilibria[k][0]][nashEquilibria[i][1]][1];
          if (p1DeviateFromCurrent * p2DeviateFromCurrent < p1DeviateFromOther * p2DeviateFromOther) {
            rDominant = false;
            break;
          }
        }
        if (rDominant) riskDominantArray.push(nashEquilibria[i]);
      } 
      return riskDominantArray;
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

    function renderPayoffDominant(): JSX.Element{
      if (payoffDominant === null) return <p></p>
      console.log(payoffDominant)
      return (
        <div>
          
          <p>The payoff dominant equilibria is the pareto superior Nash equilibria.</p>
          <p>Meaning, no other equilibrium yields greater payoffs to either player</p>
          {matrix.display(payoffDominant)}
        </div>
      )
    }

    function renderRiskDominant(): JSX.Element{
      if (riskDominant === null) return <p></p>
      return (
        <div>
          <p>The risk dominant equilibria is least risky Nash equilibria.</p>
          <p>Meaning, there is the least utility lost in this equilibrium if other players were to deviate</p>
          {matrix.display(riskDominant)}
        </div>
      )
    }

    return(
        <div>
          <div className="matrix-calculation" id="dominated-strategy">
                {dominated}
          </div>
          <div className="matrix-calculation" id="nash">
            <h3>Pure Strategy Nash Equilibrium</h3>
            {findPureNash()}
            <hr />
            <h3>Mixed Strategy Nash Equilibrium</h3>
            {findMixedNash()}
            <hr />
            <div>
            <h3>Payoff Dominant</h3>
              {renderPayoffDominant()}
            </div>
            <hr />
            <div>
            <h3>Risk Dominant</h3>
            {renderRiskDominant()}
            </div>
          </div>
        </div>
    )
}

export default NashEquilibrium