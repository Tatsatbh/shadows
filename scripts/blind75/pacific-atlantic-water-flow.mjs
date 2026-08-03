import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

// Every cell the same height: water flows freely, so all 2500 cells qualify.
const flat = Array.from({ length: 50 }, () => `[${Array(50).fill(1).join(',')}]`).join(',')

export default {
  question_number: 56,
  title: 'Pacific Atlantic Water Flow',
  difficulty: 'Medium',
  question_uri: 'pacific-atlantic-water-flow',
  summary: 'Find the cells from which rain can drain to both the Pacific and the Atlantic.',

  description_md: `There is an \`m x n\` rectangular island bordered by the **Pacific Ocean** along its top and left edges, and the **Atlantic Ocean** along its bottom and right edges.

The island is partitioned into square cells, and \`heights[r][c]\` gives the height above sea level of the cell at \`(r, c)\`.

Rain water flows from a cell to a neighbouring cell **north, south, east or west** only if the neighbour's height is **less than or equal to** the current cell's height. Water can always flow into an ocean from a cell adjacent to it.

Return every cell from which rain water can reach **both** oceans.

Working backwards from each ocean's border is far cheaper than searching forwards from every cell.

### Output format

Print the number of cells on the first line, then one \`row col\` pair per line. The driver sorts the coordinates for you, so any order is accepted.

---

**Example 1**
\`\`\`text
Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
Output:
7
0 4
1 3
1 4
2 2
3 0
3 1
4 0
\`\`\`

**Example 2**
\`\`\`text
Input: heights = [[1]]
Output:
1
0 0
Explanation: The single cell touches both oceans.
\`\`\`

**Example 3**
\`\`\`text
Input: heights = [[1,2],[4,3]]
Output:
4
0 0
0 1
1 0
1 1
\`\`\`

## Constraints

- \`1 <= m, n <= 200\`
- \`0 <= heights[r][c] <= 10^5\`
- Flow is allowed onto equal-height neighbours, not only strictly lower ones.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)`,
      code: `class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _heights = _pmatrix(_ls[0] if len(_ls) > 0 else "")
    _res = Solution().pacificAtlantic(_heights) or []
    _canon = sorted([int(_c[0]), int(_c[1])] for _c in _res)
    print(len(_canon))
    for _c in _canon:
        print(str(_c[0]) + " " + str(_c[1]))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_MATRIX}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<vector<int> > heights = _pmatrix(ls[0]);

    Solution sol;
    vector<vector<int> > res = sol.pacificAtlantic(heights);
    sort(res.begin(), res.end());

    cout << res.size() << "\\n";
    for (size_t i = 0; i < res.size(); i++) {
        cout << res[i][0] << " " << res[i][1] << "\\n";
    }
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        if not heights or not heights[0]:
            return []
        rows, cols = len(heights), len(heights[0])

        def flood(starts):
            seen = set(starts)
            stack = list(starts)
            while stack:
                r, c = stack.pop()
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in seen:
                        if heights[nr][nc] >= heights[r][c]:
                            seen.add((nr, nc))
                            stack.append((nr, nc))
            return seen

        pacific = [(0, c) for c in range(cols)] + [(r, 0) for r in range(rows)]
        atlantic = [(rows - 1, c) for c in range(cols)] + [(r, cols - 1) for r in range(rows)]
        both = flood(pacific) & flood(atlantic)
        return [[r, c] for r, c in both]`,
    cpp: `class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        vector<vector<int> > out;
        if (heights.empty() || heights[0].empty()) return out;
        rows = (int)heights.size();
        cols = (int)heights[0].size();

        vector<vector<char> > pac(rows, vector<char>(cols, 0));
        vector<vector<char> > atl(rows, vector<char>(cols, 0));

        vector<pair<int, int> > pStart, aStart;
        for (int c = 0; c < cols; c++) { pStart.push_back(make_pair(0, c)); aStart.push_back(make_pair(rows - 1, c)); }
        for (int r = 0; r < rows; r++) { pStart.push_back(make_pair(r, 0)); aStart.push_back(make_pair(r, cols - 1)); }

        flood(heights, pac, pStart);
        flood(heights, atl, aStart);

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (pac[r][c] && atl[r][c]) {
                    vector<int> cell;
                    cell.push_back(r);
                    cell.push_back(c);
                    out.push_back(cell);
                }
            }
        }
        return out;
    }

private:
    int rows, cols;

    void flood(vector<vector<int> >& heights, vector<vector<char> >& seen,
               vector<pair<int, int> > starts) {
        int dr[4] = {1, -1, 0, 0};
        int dc[4] = {0, 0, 1, -1};
        vector<pair<int, int> > stack;
        for (size_t i = 0; i < starts.size(); i++) {
            seen[starts[i].first][starts[i].second] = 1;
            stack.push_back(starts[i]);
        }
        while (!stack.empty()) {
            pair<int, int> cur = stack.back();
            stack.pop_back();
            for (int d = 0; d < 4; d++) {
                int nr = cur.first + dr[d], nc = cur.second + dc[d];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                if (seen[nr][nc]) continue;
                if (heights[nr][nc] < heights[cur.first][cur.second]) continue;
                seen[nr][nc] = 1;
                stack.push_back(make_pair(nr, nc));
            }
        }
    }
};`,
  },

  // Returns only the border cells.
  wrong: {
    python: `class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        if not heights or not heights[0]:
            return []
        rows, cols = len(heights), len(heights[0])
        out = []
        for r in range(rows):
            for c in range(cols):
                if r == 0 or c == 0 or r == rows - 1 or c == cols - 1:
                    out.append([r, c])
        return out`,
    cpp: `class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        vector<vector<int> > out;
        if (heights.empty() || heights[0].empty()) return out;
        int rows = (int)heights.size(), cols = (int)heights[0].size();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (r == 0 || c == 0 || r == rows - 1 || c == cols - 1) {
                    vector<int> cell;
                    cell.push_back(r);
                    cell.push_back(c);
                    out.push_back(cell);
                }
            }
        }
        return out;
    }
};`,
  },

  visible: [
    'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
    'heights = [[1]]',
    'heights = [[1,2],[4,3]]',
    'heights = [[2,1],[1,2]]',
  ],

  hidden: [
    'heights = [[1,1],[1,1]]',
    'heights = [[3,3,3],[3,1,3],[3,3,3]]',
    'heights = [[1,2,3],[8,9,4],[7,6,5]]',
    'heights = [[10,10,10],[10,1,10],[10,10,10]]',
    'heights = [[1,2,3,4]]',
    'heights = [[4],[3],[2],[1]]',
    'heights = [[5,4,3],[4,3,2],[3,2,1]]',
    `heights = [${flat}]`,
  ],
}
