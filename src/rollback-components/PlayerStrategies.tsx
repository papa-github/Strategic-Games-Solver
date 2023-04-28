import Tree from "./Tree";
import { Node }  from "./NodeInterface";


export default function PlayerStrategies(props: { tree: Tree, orientation : "vertical" | "horizontal"}) {
    let tree = props.tree 

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
      

    //Function takes a player and returns the names of children nodes that player owns
    function getStrategies(player: string): string[][]{
        let playerNumber = tree.players.indexOf(player)
        if (playerNumber === -1) return [["Player not found"]]
        let strategies: string[][] = []
        let root = tree.root
        const traverse = (node: Node) => {
            if (node.isLeaf) return // We don't care about leaves
            if (node.owner === playerNumber){
                // We need the name of your child nodes
                let childStrategies: string[] = []
                for (let child of node.children){
                    childStrategies.push(child.name)
                }
                strategies.push(childStrategies)
            }else{
                for (let child of node.children){
                    traverse(child)
                }
            }
            
        }

        traverse(root)        
        return strategies

    }

    return (
        <div>
            <h3>Player Strategies</h3>
            {tree.players.map((player, index) => {
                return (
                    <div key={index}>
                        
                        <b>{player} Strategies:</b> {props.orientation === "vertical" ? cartesianProduct(getStrategies(player)).map((childStrat, index) => {return("{" + childStrat.join(", ") + "}")}).join(", ") : cartesianProduct(getStrategies(player)).reverse().map((childStrat, index) => {return("{" + childStrat.join(", ") + "}")}).join(", ")}
                    </div>
                )}
            )}

        </div>
    )
}