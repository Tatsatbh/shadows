import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 32,
  title: 'Encode and Decode Strings',
  difficulty: 'Medium',
  question_uri: 'encode-and-decode-strings',
  summary: 'Serialise a list of arbitrary strings into one string and recover it exactly.',

  description_md: `Design an algorithm to encode a **list of strings** into a single string, and to decode that single string back into the original list.

Implement both methods:

- \`encode(strs)\` — returns one string representing the whole list
- \`decode(s)\` — returns the original list of strings

The strings may contain **any** characters, including whatever delimiter you are tempted to use. A length-prefixed encoding is the usual answer.

### Output format

The driver calls \`encode\` and feeds the result straight into \`decode\`, then prints the number of recovered strings on the first line and one string per line after it. You are graded on the **round trip**, so any encoding works as long as it is reversible.

---

**Example 1**
\`\`\`text
Input: strs = ["hello","world"]
Output:
2
hello
world
\`\`\`

**Example 2**
\`\`\`text
Input: strs = []
Output:
0
\`\`\`

**Example 3**
\`\`\`text
Input: strs = ["a#b","c"]
Output:
2
a#b
c
Explanation: A naive '#'-joined encoding fails this case.
\`\`\`

## Constraints

- \`0 <= strs.length <= 200\`
- \`0 <= strs[i].length <= 200\`
- \`strs[i]\` may contain any ASCII characters, including digits and \`#\`.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def encode(self, strs: List[str]) -> str:
        pass

    def decode(self, s: str) -> List[str]:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _strs = _pstrs(_ls[0] if len(_ls) > 0 else "")
    _sol = Solution()
    _decoded = _sol.decode(_sol.encode(_strs))
    if _decoded is None:
        _decoded = []
    print(len(_decoded))
    for _w in _decoded:
        print(_w)
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    string encode(vector<string>& strs) {

    }

    vector<string> decode(string s) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<string> strs = _pstrs(ls[0]);

    Solution sol;
    string encoded = sol.encode(strs);
    vector<string> decoded = sol.decode(encoded);

    cout << decoded.size() << "\\n";
    for (size_t i = 0; i < decoded.size(); i++) cout << decoded[i] << "\\n";
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def encode(self, strs: List[str]) -> str:
        parts = []
        for w in strs:
            parts.append(str(len(w)))
            parts.append("#")
            parts.append(w)
        return "".join(parts)

    def decode(self, s: str) -> List[str]:
        out = []
        i = 0
        while i < len(s):
            j = s.index("#", i)
            length = int(s[i:j])
            out.append(s[j + 1:j + 1 + length])
            i = j + 1 + length
        return out`,
    cpp: `class Solution {
public:
    string encode(vector<string>& strs) {
        string out;
        for (size_t i = 0; i < strs.size(); i++) {
            ostringstream os;
            os << strs[i].size();
            out += os.str();
            out += '#';
            out += strs[i];
        }
        return out;
    }

    vector<string> decode(string s) {
        vector<string> out;
        size_t i = 0;
        while (i < s.size()) {
            size_t j = s.find('#', i);
            int length = stoi(s.substr(i, j - i));
            out.push_back(s.substr(j + 1, length));
            i = j + 1 + length;
        }
        return out;
    }
};`,
  },

  // Delimiter-joined: breaks as soon as a string contains the delimiter.
  wrong: {
    python: `class Solution:
    def encode(self, strs: List[str]) -> str:
        return "#".join(strs)

    def decode(self, s: str) -> List[str]:
        return s.split("#") if s else []`,
    cpp: `class Solution {
public:
    string encode(vector<string>& strs) {
        string out;
        for (size_t i = 0; i < strs.size(); i++) {
            if (i) out += '#';
            out += strs[i];
        }
        return out;
    }

    vector<string> decode(string s) {
        vector<string> out;
        if (s.empty()) return out;
        stringstream ss(s);
        string tok;
        while (getline(ss, tok, '#')) out.push_back(tok);
        return out;
    }
};`,
  },

  visible: [
    'strs = ["hello","world"]',
    'strs = []',
    'strs = ["a#b","c"]',
    'strs = ["neet","code","love","you"]',
  ],

  hidden: [
    'strs = [""]',
    'strs = ["",""]',
    'strs = ["#","##","###"]',
    'strs = ["1#2","3"]',
    'strs = ["a b","c d"]',
    'strs = ["x"]',
    'strs = ["4#abc","5"]',
    'strs = ["longer string with spaces","another one","3#4#5"]',
  ],
}
