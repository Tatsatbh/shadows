import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

// A 2000-long dependency chain: satisfiable, but only in one order.
const chain = Array.from({ length: 1999 }, (_, i) => `[${i + 1},${i}]`).join(',')

export default {
  question_number: 55,
  title: 'Course Schedule',
  difficulty: 'Medium',
  question_uri: 'course-schedule',
  summary: 'Decide whether all courses can be finished given their prerequisite pairs.',

  description_md: `There are \`numCourses\` courses labelled \`0\` to \`numCourses - 1\`. You are given \`prerequisites\` where \`prerequisites[i] = [a, b]\` means you must take course \`b\` **before** course \`a\`.

Return \`true\` if you can finish all courses, and \`false\` otherwise.

This is cycle detection on a directed graph — the courses are finishable exactly when the dependency graph is acyclic. Kahn's algorithm or a DFS with three-colour marking both work.

---

**Example 1**
\`\`\`text
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: Take course 0, then course 1.
\`\`\`

**Example 2**
\`\`\`text
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: Each course requires the other.
\`\`\`

**Example 3**
\`\`\`text
Input: numCourses = 3, prerequisites = []
Output: true
\`\`\`

## Constraints

- \`1 <= numCourses <= 2000\`
- \`0 <= prerequisites.length <= 5000\`
- All prerequisite pairs are distinct.
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _n = _pint(_ls[0] if len(_ls) > 0 else "0")
    _prereqs = _pmatrix(_ls[1] if len(_ls) > 1 else "")
    print("true" if Solution().canFinish(_n, _prereqs) else "false")
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_MATRIX}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    int n = _pint(ls[0]);
    vector<vector<int> > prereqs = _pmatrix(ls[1]);

    Solution sol;
    cout << (sol.canFinish(n, prereqs) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for a, b in prerequisites:
            graph[b].append(a)
            indegree[a] += 1
        queue = [i for i in range(numCourses) if indegree[i] == 0]
        head = 0
        taken = 0
        while head < len(queue):
            node = queue[head]
            head += 1
            taken += 1
            for nxt in graph[node]:
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    queue.append(nxt)
        return taken == numCourses`,
    cpp: `class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int> > graph(numCourses);
        vector<int> indegree(numCourses, 0);
        for (size_t i = 0; i < prerequisites.size(); i++) {
            graph[prerequisites[i][1]].push_back(prerequisites[i][0]);
            indegree[prerequisites[i][0]]++;
        }
        vector<int> queue;
        for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) queue.push_back(i);
        size_t head = 0;
        int taken = 0;
        while (head < queue.size()) {
            int node = queue[head++];
            taken++;
            for (size_t i = 0; i < graph[node].size(); i++) {
                if (--indegree[graph[node][i]] == 0) queue.push_back(graph[node][i]);
            }
        }
        return taken == numCourses;
    }
};`,
  },

  // Only catches direct two-cycles, missing longer loops.
  wrong: {
    python: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        pairs = set()
        for a, b in prerequisites:
            if (b, a) in pairs:
                return False
            pairs.add((a, b))
        return True`,
    cpp: `class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        set<pair<int, int> > pairs;
        for (size_t i = 0; i < prerequisites.size(); i++) {
            int a = prerequisites[i][0], b = prerequisites[i][1];
            if (pairs.count(make_pair(b, a))) return false;
            pairs.insert(make_pair(a, b));
        }
        return true;
    }
};`,
  },

  visible: [
    'numCourses = 2\nprerequisites = [[1,0]]',
    'numCourses = 2\nprerequisites = [[1,0],[0,1]]',
    'numCourses = 3\nprerequisites = []',
    'numCourses = 1\nprerequisites = []',
  ],

  hidden: [
    'numCourses = 3\nprerequisites = [[1,0],[2,1],[0,2]]',
    'numCourses = 4\nprerequisites = [[1,0],[2,1],[3,2]]',
    'numCourses = 5\nprerequisites = [[1,4],[2,4],[3,1],[3,2]]',
    'numCourses = 3\nprerequisites = [[0,1],[0,2],[1,2]]',
    'numCourses = 4\nprerequisites = [[2,0],[1,0],[3,1],[3,2],[1,3]]',
    'numCourses = 2\nprerequisites = [[0,1]]',
    'numCourses = 6\nprerequisites = [[1,0],[2,1],[3,2],[4,3],[5,4],[0,5]]',
    `numCourses = 2000\nprerequisites = [${chain}]`,
  ],
}
