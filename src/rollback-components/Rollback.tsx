import Tree from "./Tree";
import { Node }  from "./NodeInterface";

export default function Rollback(props: {tree: Tree, orientation: "vertical" | "horizontal"}) {
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
            rollbackIds: Set<number>;
        }
        
        function getMaxPayoffObjects(payoffObjects: PayoffObject[], index: number, id: number): PayoffObject[] {
            let max = -Infinity;
            let result: PayoffObject[] = [];
            let failures: PayoffObject[] = [];

            

            // Iterate over each array
            for (let i = 0; i < payoffObjects.length; i++) {
                //Check if the value exists
                if (payoffObjects[i].payoff[index] === undefined){
                    throw new Error("getMaxArrays: Value does not exist");
                }
                // Check if value greater than max
                if (payoffObjects[i].payoff[index] > max) {
                    // If so, set max to value
                    max = payoffObjects[i].payoff[index];
                }
            }
            // Iterate over each array again, adding the arrays that have the max value to the result
            for (let i = 0; i < payoffObjects.length; i++) {
                if (payoffObjects[i].payoff[index] === max) {
                    //Add payoffObject's current_id to its rollbackIds
                    payoffObjects[i].rollbackIds.add(payoffObjects[i].current_id);
                    // Add payoffObject to result
                    result.push(payoffObjects[i]);
    
                }else{
                    failures.push(payoffObjects[i]);
                }
            }

            //Iterate over failures and add their rollbackIds to every result object
            payoffObjects.map((object, index) => (
                payoffObjects.map((object2, index2) =>
                {
                    // Skip if index is the same
                    if (index === index2){}
                    else {
                        let addSet = (new Set([...object2.rollbackIds, ...object.rollbackIds]))
                        addSet.delete(object.current_id)
                        object2.rollbackIds = addSet
                    }
                }
                )
            ))

            
            



            return result;
        }

        const getPayoffs = (path: number[], node: Node, validNodes: Node[]): PayoffObject[] => {
            if (node.isLeaf){
                return [{current_id: node.id , path_ids: [...path,node.id], payoff: node.payoffs, rollbackIds: new Set<number>()}]
            }
            else{
                // check if current node has an id of 3
                const children = node.children;
                const childPayoffs: PayoffObject[] = children.map((child) => {
                    const result: PayoffObject[] = getPayoffs([...path,node.id], child, validNodes);
                    result.map((payoffObject) => ( payoffObject.current_id = child.id))
                    return (result)
                }).flat(); //Array of PayoffObjects
                let check = getMaxPayoffObjects(childPayoffs, node.owner, node.id);
                return getMaxPayoffObjects(childPayoffs, node.owner, node.id);
            }
        }
        
        
        // Renderer 
        function render(): JSX.Element{
            const payoffs = getPayoffs([],tree.root,[]);
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
                                            <div key={index}>
                                                {tree.players[index]} gets a payoff of {payoff}
                                            </div>
                                        )
                                    })}
                                </div>
                                
                                <div className="equilibrium-path">
                                    <b>Equilibrium Path:</b> {childStrat.path_ids.map((id, index) => (tree.getNode(id).name)).join(",")}
                                </div>
                                <div className="rollback-eq">
                                    <b>Rollback Equilibrium:</b>(
                                        
                                        { props.orientation === "vertical" ?
                                            getEquilibriums(Array.from(childStrat.rollbackIds).sort((a, b) => (a-b))).map((rollback: Node[], index) => {
                                                return(
                                                    <span key={index}>
                                                        ({rollback.map((node) => node.name).join(",")})
                                                    </span>
                                                )
                                            })
                                            : 
                                            getEquilibriums(Array.from(childStrat.rollbackIds).sort((a, b) => (b-a))).map((rollback: Node[], index) => {
                                                return(
                                                    <span key={index}>
                                                        ({rollback.map((node) => node.name).join(",")})
                                                    </span>
                                                )
                                            })
                                        }
                                    )
                                </div>
                                <hr className="light"/>
                            </div>
                        )
                    })}
                </div>
            )
        }
        return render()
    }

    return (
        <div>
            <div className="rollback">
            <hr />
                <h3>Rollback Equilibrium</h3>
                {rollbackEquilibrium()}
            </div>
            <div className="equilibrium-path">

            </div>
        </div>
    )
}