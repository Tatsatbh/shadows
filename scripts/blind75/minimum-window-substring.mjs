import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const stressS = 'abcdefghij'.repeat(2000) + 'zzz'
const stressT = 'jihgz'

export default {
  question_number: 21,
  title: 'Minimum Window Substring',
  difficulty: 'Hard',
  question_uri: 'minimum-window-substring',
  summary: 'Find the shortest substring of s that contains every character of t, counting duplicates.',

  description_md: `Given two strings \`s\` and \`t\`, return the **minimum window substring** of \`s\` that contains every character of \`t\`, including duplicates. If no such substring exists, return the empty string.

The answer is guaranteed to be unique.

### Output format

Print the length of the window on the first line, then the window itself on the second line. When no window exists, print \`0\` and nothing else — this keeps the "no answer" case unambiguous.

---

**Example 1**
\`\`\`text
Input: s = "ADOBECODEBANC", t = "ABC"
Output:
4
BANC
Explanation: "BANC" is the shortest substring containing A, B and C.
\`\`\`

**Example 2**
\`\`\`text
Input: s = "a", t = "a"
Output:
1
a
\`\`\`

**Example 3**
\`\`\`text
Input: s = "a", t = "aa"
Output:
0
Explanation: s has only one 'a', so no window contains both copies.
\`\`\`

## Constraints

- \`1 <= s.length, t.length <= 10^5\`
- \`s\` and \`t\` consist of uppercase and lowercase English letters.
- Duplicate characters in \`t\` must each be matched.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _s = _pstr(_ls[0] if len(_ls) > 0 else "")
    _t = _pstr(_ls[1] if len(_ls) > 1 else "")
    _res = Solution().minWindow(_s, _t) or ""
    print(len(_res))
    if _res:
        print(_res)
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    string minWindow(string s, string t) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    string s = _pstr(ls[0]);
    string t = _pstr(ls[1]);

    Solution sol;
    string res = sol.minWindow(s, t);
    cout << res.size() << "\\n";
    if (!res.empty()) cout << res << "\\n";
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if not s or not t or len(t) > len(s):
            return ""
        need = {}
        for ch in t:
            need[ch] = need.get(ch, 0) + 1
        missing = len(t)
        best_len = -1
        best_start = 0
        left = 0
        for right, ch in enumerate(s):
            if need.get(ch, 0) > 0:
                missing -= 1
            need[ch] = need.get(ch, 0) - 1
            while missing == 0:
                if best_len == -1 or right - left + 1 < best_len:
                    best_len = right - left + 1
                    best_start = left
                need[s[left]] += 1
                if need[s[left]] > 0:
                    missing += 1
                left += 1
        return "" if best_len == -1 else s[best_start:best_start + best_len]`,
    cpp: `class Solution {
public:
    string minWindow(string s, string t) {
        if (s.empty() || t.empty() || t.size() > s.size()) return "";
        vector<int> need(128, 0);
        for (size_t i = 0; i < t.size(); i++) need[(unsigned char)t[i]]++;
        int missing = (int)t.size();
        int bestLen = -1, bestStart = 0, left = 0;
        for (int right = 0; right < (int)s.size(); right++) {
            unsigned char c = (unsigned char)s[right];
            if (need[c] > 0) missing--;
            need[c]--;
            while (missing == 0) {
                if (bestLen == -1 || right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestStart = left;
                }
                unsigned char lc = (unsigned char)s[left];
                need[lc]++;
                if (need[lc] > 0) missing++;
                left++;
            }
        }
        return bestLen == -1 ? string("") : s.substr(bestStart, bestLen);
    }
};`,
  },

  // Ignores duplicate counts in t — treats it as a set of distinct characters.
  wrong: {
    python: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = set(t)
        best = ""
        for i in range(len(s)):
            seen = set()
            for j in range(i, len(s)):
                seen.add(s[j])
                if need <= seen:
                    if best == "" or j - i + 1 < len(best):
                        best = s[i:j + 1]
                    break
        return best`,
    cpp: `class Solution {
public:
    string minWindow(string s, string t) {
        set<char> need(t.begin(), t.end());
        string best = "";
        for (size_t i = 0; i < s.size(); i++) {
            set<char> seen;
            for (size_t j = i; j < s.size(); j++) {
                seen.insert(s[j]);
                bool ok = true;
                for (set<char>::iterator it = need.begin(); it != need.end(); ++it) {
                    if (!seen.count(*it)) { ok = false; break; }
                }
                if (ok) {
                    if (best.empty() || j - i + 1 < best.size()) best = s.substr(i, j - i + 1);
                    break;
                }
            }
        }
        return best;
    }
};`,
  },

  visible: [
    's = "ADOBECODEBANC"\nt = "ABC"',
    's = "a"\nt = "a"',
    's = "a"\nt = "aa"',
    's = "ab"\nt = "b"',
  ],

  hidden: [
    's = "bba"\nt = "ab"',
    's = "cabwefgewcwaefgcf"\nt = "cae"',
    's = "abc"\nt = "cba"',
    's = "aaflslflsldkalskaaa"\nt = "aaa"',
    's = "xyz"\nt = "xyz"',
    's = "abcdef"\nt = "zz"',
    's = "aa"\nt = "aa"',
    `s = "${stressS}"\nt = "${stressT}"`,
  ],
}
