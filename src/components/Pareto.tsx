import { InlineMath } from "react-katex";
import Matrix from "./Matrix";
import getPareto from "../helper/getPareto";

function Pareto(props: {param: Matrix}) {
  let result: number[][] = getPareto(props.param.convertToNumberMatrix());

  return(
      <div className="matrix-calculation" id="pareto">
          <h2>Pareto Efficiency</h2>
          <p> For a strategy to be pareto efficient,
              there must be no alternative where a player is better off and no one is worse off</p>
            <p>Alternatively: For a strategy, <InlineMath>s</InlineMath>,  if there exists a strategy where at least one player is better off and no one is worse off than <InlineMath>s</InlineMath> is not pareto efficient </p>
          {props.param.display(result)}
      </div>
  )
}

export default Pareto