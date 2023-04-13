interface Node {
    id: number;
    owner: number ; // The index of the player who 'owns' this node
    name: string;
    children: Node[];
    payoffs: number[];
    isLeaf:boolean
}

export type { Node }