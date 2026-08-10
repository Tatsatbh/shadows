import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

// 2000 disjoint pairs over 4000 nodes: exactly 2000 components.
const pairs = Array.from({ length: 2000 }, (_, i) => `[${i * 2},${i * 2 + 1}]`).join(',')

export default {
  question_number: 61,
  title: 'Number of Connected Components in an Undirected Graph',
  difficulty: 'Medium',
  question_uri: 'number-of-connected-components',
  summary: 'Count how many separate pieces an undirected graph breaks into.',

  description_md: `You have a graph of \`n\` nodes labelled from \`0\` to \`n - 1\`. Given \`n\` and a list of undirected \`edges\`, return the **number of connected components** in the graph.

An isolated node with no edges is a component of its own.

Union-find or a DFS from every unvisited node both work.

---

**Example 1**
\`\`\`text
Input: n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2
\`\`\`

**Example 2**
\`\`\`text
Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
Output: 1
\`\`\`

**Example 3**
\`\`\`text
Input: n = 4, edges = []
Output: 4
Explanation: Every node is its own component.
\`\`\`

## Constraints

- \`1 <= n <= 2000\`
- \`0 <= edges.length <= 5000\`
- No duplicate edges and no self-loops.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _n = _pint(_ls[0] if len(_ls) > 0 else "0")
    _edges = _pmatrix(_ls[1] if len(_ls) > 1 else "")
    print(Solution().countComponents(_n, _edges))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int countComponents(int n, vector<vector<int>>& edges) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_MATRIX}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    int n = _pint(ls[0]);
    vector<vector<int> > edges = _pmatrix(ls[1]);

    Solution sol;
    cout << sol.countComponents(n, edges) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        parent = list(range(n))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        components = n
        for a, b in edges:
            ra, rb = find(a), find(b)
            if ra != rb:
                parent[ra] = rb
                components -= 1
        return components`,
    cpp: `class Solution {
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        parent.resize(n);
        for (int i = 0; i < n; i++) parent[i] = i;
        int components = n;
        for (size_t i = 0; i < edges.size(); i++) {
            int ra = find(edges[i][0]), rb = find(edges[i][1]);
            if (ra != rb) { parent[ra] = rb; components--; }
        }
        return components;
    }

private:
    vector<int> parent;

    int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }
};`,
  },

  // Subtracts one per edge without checking whether it actually joins two pieces.
  wrong: {
    python: `class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        return n - len(edges)`,
    cpp: `class Solution {
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        return n - (int)edges.size();
    }
};`,
  },

  visible: [
    'n = 5\nedges = [[0,1],[1,2],[3,4]]',
    'n = 5\nedges = [[0,1],[1,2],[2,3],[3,4]]',
    'n = 4\nedges = []',
    'n = 1\nedges = []',
  ],

  hidden: [
    'n = 3\nedges = [[0,1],[1,2],[2,0]]',
    'n = 2\nedges = [[0,1]]',
    'n = 6\nedges = [[0,1],[2,3],[4,5]]',
    'n = 6\nedges = [[0,1],[1,2],[2,0],[3,4]]',
    'n = 10\nedges = [[0,1],[2,3],[4,5],[6,7],[8,9]]',
    'n = 4\nedges = [[0,1],[1,2],[0,2],[2,3]]',
    'n = 8\nedges = [[0,1],[1,2],[2,3],[3,0],[4,5]]',
    `n = 4000\nedges = [${pairs}]`,
  ],
}
