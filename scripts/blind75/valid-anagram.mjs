import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 7,
  title: 'Valid Anagram',
  difficulty: 'Easy',
  question_uri: 'valid-anagram',
  summary: 'Decide whether two strings are anagrams — same characters, same counts, any order.',

  description_md: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **anagram** is a rearrangement of all the original characters, using **every** character exactly once.

---

**Example 1**
\`\`\`text
Input: s = "anagram", t = "nagaram"
Output: true
\`\`\`

**Example 2**
\`\`\`text
Input: s = "rat", t = "car"
Output: false
Explanation: 't' appears in s but not in t.
\`\`\`

**Example 3**
\`\`\`text
Input: s = "ab", t = "a"
Output: false
Explanation: Different lengths can never be anagrams.
\`\`\`

## Constraints

- \`0 <= s.length, t.length <= 5 * 10^4\`
- \`s\` and \`t\` consist of lowercase English letters.
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _s = _pstr(_ls[0] if len(_ls) > 0 else "")
    _t = _pstr(_ls[1] if len(_ls) > 1 else "")
    print("true" if Solution().isAnagram(_s, _t) else "false")
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    bool isAnagram(string s, string t) {

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
    cout << (sol.isAnagram(s, t) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        counts = {}
        for ch in s:
            counts[ch] = counts.get(ch, 0) + 1
        for ch in t:
            if counts.get(ch, 0) == 0:
                return False
            counts[ch] -= 1
        return True`,
    cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        unordered_map<char, int> cnt;
        for (char c : s) cnt[c]++;
        for (char c : t) {
            if (--cnt[c] < 0) return false;
        }
        return true;
    }
};`,
  },

  // A deliberately wrong solution, used to prove the judge actually rejects.
  wrong: {
    python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return True`,
    cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        return true;
    }
};`,
  },

  visible: [
    's = "anagram"\nt = "nagaram"',
    's = "rat"\nt = "car"',
    's = "a"\nt = "a"',
    's = "ab"\nt = "a"',
  ],

  hidden: [
    's = ""\nt = ""',
    's = "aacc"\nt = "ccac"',
    's = "listen"\nt = "silent"',
    's = "aabbccdd"\nt = "ddccbbaa"',
    's = "abcd"\nt = "abce"',
    's = "xy"\nt = "yx"',
    's = "aaab"\nt = "aabb"',
    `s = "${'a'.repeat(49999)}b"\nt = "b${'a'.repeat(49999)}"`,
  ],
}
