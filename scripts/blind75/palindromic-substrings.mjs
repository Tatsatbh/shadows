import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 31,
  title: 'Palindromic Substrings',
  difficulty: 'Medium',
  question_uri: 'palindromic-substrings',
  summary: 'Count how many substrings of a string are palindromes, counting positions separately.',

  description_md: `Given a string \`s\`, return the **number of palindromic substrings** in it.

A substring is a contiguous sequence of characters. Two substrings are counted separately if they start or end at different positions, even when they contain the same characters.

---

**Example 1**
\`\`\`text
Input: s = "abc"
Output: 3
Explanation: "a", "b", "c".
\`\`\`

**Example 2**
\`\`\`text
Input: s = "aaa"
Output: 6
Explanation: "a", "a", "a", "aa", "aa", "aaa".
\`\`\`

**Example 3**
\`\`\`text
Input: s = "abba"
Output: 6
Explanation: "a", "b", "b", "a", "bb", "abba".
\`\`\`

## Constraints

- \`1 <= s.length <= 1000\`
- \`s\` consists of lowercase English letters.
- Every single character is itself a palindrome.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def countSubstrings(self, s: str) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _s = _pstr(_ls[0] if len(_ls) > 0 else "")
    print(Solution().countSubstrings(_s))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int countSubstrings(string s) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    string s = _pstr(ls[0]);

    Solution sol;
    cout << sol.countSubstrings(s) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def countSubstrings(self, s: str) -> int:
        n = len(s)
        total = 0
        for center in range(2 * n - 1) if n else []:
            left = center // 2
            right = left + (center % 2)
            while left >= 0 and right < n and s[left] == s[right]:
                total += 1
                left -= 1
                right += 1
        return total`,
    cpp: `class Solution {
public:
    int countSubstrings(string s) {
        int n = (int)s.size();
        int total = 0;
        for (int center = 0; center < 2 * n - 1; center++) {
            int left = center / 2;
            int right = left + (center % 2);
            while (left >= 0 && right < n && s[left] == s[right]) {
                total++;
                left--;
                right++;
            }
        }
        return total;
    }
};`,
  },

  // Counts only distinct palindromic strings, not positions.
  wrong: {
    python: `class Solution:
    def countSubstrings(self, s: str) -> int:
        found = set()
        n = len(s)
        for i in range(n):
            for j in range(i, n):
                sub = s[i:j + 1]
                if sub == sub[::-1]:
                    found.add(sub)
        return len(found)`,
    cpp: `class Solution {
public:
    int countSubstrings(string s) {
        set<string> found;
        int n = (int)s.size();
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                string sub = s.substr(i, j - i + 1);
                string rev(sub.rbegin(), sub.rend());
                if (sub == rev) found.insert(sub);
            }
        }
        return (int)found.size();
    }
};`,
  },

  visible: ['s = "abc"', 's = "aaa"', 's = "abba"', 's = "a"'],

  hidden: [
    's = "ab"',
    's = "aa"',
    's = "racecar"',
    's = "abcba"',
    's = "aaaa"',
    's = "abacaba"',
    's = "zzzzzzzzzz"',
    `s = "${'ab'.repeat(500)}"`,
  ],
}
