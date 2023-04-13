import Tree from "./Tree";
import { Node }  from "./NodeInterface";

export default function Rollback(props: { tree: Tree}) {
    let tree = props.tree

    function getEquilibriums(selectedNodes: number[]){
        let nodes = selectedNodes.map((id) => tree.getNode(id)).map((node) => {
            return {
                name: node.name,
                owner: fixOwner(node.owner)
            }
        })


        function fixOwner(owner_id: number){
            // 
            if (owner_id === -1){ return (tree.numPlayers - 1)}
            return owner_id - 1
        }

        const result = nodes.reduce((acc: any[], obj) => {
            const index = acc.findIndex(arr => arr[0].owner === obj.owner);
            if (index !== -1) {
              acc[index].push(obj);
            } else {
              acc.push([obj]);
            }
            return acc;
        }, []);

        return result.sort((a,b) => a[0].owner - b[0].owner) // Sort by owner, ascending
        //return (result.map((arr) => arr.map((node: Node) => node.name)))
    }

    function rollbackEquilibrium( ){
        
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
            const rollbacks : Node[][] = getEquilibriums(selectedNodes)
            console.log(rollbacks)
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
                                <div className="equilibrium-path">
                                    Equilibrium Path: {childStrat.path_ids.map((id, index) => (tree.getNode(id).name)).join(",")}
                                </div>
                                <div className="rollback-eq">
                                    Rollback Equilibrium:(
                                    {
                                        rollbacks.map((rollback, index) => {
                                            return(
                                                <span>
                                                    ({rollback.map((node) => node.name).join(",")})
                                                </span>
                                            )
                                        })
                                    }
                                    )
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

    function cartesianProduct(arrays: string[][]): string[][] {
        // Base case
        if (arrays.length === 0) {
          return [[]];
        }
      
        // Recursive case
        const [head, ...tail] = arrays;
        const tailCartesian = cartesianProduct(tail);
        const result = [];
      
        for (const item of head) {
          for (const tailItem of tailCartesian) {
            result.push([item, ...tailItem]);
          }
        }
      
        return result;
    }
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