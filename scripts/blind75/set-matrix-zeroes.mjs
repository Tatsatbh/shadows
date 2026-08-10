import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

const big = Array.from({ length: 100 }, (_, r) =>
  `[${Array.from({ length: 100 }, (_, c) => ((r * 100 + c) % 37 === 0 ? 0 : ((r + c) % 9) + 1)).join(',')}]`
).join(',')

export default {
  question_number: 45,
  title: 'Set Matrix Zeroes',
  difficulty: 'Medium',
  question_uri: 'set-matrix-zeroes',
  summary: 'Wherever the matrix holds a zero, blank out that entire row and column, in place.',

  description_md: `Given an \`m x n\` integer matrix, if an element is \`0\`, set its **entire row and column** to \`0\`. You must do it **in place**.

The trap is doing it naively: if you zero a row as you scan, the zeros you just wrote will be mistaken for original zeros. Record what needs clearing first, or use the first row and column as your marker storage for the O(1) space solution.

### Output format

Print the number of rows on the first line, then each row as space-separated values.

---

**Example 1**
\`\`\`text
Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output:
3
1 0 1
0 0 0
1 0 1
\`\`\`

**Example 2**
\`\`\`text
Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
Output:
3
0 0 0 0
0 4 5 0
0 3 1 0
\`\`\`

**Example 3**
\`\`\`text
Input: matrix = [[1,2],[3,4]]
Output:
2
1 2
3 4
Explanation: No zeros, so nothing changes.
\`\`\`

## Constraints

- \`1 <= m, n <= 200\`
- \`-2^31 <= matrix[i][j] <= 2^31 - 1\``,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        """Modify matrix in-place instead of returning it."""
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _matrix = _pmatrix(_ls[0] if len(_ls) > 0 else "")
    Solution().setZeroes(_matrix)
    print(len(_matrix))
    for _row in _matrix:
        print(" ".join(str(int(v)) for v in _row))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_MATRIX}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<vector<int> > matrix = _pmatrix(ls[0]);

    Solution sol;
    sol.setZeroes(matrix);

    cout << matrix.size() << "\\n";
    for (size_t i = 0; i < matrix.size(); i++) {
        for (size_t j = 0; j < matrix[i].size(); j++) {
            if (j) cout << " ";
            cout << matrix[i][j];
        }
        cout << "\\n";
    }
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        rows = set()
        cols = set()
        for i, row in enumerate(matrix):
            for j, v in enumerate(row):
                if v == 0:
                    rows.add(i)
                    cols.add(j)
        for i, row in enumerate(matrix):
            for j in range(len(row)):
                if i in rows or j in cols:
                    row[j] = 0`,
    cpp: `class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        set<int> rows, cols;
        for (size_t i = 0; i < matrix.size(); i++) {
            for (size_t j = 0; j < matrix[i].size(); j++) {
                if (matrix[i][j] == 0) { rows.insert((int)i); cols.insert((int)j); }
            }
        }
        for (size_t i = 0; i < matrix.size(); i++) {
            for (size_t j = 0; j < matrix[i].size(); j++) {
                if (rows.count((int)i) || cols.count((int)j)) matrix[i][j] = 0;
            }
        }
    }
};`,
  },

  // Clears as it scans, so written zeros cascade.
  wrong: {
    python: `class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        for i in range(len(matrix)):
            for j in range(len(matrix[i])):
                if matrix[i][j] == 0:
                    for k in range(len(matrix[i])):
                        matrix[i][k] = 0
                    for k in range(len(matrix)):
                        matrix[k][j] = 0`,
    cpp: `class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        for (size_t i = 0; i < matrix.size(); i++) {
            for (size_t j = 0; j < matrix[i].size(); j++) {
                if (matrix[i][j] == 0) {
                    for (size_t k = 0; k < matrix[i].size(); k++) matrix[i][k] = 0;
                    for (size_t k = 0; k < matrix.size(); k++) matrix[k][j] = 0;
                }
            }
        }
    }
};`,
  },

  visible: [
    'matrix = [[1,1,1],[1,0,1],[1,1,1]]',
    'matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]',
    'matrix = [[1,2],[3,4]]',
    'matrix = [[0]]',
  ],

  hidden: [
    'matrix = [[1]]',
    'matrix = [[1,0]]',
    'matrix = [[0],[1]]',
    'matrix = [[1,1],[0,1]]',
    'matrix = [[-1,0,1],[2,3,4],[5,6,7]]',
    'matrix = [[1,2,3],[4,0,6],[7,8,9]]',
    'matrix = [[0,0],[0,0]]',
    `matrix = [${big}]`,
  ],
}
