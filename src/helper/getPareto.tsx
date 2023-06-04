function getPareto(matrix: number[][][]): number[][]{
  let result: number[][] = [];
  const num_rows = matrix.length;
  const num_cols = matrix[0].length;

  //4 nested loops ... will try and reduce this
  for (let i = 0; i < num_rows; i++) {
    for (let j = 0; j < num_cols; j++) {
      //Here we are at a particular strategy
      let current_strategy = matrix[i][j];
      let is_pareto_efficient = true;
      for (let k = 0; k < num_rows; k++) {
        for (let l = 0; l < num_cols; l++) {
          //Here we are at another particular strategy
          if (k === i && l === j) { // If we are at the same strategy, skip
            continue;
          }
          let other_strategy = matrix[k][l];
          //If the other strategy is better for both players, then the current strategy is not pareto efficient
          if (other_strategy[0] >= current_strategy[0] && other_strategy[1] >= current_strategy[1]) {
            is_pareto_efficient = false;
            break;
          }
        }
        //If we have found a strategy that is better for both players, then we can stop checking
        if (!is_pareto_efficient) {
          break;
        }
      }

      //If the strategy is pareto efficient, then push it to the result
      if (is_pareto_efficient) {
        //Push index of current pareto efficient strategy
        result.push([i, j]);
      }
    }
  }
    return result; // Returns an array of indexes of pareto efficent strategies
}

export default getPareto;