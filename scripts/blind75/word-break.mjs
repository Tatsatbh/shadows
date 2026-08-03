import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 35,
  title: 'Word Break',
  difficulty: 'Medium',
  question_uri: 'word-break',
  summary: 'Decide whether a string can be segmented into a sequence of dictionary words.',

  description_md: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

The same word may be reused **any number of times**.

---

**Example 1**
\`\`\`text
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: "leetcode" splits into "leet code".
\`\`\`

**Example 2**
\`\`\`text
Input: s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: "apple pen apple" — "apple" is reused.
\`\`\`

**Example 3**
\`\`\`text
Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false
Explanation: A greedy longest-first match strands the tail.
\`\`\`

## Constraints

- \`1 <= s.length <= 300\`
- \`1 <= wordDict.length <= 1000\`
- All dictionary words are unique and consist of lowercase English letters.
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _s = _pstr(_ls[0] if len(_ls) > 0 else "")
    _dict = _pstrs(_ls[1] if len(_ls) > 1 else "")
    print("true" if Solution().wordBreak(_s, _dict) else "false")
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    string s = _pstr(ls[0]);
    vector<string> wordDict = _pstrs(ls[1]);

    Solution sol;
    cout << (sol.wordBreak(s, wordDict) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True
        for i in range(1, n + 1):
            for j in range(i):
                if dp[j] and s[j:i] in words:
                    dp[i] = True
                    break
        return dp[n]`,
    cpp: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> words(wordDict.begin(), wordDict.end());
        int n = (int)s.size();
        vector<char> dp(n + 1, 0);
        dp[0] = 1;
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && words.count(s.substr(j, i - j))) { dp[i] = 1; break; }
            }
        }
        return dp[n] != 0;
    }
};`,
  },

  // Greedy longest-match-first, which strands the tail on "catsandog".
  wrong: {
    python: `class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = sorted(wordDict, key=len, reverse=True)
        i = 0
        while i < len(s):
            for w in words:
                if s.startswith(w, i):
                    i += len(w)
                    break
            else:
                return False
        return True`,
    cpp: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        vector<string> words = wordDict;
        sort(words.begin(), words.end(),
             [](const string& a, const string& b) { return a.size() > b.size(); });
        size_t i = 0;
        while (i < s.size()) {
            bool matched = false;
            for (size_t k = 0; k < words.size(); k++) {
                if (s.compare(i, words[k].size(), words[k]) == 0) {
                    i += words[k].size();
                    matched = true;
                    break;
                }
            }
            if (!matched) return false;
        }
        return true;
    }
};`,
  },

  visible: [
    's = "leetcode"\nwordDict = ["leet","code"]',
    's = "applepenapple"\nwordDict = ["apple","pen"]',
    's = "catsandog"\nwordDict = ["cats","dog","sand","and","cat"]',
    's = "a"\nwordDict = ["a"]',
  ],

  hidden: [
    's = "b"\nwordDict = ["a"]',
    's = "aaaaaaa"\nwordDict = ["aaaa","aaa"]',
    's = "cars"\nwordDict = ["car","ca","rs"]',
    's = "abcd"\nwordDict = ["a","abc","b","cd"]',
    's = "goalspecial"\nwordDict = ["go","goal","goals","special"]',
    's = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab"\nwordDict = ["a","aa","aaa","aaaa"]',
    's = "bb"\nwordDict = ["a","b","bbb","bbbb"]',
    `s = "${'apple'.repeat(60)}"\nwordDict = ["apple","pen","app","le"]`,
  ],
}
