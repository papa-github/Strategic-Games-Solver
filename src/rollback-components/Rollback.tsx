import Tree from "./Tree";
import { Node }  from "./NodeInterface";

export default function Rollback(props: { tree: Tree}) {
    let tree = props.tree

    function rollbackEquilibrium(){

        
        function getMaxArrays(arr: number[][], index: number): number[][] {
            let max = -Infinity;
            let result: number[][] = [];
            // Iterate over each array
            for (let i = 0; i < arr.length; i++) {
                //Check if the value exists
                if (arr[i][index] === undefined) {
                    throw new Error("getMaxArrays: Value does not exist");
                }
                // Iterate over each element in the array
                if (arr[i][index] > max) {
                    max = arr[i][index];
                }
            }
            // Iterate over each array again, adding the arrays that have the max value to the result
            for (let i = 0; i < arr.length; i++) {
                if (arr[i][index] === max) {
                    result.push(arr[i]);
                }
            }
            return result;
        }

        const getPayoffs = (node: Node): number[][] => {
            if (node.isLeaf){return [node.payoffs]}
            else{
                const children = node.children;
                const childPayoffs: number[][] = children.map(child => getPayoffs(child)).flat();
                return getMaxArrays(childPayoffs, node.owner);
            }
        }

        console.log(getPayoffs(tree.root));
        return getPayoffs(tree.root);
    }
    function equilibriumPath(){}
    return (
        <div>
            <div className="rollback">
                Root: {(rollbackEquilibrium()).map((childStrat, index) => {return("{" + childStrat.join(", ") + "}")}).join(", ")}
            </div>
            <div className="equilibrium-path">

            </div>
        </div>
    )
}