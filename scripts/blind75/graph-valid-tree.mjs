import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

// A path graph on 1000 nodes: connected and acyclic, so a valid tree.
// Deliberately kept modest. A path is the worst case for a union-find without
// union-by-rank, which degenerates to O(n^2); at 5000 nodes that is 25M
// operations and times out in Python while passing in C++. 1000 keeps a
// straightforward candidate solution comfortably inside the limit.
const chain = Array.from({ length: 999 }, (_, i) => `[${i},${i + 1}]`).join(',')

export default {
  question_number: 60,
  title: 'Graph Valid Tree',
  difficulty: 'Medium',
  question_uri: 'graph-valid-tree',
  summary: 'Check whether an undirected graph is a tree: fully connected and free of cycles.',

  description_md: `You have a graph of \`n\` nodes labelled from \`0\` to \`n - 1\`. Given \`n\` and a list of undirected \`edges\`, where \`edges[i] = [a, b]\` indicates an edge between \`a\` and \`b\`, determine whether these edges make up a **valid tree**.

A valid tree is **connected** and **acyclic**. Both conditions matter: a graph can be acyclic but split into pieces, or connected but contain a loop.

A useful shortcut: a tree on \`n\` nodes has exactly \`n - 1\` edges, so check the edge count and then verify connectivity.

---

**Example 1**
\`\`\`text
Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
Output: true
\`\`\`

**Example 2**
\`\`\`text
Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]
Output: false
Explanation: The edges 1-2, 2-3 and 1-3 form a cycle.
\`\`\`

**Example 3**
\`\`\`text
Input: n = 4, edges = [[0,1],[2,3]]
Output: false
Explanation: Acyclic, but split into two components.
\`\`\`

## Constraints

- \`1 <= n <= 2000\`
- \`0 <= edges.length <= 5000\`
- No duplicate edges and no self-loops.
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _n = _pint(_ls[0] if len(_ls) > 0 else "0")
    _edges = _pmatrix(_ls[1] if len(_ls) > 1 else "")
    print("true" if Solution().validTree(_n, _edges) else "false")
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    bool validTree(int n, vector<vector<int>>& edges) {

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
    cout << (sol.validTree(n, edges) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        if len(edges) != n - 1:
            return False
        parent = list(range(n))
        size = [1] * n

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for a, b in edges:
            ra, rb = find(a), find(b)
            if ra == rb:
                return False
            # Union by size keeps the trees shallow; without it a path graph
            # degrades to O(n^2).
            if size[ra] > size[rb]:
                ra, rb = rb, ra
            parent[ra] = rb
            size[rb] += size[ra]
        return True`,
    cpp: `class Solution {
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if ((int)edges.size() != n - 1) return false;
        parent.resize(n);
        size.assign(n, 1);
        for (int i = 0; i < n; i++) parent[i] = i;
        for (size_t i = 0; i < edges.size(); i++) {
            int ra = find(edges[i][0]), rb = find(edges[i][1]);
            if (ra == rb) return false;
            if (size[ra] > size[rb]) swap(ra, rb);
            parent[ra] = rb;
            size[rb] += size[ra];
        }
        return true;
    }

private:
    vector<int> parent;
    vector<int> size;

    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
};`,
  },

  // Checks only for cycles, missing the connectivity requirement.
  wrong: {
    python: `class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        parent = list(range(n))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for a, b in edges:
            ra, rb = find(a), find(b)
            if ra == rb:
                return False
            parent[ra] = rb
        return True`,
    cpp: `class Solution {
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        parent.resize(n);
        for (int i = 0; i < n; i++) parent[i] = i;
        for (size_t i = 0; i < edges.size(); i++) {
            int ra = find(edges[i][0]), rb = find(edges[i][1]);
            if (ra == rb) return false;
            parent[ra] = rb;
        }
        return true;
    }

private:
    vector<int> parent;

    int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }
};`,
  },

  visible: [
    'n = 5\nedges = [[0,1],[0,2],[0,3],[1,4]]',
    'n = 5\nedges = [[0,1],[1,2],[2,3],[1,3],[1,4]]',
    'n = 4\nedges = [[0,1],[2,3]]',
    'n = 1\nedges = []',
  ],

  hidden: [
    'n = 2\nedges = []',
    'n = 2\nedges = [[0,1]]',
    'n = 3\nedges = [[0,1],[1,2],[2,0]]',
    'n = 4\nedges = [[0,1],[1,2],[2,3]]',
    'n = 6\nedges = [[0,1],[0,2],[0,3],[0,4],[0,5]]',
    'n = 3\nedges = [[0,1]]',
    'n = 4\nedges = [[0,1],[1,2],[2,3],[3,0]]',
    `n = 5000\nedges = [${chain}]`,
  ],
}
