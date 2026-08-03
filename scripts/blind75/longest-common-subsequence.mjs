import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const a = 'abcde'.repeat(200)
const b = 'ace'.repeat(200)

export default {
  question_number: 34,
  title: 'Longest Common Subsequence',
  difficulty: 'Medium',
  question_uri: 'longest-common-subsequence',
  summary: 'Find the length of the longest subsequence present in both strings.',

  description_md: `Given two strings \`text1\` and \`text2\`, return the length of their **longest common subsequence**. If there is no common subsequence, return \`0\`.

A subsequence keeps relative order but need not be contiguous — \`"ace"\` is a subsequence of \`"abcde"\`.

---

**Example 1**
\`\`\`text
Input: text1 = "abcde", text2 = "ace"
Output: 3
Explanation: The longest common subsequence is "ace".
\`\`\`

**Example 2**
\`\`\`text
Input: text1 = "abc", text2 = "abc"
Output: 3
\`\`\`

**Example 3**
\`\`\`text
Input: text1 = "abc", text2 = "def"
Output: 0
Explanation: No characters are shared.
\`\`\`

## Constraints

- \`1 <= text1.length, text2.length <= 1000\`
- Both strings consist of lowercase English characters.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _t1 = _pstr(_ls[0] if len(_ls) > 0 else "")
    _t2 = _pstr(_ls[1] if len(_ls) > 1 else "")
    print(Solution().longestCommonSubsequence(_t1, _t2))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    string t1 = _pstr(ls[0]);
    string t2 = _pstr(ls[1]);

    Solution sol;
    cout << sol.longestCommonSubsequence(t1, t2) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        n = len(text2)
        prev = [0] * (n + 1)
        for ch1 in text1:
            curr = [0] * (n + 1)
            for j in range(1, n + 1):
                if ch1 == text2[j - 1]:
                    curr[j] = prev[j - 1] + 1
                else:
                    curr[j] = max(prev[j], curr[j - 1])
            prev = curr
        return prev[n]`,
    cpp: `class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int n = (int)text2.size();
        vector<int> prev(n + 1, 0), curr(n + 1, 0);
        for (size_t i = 0; i < text1.size(); i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i] == text2[j - 1]) curr[j] = prev[j - 1] + 1;
                else curr[j] = max(prev[j], curr[j - 1]);
            }
            prev = curr;
        }
        return prev[n];
    }
};`,
  },

  // Longest common SUBSTRING (contiguous) instead of subsequence.
  wrong: {
    python: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        best = 0
        n = len(text2)
        prev = [0] * (n + 1)
        for ch1 in text1:
            curr = [0] * (n + 1)
            for j in range(1, n + 1):
                if ch1 == text2[j - 1]:
                    curr[j] = prev[j - 1] + 1
                    best = max(best, curr[j])
            prev = curr
        return best`,
    cpp: `class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int n = (int)text2.size(), best = 0;
        vector<int> prev(n + 1, 0), curr(n + 1, 0);
        for (size_t i = 0; i < text1.size(); i++) {
            for (int j = 1; j <= n; j++) {
                curr[j] = (text1[i] == text2[j-1]) ? prev[j-1] + 1 : 0;
                best = max(best, curr[j]);
            }
            prev = curr;
        }
        return best;
    }
};`,
  },

  visible: [
    'text1 = "abcde"\ntext2 = "ace"',
    'text1 = "abc"\ntext2 = "abc"',
    'text1 = "abc"\ntext2 = "def"',
    'text1 = "a"\ntext2 = "a"',
  ],

  hidden: [
    'text1 = "a"\ntext2 = "b"',
    'text1 = "ezupkr"\ntext2 = "ubmrapg"',
    'text1 = "bsbininm"\ntext2 = "jmjkbkjkv"',
    'text1 = "oxcpqrsvwf"\ntext2 = "shmtulqrypy"',
    'text1 = "abcba"\ntext2 = "abcbcba"',
    'text1 = "aaaa"\ntext2 = "aa"',
    'text1 = "pmjghexybyrgzczy"\ntext2 = "hafcdqbgncrcbihkd"',
    `text1 = "${a}"\ntext2 = "${b}"`,
  ],
}
