import { useState } from "react";
import EditableGameTree from "../rollback-components/EditableGameTree";
import Tree from "../rollback-components/Tree";
import "../styles/RollbackEquilibrium.css"
import PlayerStrategies from "../rollback-components/PlayerStrategies";
import Rollback from "../rollback-components/Rollback";

export default function RollbackEquilibrium() {
    const [treeData, setTreeData] = useState<Tree>()


    function setTree(tree: Tree) {
        setTreeData(tree)
    }
    return (
        <div className="rollback-equilibrium">
            <EditableGameTree handleCalculate={setTree}/>
            
            {treeData && <PlayerStrategies tree={treeData}/>}
            
            {treeData && <Rollback tree={treeData}/>}
        </div>
    )
}