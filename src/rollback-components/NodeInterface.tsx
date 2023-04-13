interface Node {
    id: number;
    parent: number | null;
    owner: number ; // The index of the player who 'owns' this node
    name: string;
    children: Node[];
    payoffs: number[];
    isLeaf:boolean
}

export type { Node }