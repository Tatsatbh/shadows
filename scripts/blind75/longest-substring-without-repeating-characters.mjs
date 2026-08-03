import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const stress = 'abcdefghij'.repeat(5000)

export default {
  question_number: 17,
  title: 'Longest Substring Without Repeating Characters',
  difficulty: 'Medium',
  question_uri: 'longest-substring-without-repeating-characters',
  summary: 'Find the length of the longest run of characters that contains no duplicates.',

  description_md: `Given a string \`s\`, find the length of the **longest substring** that contains no repeating characters.

A **substring** is a contiguous sequence of characters — \`"pwke"\` is a subsequence of \`"pwwkew"\`, not a substring.

---

**Example 1**
\`\`\`text
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with length 3.
\`\`\`

**Example 2**
\`\`\`text
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with length 1.
\`\`\`

**Example 3**
\`\`\`text
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with length 3.
\`\`\`

## Constraints

- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of English letters, digits, symbols and spaces.
- The empty string has answer \`0\`.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _s = _pstr(_ls[0] if len(_ls) > 0 else "")
    print(Solution().lengthOfLongestSubstring(_s))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    string s = _pstr(ls[0]);

    Solution sol;
    cout << sol.lengthOfLongestSubstring(s) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last = {}
        start = 0
        best = 0
        for i, ch in enumerate(s):
            if ch in last and last[ch] >= start:
                start = last[ch] + 1
            last[ch] = i
            if i - start + 1 > best:
                best = i - start + 1
        return best`,
    cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> last;
        int start = 0, best = 0;
        for (int i = 0; i < (int)s.size(); i++) {
            unordered_map<char, int>::iterator it = last.find(s[i]);
            if (it != last.end() && it->second >= start) {
                start = it->second + 1;
            }
            last[s[i]] = i;
            if (i - start + 1 > best) best = i - start + 1;
        }
        return best;
    }
};`,
  },

  // Counting distinct characters overall is a classic wrong answer.
  wrong: {
    python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        return len(set(s))`,
    cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> seen(s.begin(), s.end());
        return (int)seen.size();
    }
};`,
  },

  visible: [
    's = "abcabcbb"',
    's = "bbbbb"',
    's = "pwwkew"',
    's = ""',
  ],

  hidden: [
    's = " "',
    's = "au"',
    's = "dvdf"',
    's = "abba"',
    's = "tmmzuxt"',
    's = "abcdefghijklmnopqrstuvwxyz"',
    's = "aab"',
    `s = "${stress}"`,
  ],
}
