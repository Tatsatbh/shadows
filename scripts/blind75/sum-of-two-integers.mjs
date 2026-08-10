import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 22,
  title: 'Sum of Two Integers',
  difficulty: 'Medium',
  question_uri: 'sum-of-two-integers',
  summary: 'Add two integers using only bitwise operations — no + or - allowed.',

  description_md: `Given two integers \`a\` and \`b\`, return their sum **without using the operators \`+\` and \`-\`**.

The intended solution uses bitwise arithmetic: XOR gives the sum without carries, AND shifted left gives the carries, and you repeat until there is no carry left.

---

**Example 1**
\`\`\`text
Input: a = 1, b = 2
Output: 3
\`\`\`

**Example 2**
\`\`\`text
Input: a = 2, b = 3
Output: 5
\`\`\`

**Example 3**
\`\`\`text
Input: a = -1, b = 1
Output: 0
\`\`\`

## Constraints

- \`-1000 <= a, b <= 1000\`
- Negative values must work, so mind sign extension when masking to 32 bits.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def getSum(self, a: int, b: int) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _a = _pint(_ls[0] if len(_ls) > 0 else "0")
    _b = _pint(_ls[1] if len(_ls) > 1 else "0")
    print(Solution().getSum(_a, _b))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int getSum(int a, int b) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    int a = _pint(ls[0]);
    int b = _pint(ls[1]);

    Solution sol;
    cout << sol.getSum(a, b) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def getSum(self, a: int, b: int) -> int:
        mask = 0xFFFFFFFF
        a &= mask
        b &= mask
        while b:
            carry = ((a & b) << 1) & mask
            a = (a ^ b) & mask
            b = carry
        return a if a <= 0x7FFFFFFF else ~(a ^ mask)`,
    cpp: `class Solution {
public:
    int getSum(int a, int b) {
        while (b != 0) {
            unsigned int carry = ((unsigned int)(a & b)) << 1;
            a = a ^ b;
            b = (int)carry;
        }
        return a;
    }
};`,
  },

  wrong: {
    python: `class Solution:
    def getSum(self, a: int, b: int) -> int:
        return a ^ b`,
    cpp: `class Solution {
public:
    int getSum(int a, int b) {
        return a ^ b;
    }
};`,
  },

  visible: ['a = 1\nb = 2', 'a = 2\nb = 3', 'a = -1\nb = 1', 'a = 0\nb = 0'],

  hidden: [
    'a = -1\nb = -1',
    'a = 1000\nb = 1000',
    'a = -1000\nb = -1000',
    'a = 5\nb = -3',
    'a = -5\nb = 3',
    'a = 7\nb = 8',
    'a = 0\nb = -7',
    'a = 999\nb = -1000',
  ],
}
