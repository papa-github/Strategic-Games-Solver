import { useState } from "react"
import "../styles/ExternalityCalculator.css"
import EditableExternalityGrid from "../externality-components/EditableExternalityGrid"
import ExternalityCalculations from "../externality-components/ExternalityCalculations"

export default function ExternalityCalculator() {

    const [grid, setGridData] = useState<(number | null)[][]>()

    function handleCalculate(grid: (number | null)[][]) {
        setGridData(grid)
    }

    return (
        <div className="externality-calculator">
            <h1>Externality Calculator</h1>
            <EditableExternalityGrid handleCalculate={handleCalculate}/>
            
            {grid && <ExternalityCalculations grid={grid}/>}
        </div>
    )
}