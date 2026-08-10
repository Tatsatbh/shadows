import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

// Fibonacci-like growth: a run of n ambiguous digits gives Fib(n+1) decodings,
// so the run length is capped to keep the answer inside a 32-bit integer.
const stress = '11'.repeat(20) + '3'.repeat(40)

export default {
  question_number: 38,
  title: 'Decode Ways',
  difficulty: 'Medium',
  question_uri: 'decode-ways',
  summary: 'Count how many ways a digit string can be decoded into letters, where 1-26 map to A-Z.',

  description_md: `A message of letters \`A\`-\`Z\` is encoded to digits using the mapping \`A -> "1"\`, \`B -> "2"\`, ..., \`Z -> "26"\`.

Given a string \`s\` containing only digits, return the **number of ways** to decode it.

Grouping matters: \`"11106"\` can be decoded as \`"AAJF"\` (1 1 10 6) or \`"KJF"\` (11 10 6), but **not** as \`1 11 06\`, because \`"06"\` is not a valid letter — leading zeros are never allowed.

---

**Example 1**
\`\`\`text
Input: s = "12"
Output: 2
Explanation: "AB" (1 2) or "L" (12).
\`\`\`

**Example 2**
\`\`\`text
Input: s = "226"
Output: 3
Explanation: "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).
\`\`\`

**Example 3**
\`\`\`text
Input: s = "06"
Output: 0
Explanation: "06" cannot be decoded, because of the leading zero.
\`\`\`

## Constraints

- \`1 <= s.length <= 100\`
- \`s\` contains only digits and may contain leading zeros.
- The answer is guaranteed to fit in a 32-bit integer.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def numDecodings(self, s: str) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _s = _pstr(_ls[0] if len(_ls) > 0 else "")
    print(Solution().numDecodings(_s))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int numDecodings(string s) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    string s = _pstr(ls[0]);

    Solution sol;
    cout << sol.numDecodings(s) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def numDecodings(self, s: str) -> int:
        if not s or s[0] == "0":
            return 0
        prev2, prev1 = 1, 1
        for i in range(1, len(s)):
            curr = 0
            if s[i] != "0":
                curr += prev1
            two = int(s[i - 1:i + 1])
            if 10 <= two <= 26:
                curr += prev2
            if curr == 0:
                return 0
            prev2, prev1 = prev1, curr
        return prev1`,
    cpp: `class Solution {
public:
    int numDecodings(string s) {
        if (s.empty() || s[0] == '0') return 0;
        long long prev2 = 1, prev1 = 1;
        for (size_t i = 1; i < s.size(); i++) {
            long long curr = 0;
            if (s[i] != '0') curr += prev1;
            int two = (s[i - 1] - '0') * 10 + (s[i] - '0');
            if (two >= 10 && two <= 26) curr += prev2;
            if (curr == 0) return 0;
            prev2 = prev1;
            prev1 = curr;
        }
        return (int)prev1;
    }
};`,
  },

  // Ignores the leading-zero rule.
  wrong: {
    python: `class Solution:
    def numDecodings(self, s: str) -> int:
        prev2, prev1 = 1, 1
        for i in range(1, len(s)):
            curr = prev1
            if int(s[i - 1:i + 1]) <= 26:
                curr += prev2
            prev2, prev1 = prev1, curr
        return prev1`,
    cpp: `class Solution {
public:
    int numDecodings(string s) {
        long long prev2 = 1, prev1 = 1;
        for (size_t i = 1; i < s.size(); i++) {
            long long curr = prev1;
            int two = (s[i-1] - '0') * 10 + (s[i] - '0');
            if (two <= 26) curr += prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return (int)prev1;
    }
};`,
  },

  visible: ['s = "12"', 's = "226"', 's = "06"', 's = "1"'],

  hidden: [
    's = "0"',
    's = "10"',
    's = "27"',
    's = "100"',
    's = "2101"',
    's = "11106"',
    's = "111111111111111111111111"',
    `s = "${stress}"`,
  ],
}
