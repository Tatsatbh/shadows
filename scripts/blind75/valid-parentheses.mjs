import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 8,
  title: 'Valid Parentheses',
  difficulty: 'Easy',
  question_uri: 'valid-parentheses',
  summary: 'Check whether a string of brackets is correctly opened and closed in the right order.',

  description_md: `Given a string \`s\` containing only the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine whether the input string is **valid**.

A string is valid when:

- every open bracket is closed by a bracket of the **same type**, and
- brackets close in the **correct order**, and
- every closing bracket has a matching open bracket.

---

**Example 1**
\`\`\`text
Input: s = "()[]{}"
Output: true
\`\`\`

**Example 2**
\`\`\`text
Input: s = "(]"
Output: false
Explanation: '(' is closed by ']', which is the wrong type.
\`\`\`

**Example 3**
\`\`\`text
Input: s = "([)]"
Output: false
Explanation: The brackets overlap instead of nesting.
\`\`\`

## Constraints

- \`0 <= s.length <= 10^4\`
- \`s\` consists only of the characters \`()[]{}\`.
- The empty string is valid.
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def isValid(self, s: str) -> bool:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _s = _pstr(_ls[0] if len(_ls) > 0 else "")
    print("true" if Solution().isValid(_s) else "false")
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    bool isValid(string s) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    string s = _pstr(ls[0]);

    Solution sol;
    cout << (sol.isValid(s) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {")": "(", "]": "[", "}": "{"}
        stack = []
        for ch in s:
            if ch in pairs:
                if not stack or stack[-1] != pairs[ch]:
                    return False
                stack.pop()
            else:
                stack.append(ch)
        return not stack`,
    cpp: `class Solution {
public:
    bool isValid(string s) {
        vector<char> stack;
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push_back(c);
            } else {
                char want = (c == ')') ? '(' : (c == ']') ? '[' : '{';
                if (stack.empty() || stack.back() != want) return false;
                stack.pop_back();
            }
        }
        return stack.empty();
    }
};`,
  },

  wrong: {
    python: `class Solution:
    def isValid(self, s: str) -> bool:
        return len(s) % 2 == 0`,
    cpp: `class Solution {
public:
    bool isValid(string s) {
        return s.size() % 2 == 0;
    }
};`,
  },

  visible: [
    's = "()"',
    's = "()[]{}"',
    's = "(]"',
    's = "([])"',
  ],

  hidden: [
    's = ""',
    's = "("',
    's = ")"',
    's = "{[]}"',
    's = "([)]"',
    's = "(((((((((())))))))))"',
    's = "]["',
    `s = "${'()'.repeat(5000)}"`,
  ],
}
