import Tree from "./Tree";
import { Node }  from "./NodeInterface";

export default function Rollback(props: { tree: Tree}) {
    let tree = props.tree

    function rollbackEquilibrium(){

        interface PayoffObject {
            current_id: number;
            path_ids: number[];
            payoff: number[];
        }
        
        function getMaxPayoffObjects(payoffObjects: PayoffObject[], index: number, id: number): PayoffObject[] {
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
                    //add
                }
            }

            return result;
        }

        const getPayoffs = (path: number[], node: Node, validNodes: Node[]): PayoffObject[] => {
            if (node.isLeaf){
                return [{current_id: node.id , path_ids: [...path,node.id], payoff: node.payoffs}]
            }
            else{
                const children = node.children;
                const childPayoffs: PayoffObject[] = children.map((child) => {
                    const result: PayoffObject[] = getPayoffs([...path,node.id], child, validNodes);
                    result.map((payoffObject) => ( payoffObject.current_id = child.id))
                    return (result)
                }).flat(); //Array of PayoffObjects
                const maxPayoffs = getMaxPayoffObjects(childPayoffs, node.owner, node.id);
                // Update selectedNodes
                maxPayoffs.map((payoffObject) => {
                    if (!selectedNodes.includes(payoffObject.current_id)){
                        selectedNodes.push(payoffObject.current_id)
                    }
                })

                return getMaxPayoffObjects(childPayoffs, node.owner, node.id);
            }
        }
        
        const selectedNodes: number[] = []
        
        // Renderer 
        function render(): JSX.Element{
            const payoffs = getPayoffs([],tree.root,[]);
            console.log(selectedNodes)
            return(
                <div>
                    {payoffs.map((childStrat, index) => {
                        
                        return(
                            <div key={index}>
                                <div className="rollback-tree">
                                    {tree.displayTree(childStrat.path_ids)}
                                </div>
                                <div className="payoff">
                                    {childStrat.payoff.map((payoff, index) => {
                                        return(
                                            <div>
                                                {tree.players[index]} gets a payoff of {payoff}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div>
                                    {}
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