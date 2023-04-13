import Tree from "./Tree";
import { Node }  from "./NodeInterface";

export default function Rollback(props: { tree: Tree}) {
    let tree = props.tree

    function rollbackEquilibrium(){

        interface PayoffObject {
            ids: number[];
            payoff: number[];
        }
        
        function getMaxPayoffObjects(payoffObjects: PayoffObject[], index: number): PayoffObject[] {
            let max = -Infinity;
            let result: PayoffObject[] = [];
            // Iterate over each array
            for (let i = 0; i < payoffObjects.length; i++) {
                //Check if the value exists
                if (payoffObjects[i].payoff[index] === undefined){
                    throw new Error("getMaxArrays: Value does not exist");
                }
                // Check if value greater than max
                if (payoffObjects[i].payoff[index] > max) {
                    max = payoffObjects[i].payoff[index];
                }
            }
            // Iterate over each array again, adding the arrays that have the max value to the result
            for (let i = 0; i < payoffObjects.length; i++) {
                if (payoffObjects[i].payoff[index] === max) {
                    result.push(payoffObjects[i]);
                }
            }
            return result;
        }

        const getPayoffs = (path: number[], node: Node): PayoffObject[] => {
            if (node.isLeaf){

                return [{ids: [...path,node.id], payoff: node.payoffs}]
            }
            else{
                const children = node.children;
                const childPayoffs: PayoffObject[] = children.map(child => getPayoffs([...path,node.id], child)).flat(); //Array of PayoffObjects
                return getMaxPayoffObjects(childPayoffs, node.owner);
            }
        }
        console.log(getPayoffs([],tree.root))

        // Renderer 
        function render(): JSX.Element{
            const payoffs = getPayoffs([],tree.root);
            return(
                <div>
                    {payoffs.map((childStrat, index) => {
                        
                        return(
                            <div key={index}>
                                <div className="rollback-tree">
                                    {tree.displayTree(childStrat.ids)}
                                </div>
                                <div className="payoff">
                                    {"{" + childStrat.payoff.join(", ") + "}"}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        }
        return render()
    }
    function equilibriumPath(){}
    return (
        <div>
            <div className="rollback">
                <h3>Rollback Equilibrium</h3>
                {rollbackEquilibrium()}
            </div>
            <div className="equilibrium-path">

            </div>
        </div>
    )
}