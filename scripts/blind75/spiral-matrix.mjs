import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

const big = Array.from({ length: 60 }, (_, r) =>
  `[${Array.from({ length: 60 }, (_, c) => r * 60 + c).join(',')}]`
).join(',')

export default {
  question_number: 46,
  title: 'Spiral Matrix',
  difficulty: 'Medium',
  question_uri: 'spiral-matrix',
  summary: 'Read every element of a matrix in clockwise spiral order.',

  description_md: `Given an \`m x n\` matrix, return all elements of the matrix in **spiral order** — left to right along the top, down the right side, right to left along the bottom, up the left side, then inward.

### Output format

Print the number of elements on the first line, then all values space-separated on the second line.

---

**Example 1**
\`\`\`text
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output:
9
1 2 3 6 9 8 7 4 5
\`\`\`

**Example 2**
\`\`\`text
Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output:
12
1 2 3 4 8 12 11 10 9 5 6 7
\`\`\`

**Example 3**
\`\`\`text
Input: matrix = [[7]]
Output:
1
7
\`\`\`

## Constraints

- \`1 <= m, n <= 100\`
- \`-100 <= matrix[i][j] <= 100\`
- Single rows and single columns must not be traversed twice.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _matrix = _pmatrix(_ls[0] if len(_ls) > 0 else "")
    _res = Solution().spiralOrder(_matrix) or []
    print(len(_res))
    if _res:
        print(" ".join(str(int(v)) for v in _res))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {

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
    vector<int> res = sol.spiralOrder(matrix);
    cout << res.size() << "\\n";
    if (!res.empty()) {
        for (size_t i = 0; i < res.size(); i++) {
            if (i) cout << " ";
            cout << res[i];
        }
        cout << "\\n";
    }
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        if not matrix or not matrix[0]:
            return []
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1
        out = []
        while top <= bottom and left <= right:
            for j in range(left, right + 1):
                out.append(matrix[top][j])
            top += 1
            for i in range(top, bottom + 1):
                out.append(matrix[i][right])
            right -= 1
            if top <= bottom:
                for j in range(right, left - 1, -1):
                    out.append(matrix[bottom][j])
                bottom -= 1
            if left <= right:
                for i in range(bottom, top - 1, -1):
                    out.append(matrix[i][left])
                left += 1
        return out`,
    cpp: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> out;
        if (matrix.empty() || matrix[0].empty()) return out;
        int top = 0, bottom = (int)matrix.size() - 1;
        int left = 0, right = (int)matrix[0].size() - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) out.push_back(matrix[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) out.push_back(matrix[i][right]);
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) out.push_back(matrix[bottom][j]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) out.push_back(matrix[i][left]);
                left++;
            }
        }
        return out;
    }
};`,
  },

  // Omits the guards, so a single remaining row or column is walked twice.
  wrong: {
    python: `class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        if not matrix or not matrix[0]:
            return []
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1
        out = []
        while top <= bottom and left <= right:
            for j in range(left, right + 1):
                out.append(matrix[top][j])
            top += 1
            for i in range(top, bottom + 1):
                out.append(matrix[i][right])
            right -= 1
            for j in range(right, left - 1, -1):
                out.append(matrix[bottom][j])
            bottom -= 1
            for i in range(bottom, top - 1, -1):
                out.append(matrix[i][left])
            left += 1
        return out`,
    cpp: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> out;
        if (matrix.empty() || matrix[0].empty()) return out;
        int top = 0, bottom = (int)matrix.size() - 1;
        int left = 0, right = (int)matrix[0].size() - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) out.push_back(matrix[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) out.push_back(matrix[i][right]);
            right--;
            for (int j = right; j >= left; j--) out.push_back(matrix[bottom][j]);
            bottom--;
            for (int i = bottom; i >= top; i--) out.push_back(matrix[i][left]);
            left++;
        }
        return out;
    }
};`,
  },

  visible: [
    'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
    'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]',
    'matrix = [[7]]',
    'matrix = [[1,2],[3,4]]',
  ],

  hidden: [
    'matrix = [[1,2,3]]',
    'matrix = [[1],[2],[3]]',
    'matrix = [[1,2],[3,4],[5,6]]',
    'matrix = [[1,2,3],[4,5,6]]',
    'matrix = [[-1,-2],[-3,-4]]',
    'matrix = [[1,2,3,4,5]]',
    'matrix = [[1,2,3],[4,5,6],[7,8,9],[10,11,12]]',
    `matrix = [${big}]`,
  ],
}
