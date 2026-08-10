import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 23,
  title: 'Number of 1 Bits',
  difficulty: 'Easy',
  question_uri: 'number-of-1-bits',
  summary: 'Count the set bits in the binary representation of an unsigned 32-bit integer.',

  description_md: `Write a function that takes an unsigned 32-bit integer \`n\` and returns the number of \`1\` bits it has — also known as its **Hamming weight**.

The input is given as a decimal number.

---

**Example 1**
\`\`\`text
Input: n = 11
Output: 3
Explanation: 11 is 00000000000000000000000000001011, which has three 1 bits.
\`\`\`

**Example 2**
\`\`\`text
Input: n = 128
Output: 1
Explanation: 128 is 00000000000000000000000010000000.
\`\`\`

**Example 3**
\`\`\`text
Input: n = 4294967293
Output: 31
Explanation: Every bit is set except bit 1.
\`\`\`

## Constraints

- \`0 <= n <= 2^32 - 1\`
- The value is **unsigned**, so it can exceed the range of a signed 32-bit integer.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def hammingWeight(self, n: int) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _n = int(_val(_ls[0]) or "0")
    print(Solution().hammingWeight(_n))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int hammingWeight(unsigned int n) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    string raw = _val(ls[0]);
    // stoul, not the shared _pint: values above 2^31-1 overflow a signed int.
    unsigned int n = raw.empty() ? 0u : (unsigned int)stoul(raw);

    Solution sol;
    cout << sol.hammingWeight(n) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            n &= n - 1
            count += 1
        return count`,
    cpp: `class Solution {
public:
    int hammingWeight(unsigned int n) {
        int count = 0;
        while (n) {
            n &= n - 1;
            count++;
        }
        return count;
    }
};`,
  },

  wrong: {
    python: `class Solution:
    def hammingWeight(self, n: int) -> int:
        return n % 2`,
    cpp: `class Solution {
public:
    int hammingWeight(unsigned int n) {
        return (int)(n % 2);
    }
};`,
  },

  visible: ['n = 11', 'n = 128', 'n = 4294967293', 'n = 0'],

  hidden: [
    'n = 1',
    'n = 2',
    'n = 3',
    'n = 255',
    'n = 2147483647',
    'n = 4294967295',
    'n = 2147483648',
    'n = 1048576',
  ],
}
