import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 9,
  title: 'Valid Palindrome',
  difficulty: 'Easy',
  question_uri: 'valid-palindrome',
  summary: 'Ignore case and non-alphanumeric characters, then check whether the string reads the same both ways.',

  description_md: `A phrase is a **palindrome** if, after converting all uppercase letters to lowercase and removing every character that is not a letter or digit, it reads the same forwards and backwards.

Given a string \`s\`, return \`true\` if it is a palindrome, and \`false\` otherwise.

---

**Example 1**
\`\`\`text
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: After cleaning, s becomes "amanaplanacanalpanama".
\`\`\`

**Example 2**
\`\`\`text
Input: s = "race a car"
Output: false
Explanation: After cleaning, s becomes "raceacar", which is not a palindrome.
\`\`\`

**Example 3**
\`\`\`text
Input: s = " "
Output: true
Explanation: After cleaning, s is empty, and an empty string reads the same both ways.
\`\`\`

## Constraints

- \`1 <= s.length <= 2 * 10^5\`
- \`s\` consists of printable ASCII characters.
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _s = _pstr(_ls[0] if len(_ls) > 0 else "")
    print("true" if Solution().isPalindrome(_s) else "false")
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    bool isPalindrome(string s) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    string s = _pstr(ls[0]);

    Solution sol;
    cout << (sol.isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        cleaned = [ch.lower() for ch in s if ch.isalnum()]
        i, j = 0, len(cleaned) - 1
        while i < j:
            if cleaned[i] != cleaned[j]:
                return False
            i += 1
            j -= 1
        return True`,
    cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        int i = 0, j = (int)s.size() - 1;
        while (i < j) {
            while (i < j && !isalnum((unsigned char)s[i])) i++;
            while (i < j && !isalnum((unsigned char)s[j])) j--;
            if (tolower((unsigned char)s[i]) != tolower((unsigned char)s[j])) return false;
            i++;
            j--;
        }
        return true;
    }
};`,
  },

  wrong: {
    python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        return s == s[::-1]`,
    cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        string r(s.rbegin(), s.rend());
        return r == s;
    }
};`,
  },

  visible: [
    's = "A man, a plan, a canal: Panama"',
    's = "race a car"',
    's = " "',
    's = "0P"',
  ],

  hidden: [
    's = "ab_a"',
    's = "abba"',
    's = "abcba"',
    's = "abca"',
    's = ".,;:!?"',
    's = "Was it a car or a cat I saw?"',
    's = "12321"',
    `s = "${'ab'.repeat(50000)}${'ba'.repeat(50000)}"`,
  ],
}
