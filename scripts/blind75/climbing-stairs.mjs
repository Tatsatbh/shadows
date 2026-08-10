import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 10,
  title: 'Climbing Stairs',
  difficulty: 'Easy',
  question_uri: 'climbing-stairs',
  summary: 'Count the distinct ways to reach the top of n stairs taking 1 or 2 steps at a time.',

  description_md: `You are climbing a staircase that takes \`n\` steps to reach the top.

Each time you can climb either **1** or **2** steps. In how many distinct ways can you reach the top?

---

**Example 1**
\`\`\`text
Input: n = 2
Output: 2
Explanation: 1 + 1, or 2.
\`\`\`

**Example 2**
\`\`\`text
Input: n = 3
Output: 3
Explanation: 1 + 1 + 1, or 1 + 2, or 2 + 1.
\`\`\`

**Example 3**
\`\`\`text
Input: n = 5
Output: 8
\`\`\`

## Constraints

- \`1 <= n <= 45\`
- The answer always fits in a signed 32-bit integer.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def climbStairs(self, n: int) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _n = _pint(_ls[0] if len(_ls) > 0 else "0")
    print(Solution().climbStairs(_n))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int climbStairs(int n) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    int n = _pint(ls[0]);

    Solution sol;
    cout << sol.climbStairs(n) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def climbStairs(self, n: int) -> int:
        prev, curr = 1, 1
        for _ in range(n - 1):
            prev, curr = curr, prev + curr
        return curr`,
    cpp: `class Solution {
public:
    int climbStairs(int n) {
        long long prev = 1, curr = 1;
        for (int i = 1; i < n; i++) {
            long long next = prev + curr;
            prev = curr;
            curr = next;
        }
        return (int)curr;
    }
};`,
  },

  wrong: {
    python: `class Solution:
    def climbStairs(self, n: int) -> int:
        return n`,
    cpp: `class Solution {
public:
    int climbStairs(int n) {
        return n;
    }
};`,
  },

  visible: [
    'n = 2',
    'n = 3',
    'n = 1',
    'n = 5',
  ],

  hidden: [
    'n = 4',
    'n = 6',
    'n = 8',
    'n = 10',
    'n = 20',
    'n = 30',
    'n = 44',
    'n = 45',
  ],
}
