import React, { useRef, useState } from 'react';
import '../styles/EditableGameTree.css';

interface Node {
  id: number;
  owner: string;
  name: string;
  children: Node[];
}

const initialTree: Node = {
  id: 1,
  owner: 'Player 1',
  name: `Root`,
  children: [
    {
      // Set id to the parent id + 1
      id: 2,
      owner: '',
      name: `Up`,
      children: []
    },
    {
      id: 3,
      owner: '',
      name: `Down`,
      children: [] //Note: A leaf node cannot have an owner
    }
  ]
};

function deepCopyTree(node: Node): Node {
    const newNode: Node = {
      id: node.id,
      owner: node.owner,
      name: node.name,
      children: []
    };
  
    // Recursively copy the children nodes
    newNode.children = node.children.map(child => deepCopyTree(child));
  
    return newNode;
  }
  

const GameTree = ({ tree}: { tree: Node}) => {
    const [payoffs, setPayoffs] = useState<Array<number>>([]);
  
    const handleInputChange = (index: number, value: number) => {
      const newPayoffs = [...payoffs];
      newPayoffs[index] = value;
      setPayoffs(newPayoffs);
    };
  
    const renderTree = (node: Node) => {
        if (node.children.length === 0) { // leaf node
            return (
                <div className="node" key={node.id}>
                  <div className="external-node">{node.name}</div>
                      <input
                        type="number"
                        value={payoffs[node.id] || node.id}
                        onChange={(event) => handleInputChange(node.id, parseInt(event.target.value))}
                      />
                </div>
              );              
        } else {
            return (
                <div className="node" key={node.id}>
                  <div className="internal-node">{node.name + " | " + node.owner}</div>
                    {node.children.map((child) => (
                        renderTree(child)
                    ))}
                </div>
              );
              
        }
      };
  
    return (
      <div className='tree'>
        {renderTree(tree)}
      </div>
    );
};
  

const AddPlayerButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}>Add Player</button>
);

const EditableGameTree = () => {
  const [tree, setTree] = useState<Node>(initialTree);
  const [numPlayers, setNumPlayers] = useState<number>(1);
  const [numNodes, setNumNodes] = useState<number>(3);
  const numNodesRef = useRef(numNodes);



  function updateLeaf(node: Node, owner: string): void {
    if (node.children.length === 0) {
      // This is a leaf node, update its owner and children
        node.owner = owner;
        node.children = createNewChildren();
    } else {
        // Traverse the children and update their owners
        node.children.forEach(child => {
            updateLeaf(child, owner);
      });
    }
  }

  const createNewChildren = () => {
    const newChildren = [
        {
        id: numNodesRef.current + 1,
        owner: '',
        name: `Up`,
        children: []
        },
        {
        id: numNodesRef.current + 2,
        owner: '',
        name: `Down`,
        children: [] //Note: A leaf node cannot have an owner
        }
    ]
    numNodesRef.current += 2; // will be used again in the next call to createNewChildren
    return newChildren 
  }

  const addPlayer = () => {
    const playerName =  `Player ${numPlayers + 1}`
    setNumPlayers(numPlayers + 1)

    setNumNodes(numNodes + 2)
    // To add a new player, we change the owner of all leaf nodes to playerName and add set their children to newChildren
    // create copy of tree
    const newTree = deepCopyTree(tree)
    // change owner and children
    updateLeaf(newTree, playerName)
    setTree(newTree)
  };
  

  return (
    <div>
      <GameTree tree={tree} />
      <AddPlayerButton onClick={addPlayer} />
    </div>
  );
};

export default EditableGameTree;
