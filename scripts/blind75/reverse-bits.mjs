import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 26,
  title: 'Reverse Bits',
  difficulty: 'Easy',
  question_uri: 'reverse-bits',
  summary: 'Reverse the order of all 32 bits of an unsigned integer.',

  description_md: `Reverse the bits of a given unsigned 32-bit integer \`n\` and return the result.

Both the input and the output are given as **decimal** numbers, but the operation is on the full 32-bit representation — leading zeros count.

---

**Example 1**
\`\`\`text
Input: n = 43261596
Output: 964176192
Explanation: 00000010100101000001111010011100 reversed is
             00111001011110000010100101000000
\`\`\`

**Example 2**
\`\`\`text
Input: n = 4294967293
Output: 3221225471
Explanation: 11111111111111111111111111111101 reversed is
             10111111111111111111111111111111
\`\`\`

**Example 3**
\`\`\`text
Input: n = 1
Output: 2147483648
Explanation: The lowest bit becomes the highest bit.
\`\`\`

## Constraints

- \`0 <= n <= 2^32 - 1\`
- The result is also **unsigned** and may exceed the range of a signed 32-bit integer.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def reverseBits(self, n: int) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _n = int(_val(_ls[0]) or "0")
    print(Solution().reverseBits(_n) & 0xFFFFFFFF)
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    unsigned int reverseBits(unsigned int n) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    string raw = _val(ls[0]);
    unsigned int n = raw.empty() ? 0u : (unsigned int)stoul(raw);

    Solution sol;
    cout << sol.reverseBits(n) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def reverseBits(self, n: int) -> int:
        result = 0
        for _ in range(32):
            result = (result << 1) | (n & 1)
            n >>= 1
        return result`,
    cpp: `class Solution {
public:
    unsigned int reverseBits(unsigned int n) {
        unsigned int result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (n & 1u);
            n >>= 1;
        }
        return result;
    }
};`,
  },

  // Reverses only the significant bits, ignoring leading zeros.
  wrong: {
    python: `class Solution:
    def reverseBits(self, n: int) -> int:
        return int(bin(n)[2:][::-1], 2) if n else 0`,
    cpp: `class Solution {
public:
    unsigned int reverseBits(unsigned int n) {
        if (n == 0) return 0;
        unsigned int result = 0;
        while (n) {
            result = (result << 1) | (n & 1u);
            n >>= 1;
        }
        return result;
    }
};`,
  },

  visible: ['n = 43261596', 'n = 4294967293', 'n = 1', 'n = 0'],

  hidden: [
    'n = 2',
    'n = 2147483648',
    'n = 4294967295',
    'n = 2147483647',
    'n = 128',
    'n = 65535',
    'n = 3221225472',
    'n = 1048576',
  ],
}
