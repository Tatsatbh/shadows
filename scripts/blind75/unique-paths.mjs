import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 39,
  title: 'Unique Paths',
  difficulty: 'Medium',
  question_uri: 'unique-paths',
  summary: 'Count the distinct routes across an m x n grid moving only right or down.',

  description_md: `A robot sits in the top-left corner of an \`m x n\` grid. It can only move **right** or **down** at any point in time, and it is trying to reach the bottom-right corner.

Return the number of distinct paths it can take.

---

**Example 1**
\`\`\`text
Input: m = 3, n = 7
Output: 28
\`\`\`

**Example 2**
\`\`\`text
Input: m = 3, n = 2
Output: 3
Explanation: Down->Down->Right, Down->Right->Down, Right->Down->Down.
\`\`\`

**Example 3**
\`\`\`text
Input: m = 1, n = 1
Output: 1
Explanation: The robot is already at the destination.
\`\`\`

## Constraints

- \`1 <= m, n <= 17\`
- The answer is guaranteed to fit in a signed 32-bit integer.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _m = _pint(_ls[0] if len(_ls) > 0 else "1")
    _n = _pint(_ls[1] if len(_ls) > 1 else "1")
    print(Solution().uniquePaths(_m, _n))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int uniquePaths(int m, int n) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    int m = _pint(ls[0]);
    int n = _pint(ls[1]);

    Solution sol;
    cout << sol.uniquePaths(m, n) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        row = [1] * n
        for _ in range(1, m):
            for j in range(1, n):
                row[j] += row[j - 1]
        return row[n - 1]`,
    cpp: `class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<long long> row(n, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) row[j] += row[j - 1];
        }
        return (int)row[n - 1];
    }
};`,
  },

  // Counts steps rather than paths.
  wrong: {
    python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        return m * n`,
    cpp: `class Solution {
public:
    int uniquePaths(int m, int n) {
        return m * n;
    }
};`,
  },

  visible: ['m = 3\nn = 7', 'm = 3\nn = 2', 'm = 1\nn = 1', 'm = 3\nn = 3'],

  hidden: [
    'm = 1\nn = 10',
    'm = 10\nn = 1',
    'm = 2\nn = 2',
    'm = 5\nn = 5',
    'm = 7\nn = 3',
    'm = 10\nn = 10',
    'm = 16\nn = 16',
    'm = 17\nn = 17',
  ],
}
