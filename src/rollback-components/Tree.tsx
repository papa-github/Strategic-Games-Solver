import { Node }  from "./NodeInterface";

class Tree {
    private _root: Node;
    private _players: string[];

    constructor(root: Node, players: string[]) {
        this._root = root;
        this._players = players;
        if (!(this.validateTree())){
            throw new Error("Invalid Tree");
        }else{
            console.log("Tree is valid");
        }
    }

    get root(): Node {
        return this._root;
    }

    get players(): string[] {
        return this._players;
    }

    set root(root: Node) {
        this._root = root;
    }

    set players(players: string[]) {
        this._players = players;
    }

    get numPlayers(): number {
        return this._players.length;
    }

    validateTree(): boolean {
        // The owner of a node must be a player
        const validateOwner = (node: Node): boolean => {
            if (node.owner !== -1 && this._players[node.owner] === undefined) { //-1 for leaves, this.numPlayers - 1 for players array
                console.log("Invalid Owner", node.owner, this._players[node.owner]);
                return false;
            }else{
                // Check children
                for (let child of node.children) {
                    if (!validateOwner(child)) {
                        return false;
                    }
                }
            }
            return true;
        }
        

        const validateLeaves = (node: Node): boolean => {
            if (node.isLeaf) {
                // Whilst we're here, check that leaf has no children
                if (node.children.length !== 0) {
                    console.log("Leaf has children");
                    return false;
                }

                // Whilst we're here, check that leaf has no owner
                if (node.owner !== -1) {
                    console.log("Leaf has owner");
                    return false;
                }

                // Check that the payoffs array is the correct length (one for each player)
                if (node.payoffs.length !== this.numPlayers) {
                    console.log("Invalid Payoff Length");
                    console.log("Expected", this.numPlayers, "Got", node.payoffs.length);
                    return false;
                }

                
                for (let payoff of node.payoffs) {
                    // Check that the payoffs are not undefined
                    console.log(payoff)
                    if (payoff === undefined) {
                        
                        console.log("Undefined Payoff");
                        return false;
                    }
                    //Check that payoffs can be parsed to numbers
                    if (isNaN(payoff)) {
                        console.log("Payoff is not a number");
                        return false;
                    }
                }
            }else{
                // Check children
                for (let child of node.children) {
                    if (!validateLeaves(child)) {
                        return false;
                    }
                }
            }
            return true;
        }

        //Check that all the players are unique
        const validatePlayers = (): boolean => {
            let playerSet = new Set(this._players);
            if (playerSet.size !== this._players.length) {
                console.log("Duplicate Players");
                return false;
            }
            return true;
        }

        return validateOwner(this._root) && validateLeaves(this._root) && validatePlayers();
    }

    #displayNode(node: Node): JSX.Element {
        return (
            <li key={node.id}>
            <div className="node-name">
                {node.name}
            </div>
            <div className="node">
                {this.players[node.owner]}
            </div>
            {node.children.length > 0 ? (
                <ul>{node.children.map((child) => this.#displayNode(child))}</ul>
            ) : (
                // If there are no children, Display an input box for each player
                [...Array(node.payoffs.length)].map((_, index) => {
                return (
                    <div key={index}>
                    {this.players[index]} Payoff{": "}
                    {node.payoffs[index]}
                    </div>
                );
                })
            )}
            </li>
        );
    }

    displayTree(): JSX.Element {
        return (
            <div className="tree">
            <ul>{this.#displayNode(this._root)}</ul>
            </div>
        );
    }

}

export default Tree;