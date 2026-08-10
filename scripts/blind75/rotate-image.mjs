import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

const big = Array.from({ length: 20 }, (_, r) =>
  `[${Array.from({ length: 20 }, (_, c) => r * 20 + c).join(',')}]`
).join(',')

export default {
  question_number: 47,
  title: 'Rotate Image',
  difficulty: 'Medium',
  question_uri: 'rotate-image',
  summary: 'Rotate a square matrix 90 degrees clockwise, in place.',

  description_md: `You are given an \`n x n\` 2D \`matrix\` representing an image. Rotate the image by **90 degrees clockwise**, **in place** — you must not allocate another 2D matrix.

Transposing and then reversing each row is the neat trick.

### Output format

Print the number of rows on the first line, then each row as space-separated values.

---

**Example 1**
\`\`\`text
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output:
3
7 4 1
8 5 2
9 6 3
\`\`\`

**Example 2**
\`\`\`text
Input: matrix = [[1,2],[3,4]]
Output:
2
3 1
4 2
\`\`\`

**Example 3**
\`\`\`text
Input: matrix = [[1]]
Output:
1
1
\`\`\`

## Constraints

- \`n == matrix.length == matrix[i].length\`
- \`1 <= n <= 20\`
- \`-1000 <= matrix[i][j] <= 1000\``,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        """Modify matrix in-place instead of returning it."""
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _matrix = _pmatrix(_ls[0] if len(_ls) > 0 else "")
    Solution().rotate(_matrix)
    print(len(_matrix))
    for _row in _matrix:
        print(" ".join(str(int(v)) for v in _row))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {

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
    sol.rotate(matrix);

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
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        for row in matrix:
            row.reverse()`,
    cpp: `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = (int)matrix.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) swap(matrix[i][j], matrix[j][i]);
        }
        for (int i = 0; i < n; i++) reverse(matrix[i].begin(), matrix[i].end());
    }
};`,
  },

  // Transposes only — a 90-degree rotation about the wrong axis.
  wrong: {
    python: `class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]`,
    cpp: `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = (int)matrix.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) swap(matrix[i][j], matrix[j][i]);
        }
    }
};`,
  },

  visible: [
    'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
    'matrix = [[1,2],[3,4]]',
    'matrix = [[1]]',
    'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]',
  ],

  hidden: [
    'matrix = [[0,0],[0,0]]',
    'matrix = [[-1,-2],[-3,-4]]',
    'matrix = [[1,2,3],[4,5,6],[7,8,10]]',
    'matrix = [[1,1],[1,1]]',
    'matrix = [[2,29,20,26,16,28],[12,27,9,25,13,21],[32,33,32,2,28,14],[13,14,32,27,22,26],[33,1,20,7,21,7],[4,24,1,6,32,34]]',
    'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]',
    'matrix = [[-1000,1000],[1000,-1000]]',
    `matrix = [${big}]`,
  ],
}
