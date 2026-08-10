import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

// 60x60 checkerboard: every '1' is isolated, so the count is exactly half the cells.
const board = Array.from(
  { length: 60 },
  (_, r) => `[${Array.from({ length: 60 }, (_, c) => ((r + c) % 2 === 0 ? '"1"' : '"0"')).join(',')}]`
).join(',')

export default {
  question_number: 57,
  title: 'Number of Islands',
  difficulty: 'Medium',
  question_uri: 'number-of-islands',
  summary: 'Count connected groups of land cells in a grid of water and land.',

  description_md: `Given an \`m x n\` 2D binary grid which represents a map of \`"1"\` (land) and \`"0"\` (water), return the **number of islands**.

An island is surrounded by water and is formed by connecting adjacent lands **horizontally or vertically**. Diagonals do not connect. You may assume all four edges of the grid are surrounded by water.

---

**Example 1**
\`\`\`text
Input: grid = [["1","1","0"],["1","1","0"],["0","0","1"]]
Output: 2
Explanation: The 2x2 block of land is one island, the lone corner cell is another.
\`\`\`

**Example 2**
\`\`\`text
Input: grid = [["1","1","1"],["1","1","1"]]
Output: 1
\`\`\`

**Example 3**
\`\`\`text
Input: grid = [["0","0"],["0","0"]]
Output: 0
\`\`\`

## Constraints

- \`1 <= m, n <= 300\`
- \`grid[i][j]\` is \`"0"\` or \`"1"\`.
- Cells touching only at a corner are **not** connected.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)`,
      code: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _grid = _pstrmatrix(_ls[0] if len(_ls) > 0 else "")
    print(Solution().numIslands(_grid))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_MATRIX}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<vector<string> > raw = _pstrmatrix(ls[0]);
    vector<vector<char> > grid;
    for (size_t i = 0; i < raw.size(); i++) {
        vector<char> row;
        for (size_t j = 0; j < raw[i].size(); j++) {
            row.push_back(raw[i][j].empty() ? '0' : raw[i][j][0]);
        }
        grid.push_back(row);
    }

    Solution sol;
    cout << sol.numIslands(grid) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid or not grid[0]:
            return 0
        rows, cols = len(grid), len(grid[0])
        count = 0
        for i in range(rows):
            for j in range(cols):
                if grid[i][j] != "1":
                    continue
                count += 1
                stack = [(i, j)]
                grid[i][j] = "0"
                while stack:
                    r, c = stack.pop()
                    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "1":
                            grid[nr][nc] = "0"
                            stack.append((nr, nc))
        return count`,
    cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        int rows = (int)grid.size(), cols = (int)grid[0].size();
        int count = 0;
        int dr[4] = {1, -1, 0, 0};
        int dc[4] = {0, 0, 1, -1};
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] != '1') continue;
                count++;
                vector<pair<int, int> > stack;
                stack.push_back(make_pair(i, j));
                grid[i][j] = '0';
                while (!stack.empty()) {
                    pair<int, int> cur = stack.back();
                    stack.pop_back();
                    for (int d = 0; d < 4; d++) {
                        int nr = cur.first + dr[d], nc = cur.second + dc[d];
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == '1') {
                            grid[nr][nc] = '0';
                            stack.push_back(make_pair(nr, nc));
                        }
                    }
                }
            }
        }
        return count;
    }
};`,
  },

  // Counts land cells instead of connected groups.
  wrong: {
    python: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        return sum(1 for row in grid for v in row if v == "1")`,
    cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (size_t i = 0; i < grid.size(); i++)
            for (size_t j = 0; j < grid[i].size(); j++)
                if (grid[i][j] == '1') count++;
        return count;
    }
};`,
  },

  visible: [
    'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
    'grid = [["1","1","1"],["1","1","1"]]',
    'grid = [["0","0"],["0","0"]]',
    'grid = [["1"]]',
  ],

  hidden: [
    'grid = [["0"]]',
    'grid = [["1","0","1"]]',
    'grid = [["1"],["0"],["1"]]',
    'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
    'grid = [["1","0","0","0"],["0","1","0","0"],["0","0","1","0"],["0","0","0","1"]]',
    'grid = [["1","1"],["0","1"]]',
    'grid = [["0","1","0"],["1","0","1"],["0","1","0"]]',
    `grid = [${board}]`,
  ],
}
