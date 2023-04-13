import React, { useRef, useState } from 'react';
import '../styles/EditableGameTree.css';
import { Node } from './NodeInterface';
import Tree from './Tree';

//TODO - Add leaf support



const initialTree: Node = {
  id: 1,
  parent: null,
  owner: 0,
  name: ``,
  children: [
    {
      id: 2,
      parent: 1,
      owner: -1,
      name: `Choice 1`,
      children: [],
      payoffs: [0],
      isLeaf:true
    },
    {
      id: 3,
      parent: 1,
      owner: -1,
      name: `Choice 2`,
      children: [],
      payoffs: [0],
      isLeaf:true
    }
  ],
  payoffs: [],
  isLeaf:false
};

function deepCopyTree(node: Node): Node {
  const newNode: Node = {
    id: node.id,
    parent: node.parent,
    owner: node.owner,
    name: node.name,
    children: [],
    payoffs: [...node.payoffs],
    isLeaf:node.isLeaf
  };

  newNode.children = node.children.map(child => deepCopyTree(child));

  return newNode;
}

const EditableGameTree = (props: { handleCalculate: (tree: Tree) => any }) => {
  const [tree, setTree] = useState<Node>(initialTree);
  const [players, setPlayers] = useState<string[]>(["Player 1"]);
  const [numNodes, setNumNodes] = useState<number>(3);
  const [newPlayerName, setNewPlayerName] = useState<string>('');

  const numNodesRef = useRef(numNodes);

  const handleInputChange = (playerIndex: number, node: Node, value: number) => {
    if (node.children.length > 0) return;
    node.payoffs[playerIndex] = value;
  };

  function updateLeaf(node: Node, owner: number, playerNames: string[]): void {
    if (node.children.length === 0) {
      // This is a leaf node, update its owner and children
        node.owner = owner;
        node.children = createNewChildren(playerNames, node.id);
        node.isLeaf=false;
    } else {
        // Traverse the children and update their owners
        node.children.forEach(child => {
            updateLeaf(child, owner, playerNames);
      });
    }
  }

  const createNewChildren = (playerNames: string[], parentId: number): Node[] => {
    const newChildren: Node[] = [
      {
        id: numNodesRef.current + 1,
        parent: parentId,
        owner: -1,
        name: `Choice 1`,
        children: [],
        payoffs: [...Array(playerNames.length)].map(() => 0),
        isLeaf:true
      },
      {
        id: numNodesRef.current + 2,
        owner: -1,
        parent: parentId,
        name: `Choice 2`,
        children: [],
        payoffs: [...Array(playerNames.length)].map(() => 0),
        isLeaf:true
      }
    ]
    numNodesRef.current += 2;
    return newChildren
  }

  const addPlayer = () => {
    let name = newPlayerName;
    let names = [...players]
    
    if (name === '') {
      name = `Player ${names.length + 1}`
    }
    
    // Throw alert if player name is already in use
    if (names.includes(name)) {
      alert(`Player name already in use`);
      return;
    }
    
    names.push(name);
    setNumNodes(numNodes + 2)
    const newTree = deepCopyTree(tree)
    updateLeaf(newTree, names.length -1, names); // pass new node owner and name to updateLeaf function
    setPlayers([...players,name]);
    setTree(newTree)
  };

  const RenderNode = (node: Node) => {
    const handleOwnerChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      // Create a copy of the players array
      let newPlayers = [...players];
      // Update the name at the given index
      newPlayers[index] = event.target.value;
      // Update the players array
      setPlayers(newPlayers);
    }
  
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>, oldNode: Node) => {
      let newTree = deepCopyTree(tree);
      const updateNodeName = (node: Node) => {
        if (node.id === oldNode.id) {
          node.name = event.target.value;
        } else {
          node.children.forEach(child => {
            updateNodeName(child);
          });
        }
      };
      updateNodeName(newTree);
      setTree(newTree);
    };
    
  
    return (
      <li key={node.id}>
        <div className="node-name">
          { node.id !== 1 ? <input type="text" value ={node.name} onChange={(event) => handleNameChange(event, node)} /> : ""}
        </div>
        <div className="node">
          { !node.isLeaf ? <input type="text" value ={players[node.owner]} onChange={(event) => handleOwnerChange(event, node.owner)} /> : ""}
        </div>
        {node.children.length > 0 ? (
          <ul>{node.children.map((child) => RenderNode(child))}</ul>
        ) : (
          // If there are no children, Display an input box for each player
          [...Array(node.payoffs.length)].map((_, index) => {
            return (
              <div key={index}>
                {players[index]} Payoff{" "}
                <input
                  type="number"
                  placeholder={(node.payoffs[index]).toString()}
                  onChange={(e) =>
                    handleInputChange(index, node, parseInt(e.target.value))
                  }
                />
              </div>
            );
          })
        )}
      </li>
    );
  };
  
  const renderTree = (tree: Node) => {
    return(
      <div className='tree'>
        <ul>{RenderNode(tree)}</ul>
      </div>
    )
  }
  
  function handleCalculate(){
    // Validate Tree
    const finalTree = new Tree(tree, players)
    props.handleCalculate(finalTree)
  }
  
  return (
    <div className='editable-tree'>
      {renderTree(tree)}
      <div>
        <input type="text" placeholder='Player Name' onChange={(e) => setNewPlayerName(e.target.value)} />
        <button onClick={addPlayer}>Add Player</button>
      </div>
      <button onClick={handleCalculate}>Calculate</button>
    </div>
  );
  };
  
  export default EditableGameTree;
  