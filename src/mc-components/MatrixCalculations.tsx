import Matrix from "./Matrix"
import NashEquilibrium from "./NashEquilibrium"
import KaldorHicks from "./KaldorHicks"
import Pareto from "./Pareto"
import "../styles/MatrixCalculations.css"

function MatrixCalculations(props: {inputMatrix: Matrix}) {
         
    return(
        <div className="calculations-container">
            {<NashEquilibrium param={props.inputMatrix} />}
            {<Pareto param={props.inputMatrix} />}
            {<KaldorHicks param={props.inputMatrix} />}
            
        </div>
    )
}

export default MatrixCalculations