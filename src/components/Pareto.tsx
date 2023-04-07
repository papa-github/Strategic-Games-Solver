import Matrix from "./Matrix";

function Pareto(props: {param: Matrix}) {
  let matrix: number[][][] = props.param.convertToNumberMatrix();
  let result: number[][] = [];
  const num_rows = matrix.length;
  const num_cols = matrix[0].length;

  for (let i = 0; i < num_rows; i++) {
    for (let j = 0; j < num_cols; j++) {
      let current_strategy = matrix[i][j];
      let is_pareto_efficient = true;
      for (let k = 0; k < num_rows; k++) {
        for (let l = 0; l < num_cols; l++) {
          if (k === i && l === j) {
            continue;
          }
          let other_strategy = matrix[k][l];
          if (other_strategy[0] > current_strategy[0] && other_strategy[1] > current_strategy[1]) {
            is_pareto_efficient = false;
            break;
          }
        }
        if (!is_pareto_efficient) {
          break;
        }
      }
      if (is_pareto_efficient) {
        //Push index of current pareto efficient strategy
        result.push([i, j]);
      }

    }
  }


  
    return(
        <div className="matrix-calculation">
            <h2>Pareto Efficiency</h2>
            <p> For a strategy to be pareto efficient,
                there must be no alteranative where a player is better off without the other player losing</p>
            {props.param.display(result)}
        </div>
    )
}

export default Pareto