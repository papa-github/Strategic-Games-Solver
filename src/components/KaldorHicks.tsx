import { InlineMath } from "react-katex";
import Matrix from "./Matrix";

function KaldorHicks(props: {param: Matrix}) {
    function getKaldorHicksEfficientStrategies(matrix: number[][][]): number[][] {
        const num_rows = matrix.length;
        const num_cols = matrix[0].length;
      
        // Compute the maximum payoff
        let max_payoff = 0;
        for (let i = 0; i < num_rows; i++) {
          for (let j = 0; j < num_cols; j++) {
            const payoff_sum = matrix[i][j][0] + matrix[i][j][1];
            max_payoff = Math.max(max_payoff, payoff_sum);
          }
        }
      
        // Find the strategies whose payoffs sum up to the maximum payoff
        const result: number[][] = [];
        for (let i = 0; i < num_rows; i++) {
          for (let j = 0; j < num_cols; j++) {
            const payoff_sum = matrix[i][j][0] + matrix[i][j][1];
            if (payoff_sum === max_payoff) {
              result.push([i, j]);
            }
          }
        }
      
        return result;
    }
      

    return(
        <div className="matrix-calculation" id="kaldor-hicks">
            <h2>Kaldor-Hicks Efficiency</h2>
            <p>For a strategy to be Kaldor-Hicks efficient there must be no strategy where those who are better off can compensate those who are worse off</p>
            <p>Alternatively: For a strategy, <InlineMath>s</InlineMath>, if there exists a strategy where those who are better off can compensate those who are worse off than <InlineMath>s</InlineMath> is not Kaldor-Hicks efficient</p>
            <small>Editor's Note: To find the KH optimal strategies, I believe we can just pick the strategies with the highest payoff sum</small>
            <p><i>Somewhat</i> fun fact: A Kaldor-Hicks optimal outcome is always Pareto efficient</p>
            <p>Also, with Kaldor-Hicks we are assuming that the utility measure is interpersonally comparable</p>
            {props.param.display(getKaldorHicksEfficientStrategies(props.param.convertToNumberMatrix()))}
        </div>
    )
}

export default KaldorHicks