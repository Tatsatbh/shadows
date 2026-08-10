import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

// A 200-node cycle: node i neighbours i-1 and i+1, wrapping around.
const ring = Array.from(
  { length: 200 },
  (_, i) => `[${((i + 199) % 200) + 1},${((i + 1) % 200) + 1}]`
).join(',')

export default {
  question_number: 54,
  title: 'Clone Graph',
  difficulty: 'Medium',
  question_uri: 'clone-graph',
  summary: 'Produce a deep copy of a connected undirected graph.',

  description_md: `Given a reference to a node in a **connected** undirected graph, return a **deep copy** of the graph.

Each node contains a value and a list of its neighbours:

\`\`\`text
class Node {
    public int val;
    public List<Node> neighbors;
}
\`\`\`

Every node in the returned graph must be a **new object**. Returning the original nodes, or mixing new and original nodes, is incorrect.

### Input format

The graph is given as an adjacency list, where \`adjList[i]\` holds the neighbours of the node with value \`i + 1\`. An empty list means an empty graph.

### How the deep copy is checked

After your function returns, the driver **mutates the original graph** (negating every original node's value) and only then serialises your clone. A shallow copy will therefore print negated values and fail.

### Output format

Print the number of nodes on the first line, then one line per node in ascending value order: the node's value followed by its neighbours' values in ascending order.

---

**Example 1**
\`\`\`text
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output:
4
1 2 4
2 1 3
3 2 4
4 1 3
\`\`\`

**Example 2**
\`\`\`text
Input: adjList = [[]]
Output:
1
1
Explanation: One node with no neighbours.
\`\`\`

**Example 3**
\`\`\`text
Input: adjList = []
Output:
0
Explanation: The graph is empty, so the clone is null.
\`\`\`

## Constraints

- The number of nodes is in the range \`[0, 100]\`.
- \`1 <= Node.val <= 100\` and node values are unique.
- The graph is connected, undirected, and has no repeated edges or self-loops.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


# Definition for a Node.
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []`,
      code: `class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _adj = _pmatrix(_ls[0] if len(_ls) > 0 else "")

    _nodes = [Node(i + 1) for i in range(len(_adj))]
    for _i, _row in enumerate(_adj):
        _nodes[_i].neighbors = [_nodes[_v - 1] for _v in _row]

    _start = _nodes[0] if _nodes else None
    _clone = Solution().cloneGraph(_start)

    # Mutate the originals so that any shared node shows up in the output.
    for _n in _nodes:
        _n.val = -_n.val

    _seen = {}
    if _clone is not None:
        _stack = [_clone]
        while _stack:
            _cur = _stack.pop()
            if id(_cur) in _seen:
                continue
            _seen[id(_cur)] = _cur
            for _nb in (_cur.neighbors or []):
                if id(_nb) not in _seen:
                    _stack.append(_nb)

    _out = sorted(_seen.values(), key=lambda x: x.val)
    print(len(_out))
    for _n in _out:
        _vals = sorted(nb.val for nb in (_n.neighbors or []))
        print(" ".join([str(_n.val)] + [str(v) for v in _vals]))
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

// Definition for a Node.
class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() { val = 0; }
    Node(int _val) { val = _val; }
    Node(int _val, vector<Node*> _neighbors) { val = _val; neighbors = _neighbors; }
};`,
      code: `class Solution {
public:
    Node* cloneGraph(Node* node) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_MATRIX}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<vector<int> > adj = _pmatrix(ls[0]);

    vector<Node*> nodes;
    for (size_t i = 0; i < adj.size(); i++) nodes.push_back(new Node((int)i + 1));
    for (size_t i = 0; i < adj.size(); i++) {
        for (size_t j = 0; j < adj[i].size(); j++) {
            nodes[i]->neighbors.push_back(nodes[adj[i][j] - 1]);
        }
    }

    Node* start = nodes.empty() ? NULL : nodes[0];
    Solution sol;
    Node* clone = sol.cloneGraph(start);

    // Mutate the originals so that any shared node shows up in the output.
    for (size_t i = 0; i < nodes.size(); i++) nodes[i]->val = -nodes[i]->val;

    set<Node*> seen;
    vector<Node*> order;
    if (clone != NULL) {
        vector<Node*> stack;
        stack.push_back(clone);
        while (!stack.empty()) {
            Node* cur = stack.back();
            stack.pop_back();
            if (seen.count(cur)) continue;
            seen.insert(cur);
            order.push_back(cur);
            for (size_t i = 0; i < cur->neighbors.size(); i++) {
                if (!seen.count(cur->neighbors[i])) stack.push_back(cur->neighbors[i]);
            }
        }
    }

    sort(order.begin(), order.end(), [](Node* a, Node* b) { return a->val < b->val; });
    cout << order.size() << "\\n";
    for (size_t i = 0; i < order.size(); i++) {
        vector<int> vals;
        for (size_t j = 0; j < order[i]->neighbors.size(); j++) {
            vals.push_back(order[i]->neighbors[j]->val);
        }
        sort(vals.begin(), vals.end());
        cout << order[i]->val;
        for (size_t j = 0; j < vals.size(); j++) cout << " " << vals[j];
        cout << "\\n";
    }
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        if node is None:
            return None
        mapping = {}
        mapping[node] = Node(node.val)
        stack = [node]
        while stack:
            cur = stack.pop()
            for nb in cur.neighbors:
                if nb not in mapping:
                    mapping[nb] = Node(nb.val)
                    stack.append(nb)
                mapping[cur].neighbors.append(mapping[nb])
        return mapping[node]`,
    cpp: `class Solution {
public:
    Node* cloneGraph(Node* node) {
        if (node == NULL) return NULL;
        map<Node*, Node*> mapping;
        mapping[node] = new Node(node->val);
        vector<Node*> stack;
        stack.push_back(node);
        while (!stack.empty()) {
            Node* cur = stack.back();
            stack.pop_back();
            for (size_t i = 0; i < cur->neighbors.size(); i++) {
                Node* nb = cur->neighbors[i];
                if (mapping.find(nb) == mapping.end()) {
                    mapping[nb] = new Node(nb->val);
                    stack.push_back(nb);
                }
                mapping[cur]->neighbors.push_back(mapping[nb]);
            }
        }
        return mapping[node];
    }
};`,
  },

  // Returns the original graph — the shallow copy the driver is designed to catch.
  wrong: {
    python: `class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        return node`,
    cpp: `class Solution {
public:
    Node* cloneGraph(Node* node) {
        return node;
    }
};`,
  },

  visible: [
    'adjList = [[2,4],[1,3],[2,4],[1,3]]',
    'adjList = [[]]',
    'adjList = []',
    'adjList = [[2],[1]]',
  ],

  hidden: [
    'adjList = [[2,3],[1,3],[1,2]]',
    'adjList = [[2],[1,3],[2,4],[3]]',
    'adjList = [[2,3,4],[1],[1],[1]]',
    'adjList = [[2],[1,3],[2]]',
    'adjList = [[2,5],[1,3],[2,4],[3,5],[1,4]]',
    'adjList = [[2,3],[1,4],[1,4],[2,3]]',
    'adjList = [[2],[1,3],[2,4],[3,5],[4,6],[5]]',
    `adjList = [${ring}]`,
  ],
}
