import { InlineMath } from "react-katex";
import Matrix from "./Matrix";
import getPareto from "../helper/getPareto";

function Pareto(props: {param: Matrix}) {
  let result: number[][] = getPareto(props.param.convertToNumberMatrix());

  return(
      <div className="matrix-calculation" id="pareto">
          <h2>Pareto Efficiency</h2>
          <p> For a strategy to be Pareto efficient,
              there must be no alternative where a player is better off and no one is worse off</p>
            <p>Alternatively: For a strategy, <InlineMath>s</InlineMath>,  if there exists a strategy where at least one player is better off and no one is worse off, then <InlineMath>s</InlineMath> is not Pareto efficient </p>
          {props.param.display(result)}
      </div>
  )
}

export default Pareto