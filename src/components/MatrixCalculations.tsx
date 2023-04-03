import { SetStateAction, useState } from "react"
import Dominance from "./Dominance"
import Matrix from "./Matrix"
import NashEquilibrium from "./NashEquilibrium"
import KaldorHicks from "./KaldorHicks"
import Pareto from "./Pareto"

function MatrixCalculations(props: {param: Matrix}) {
    let matrix = props.param
    const [reducedMatrix, setReducedMatrix] = useState<Matrix>()
    return(
        <div>
            <Dominance matrix={matrix} setReducedMatrix={setReducedMatrix} />
            {reducedMatrix && <NashEquilibrium param={reducedMatrix} />}
            {reducedMatrix && <Pareto param={reducedMatrix} />}
            {reducedMatrix && <KaldorHicks param={reducedMatrix} />}
            
        </div>
    )
}

export default MatrixCalculations