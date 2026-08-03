import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 24,
  title: 'Counting Bits',
  difficulty: 'Easy',
  question_uri: 'counting-bits',
  summary: 'For every number from 0 to n, count how many 1 bits it has.',

  description_md: `Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` where, for each \`i\` in the range \`[0, n]\`, \`ans[i]\` is the number of \`1\` bits in the binary representation of \`i\`.

Print the result as space-separated values on one line.

The interesting version of this problem runs in **O(n)** total time — each answer can be derived from a previously computed one.

---

**Example 1**
\`\`\`text
Input: n = 2
Output: 0 1 1
Explanation: 0 -> 0, 1 -> 1, 2 -> 10
\`\`\`

**Example 2**
\`\`\`text
Input: n = 5
Output: 0 1 1 2 1 2
\`\`\`

**Example 3**
\`\`\`text
Input: n = 0
Output: 0
\`\`\`

## Constraints

- \`0 <= n <= 10^5\``,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def countBits(self, n: int) -> List[int]:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _n = _pint(_ls[0] if len(_ls) > 0 else "0")
    _res = Solution().countBits(_n) or []
    print(" ".join(str(int(x)) for x in _res))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    vector<int> countBits(int n) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    int n = _pint(ls[0]);

    Solution sol;
    vector<int> res = sol.countBits(n);
    for (size_t i = 0; i < res.size(); i++) {
        if (i) cout << " ";
        cout << res[i];
    }
    cout << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def countBits(self, n: int) -> List[int]:
        ans = [0] * (n + 1)
        for i in range(1, n + 1):
            ans[i] = ans[i >> 1] + (i & 1)
        return ans`,
    cpp: `class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n + 1, 0);
        for (int i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
        return ans;
    }
};`,
  },

  // Off-by-one: returns n entries instead of n + 1.
  wrong: {
    python: `class Solution:
    def countBits(self, n: int) -> List[int]:
        return [bin(i).count("1") for i in range(n)]`,
    cpp: `class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans;
        for (int i = 0; i < n; i++) {
            int c = 0, v = i;
            while (v) { v &= v - 1; c++; }
            ans.push_back(c);
        }
        return ans;
    }
};`,
  },

  visible: ['n = 2', 'n = 5', 'n = 0', 'n = 1'],

  hidden: ['n = 3', 'n = 4', 'n = 7', 'n = 8', 'n = 16', 'n = 31', 'n = 100', 'n = 100000'],
}
