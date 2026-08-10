import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const stress = 'ABCDEFGHIJ'.repeat(1000)

export default {
  question_number: 30,
  title: 'Longest Repeating Character Replacement',
  difficulty: 'Medium',
  question_uri: 'longest-repeating-character-replacement',
  summary: 'With at most k character swaps, find the longest run of a single repeated letter.',

  description_md: `You are given a string \`s\` and an integer \`k\`. You may choose any character of the string and change it to any other uppercase English letter — at most \`k\` times.

Return the length of the longest substring containing the **same letter** that you can obtain after performing those operations.

---

**Example 1**
\`\`\`text
Input: s = "ABAB", k = 2
Output: 4
Explanation: Replace the two 'A's with 'B's, or vice versa.
\`\`\`

**Example 2**
\`\`\`text
Input: s = "AABABBA", k = 1
Output: 4
Explanation: Replace the one 'A' in the middle to get "AABBBBA".
\`\`\`

**Example 3**
\`\`\`text
Input: s = "ABCDE", k = 0
Output: 1
Explanation: With no replacements allowed, the best run is a single letter.
\`\`\`

## Constraints

- \`1 <= s.length <= 10^5\`
- \`s\` consists of uppercase English letters.
- \`0 <= k <= s.length\``,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _s = _pstr(_ls[0] if len(_ls) > 0 else "")
    _k = _pint(_ls[1] if len(_ls) > 1 else "0")
    print(Solution().characterReplacement(_s, _k))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int characterReplacement(string s, int k) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    string s = _pstr(ls[0]);
    int k = _pint(ls[1]);

    Solution sol;
    cout << sol.characterReplacement(s, k) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        counts = {}
        left = 0
        max_count = 0
        best = 0
        for right in range(len(s)):
            ch = s[right]
            counts[ch] = counts.get(ch, 0) + 1
            if counts[ch] > max_count:
                max_count = counts[ch]
            while (right - left + 1) - max_count > k:
                counts[s[left]] -= 1
                left += 1
                max_count = max(counts.values()) if counts else 0
            if right - left + 1 > best:
                best = right - left + 1
        return best`,
    cpp: `class Solution {
public:
    int characterReplacement(string s, int k) {
        vector<int> counts(128, 0);
        int left = 0, maxCount = 0, best = 0;
        for (int right = 0; right < (int)s.size(); right++) {
            counts[(unsigned char)s[right]]++;
            maxCount = max(maxCount, counts[(unsigned char)s[right]]);
            while ((right - left + 1) - maxCount > k) {
                counts[(unsigned char)s[left]]--;
                left++;
                maxCount = 0;
                for (int c = 0; c < 128; c++) maxCount = max(maxCount, counts[c]);
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};`,
  },

  // Ignores k entirely and just measures runs of identical characters.
  wrong: {
    python: `class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        best = 0
        run = 0
        prev = ""
        for ch in s:
            run = run + 1 if ch == prev else 1
            prev = ch
            best = max(best, run)
        return best`,
    cpp: `class Solution {
public:
    int characterReplacement(string s, int k) {
        int best = 0, run = 0;
        char prev = 0;
        for (size_t i = 0; i < s.size(); i++) {
            run = (s[i] == prev) ? run + 1 : 1;
            prev = s[i];
            best = max(best, run);
        }
        return best;
    }
};`,
  },

  visible: ['s = "ABAB"\nk = 2', 's = "AABABBA"\nk = 1', 's = "ABCDE"\nk = 0', 's = "A"\nk = 0'],

  hidden: [
    's = "AAAA"\nk = 2',
    's = "ABBB"\nk = 2',
    's = "AABA"\nk = 0',
    's = "ABCDEF"\nk = 3',
    's = "AAAB"\nk = 0',
    's = "BAAAB"\nk = 2',
    's = "ABAA"\nk = 1',
    `s = "${stress}"\nk = 5`,
  ],
}
