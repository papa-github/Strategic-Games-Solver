import { useState } from "react";
import EditableGameTree from "../rollback-components/EditableGameTree";
import Tree from "../rollback-components/Tree";
import "../styles/RollbackEquilibrium.css"
import PlayerStrategies from "../rollback-components/PlayerStrategies";
import Rollback from "../rollback-components/Rollback";
import horizontalExample from "../images/horizontaltree.png"
import verticalExample from "../images/verticaltree.png"
import ImageModal from "../other-components/image-modal";

export default function RollbackEquilibrium() {
    const [treeData, setTreeData] = useState<Tree>()
    const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical")


    function setTree(tree: Tree) {
        setTreeData(tree)
    }

    function setOrientationState(event: React.ChangeEvent<HTMLInputElement>) {
        const currentvalue = event.target.value

        if (currentvalue !== "vertical" && currentvalue !== "horizontal") {
            return
        }else{
            setOrientation(currentvalue)
        }
        
    }
    return (
        <div className="rollback-equilibrium">
            <h1>Rollback Solver</h1>
            This solver can solve simple sequential games. Be careful using this for games with more than 2 choices per player (you can, but calculations are untested).
            
            {/* Radio Button Modal */}
            <div onChange={setOrientationState}>
                Set Orientation (just for calculations, display will remain the same):
                <input type="radio" value="vertical" name="orientation" defaultChecked={true}  /> <ImageModal text="Vertical" image={verticalExample} />
                <input type="radio" value="horizontal" name="orientation" /> <ImageModal text="Horizontal" image={horizontalExample} />
            </div>
            {orientation === "horizontal" ? <p>When inputting your tree. The rightmost node below should corresponse to the highest node in your tree</p> : null}
            <EditableGameTree handleCalculate={setTree}/>
            
            {treeData && <PlayerStrategies tree={treeData} orientation={orientation}/>}
            
            {treeData && <Rollback tree={treeData} orientation={orientation}/>}
        </div>
    )
}