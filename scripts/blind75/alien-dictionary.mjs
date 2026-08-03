import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 59,
  title: 'Alien Dictionary',
  difficulty: 'Hard',
  question_uri: 'alien-dictionary',
  summary: 'Recover the letter order of an unknown alphabet from a sorted word list.',

  description_md: `There is a language that uses the English lowercase letters, but in an **unknown order**. You are given \`words\`, a list of words from this language's dictionary, already sorted according to that unknown order.

Derive the order of the letters and return it as a string. If the input is **inconsistent** — no ordering can explain it — return the empty string.

### Determinism

Several orderings are often valid. To make the answer unique, return the **lexicographically smallest** valid ordering, comparing by ordinary English letter order. With Kahn's algorithm, that means always taking the smallest available letter next.

Note the invalid case that is easy to miss: if a word appears **before** its own prefix, such as \`["abc","ab"]\`, no ordering can be correct.

### Output format

Print the length of the ordering on the first line, then the ordering itself. An inconsistent input prints \`0\` and nothing else.

---

**Example 1**
\`\`\`text
Input: words = ["wrt","wrf","er","ett","rftt"]
Output:
5
wertf
\`\`\`

**Example 2**
\`\`\`text
Input: words = ["z","x"]
Output:
2
zx
\`\`\`

**Example 3**
\`\`\`text
Input: words = ["abc","ab"]
Output:
0
Explanation: A word cannot precede its own prefix.
\`\`\`

## Constraints

- \`1 <= words.length <= 100\`
- \`1 <= words[i].length <= 100\`
- \`words[i]\` consists of lowercase English letters.
- Only letters that actually appear in \`words\` belong in the output.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}
import heapq`,
      code: `class Solution:
    def alienOrder(self, words: List[str]) -> str:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _words = _pstrs(_ls[0] if len(_ls) > 0 else "")
    _res = Solution().alienOrder(_words) or ""
    print(len(_res))
    if _res:
        print(_res)
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}
#include <functional>`,
      code: `class Solution {
public:
    string alienOrder(vector<string>& words) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<string> words = _pstrs(ls[0]);

    Solution sol;
    string res = sol.alienOrder(words);
    cout << res.size() << "\\n";
    if (!res.empty()) cout << res << "\\n";
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def alienOrder(self, words: List[str]) -> str:
        letters = set()
        for w in words:
            for ch in w:
                letters.add(ch)
        adj = dict((ch, set()) for ch in letters)
        indegree = dict((ch, 0) for ch in letters)

        for i in range(len(words) - 1):
            a, b = words[i], words[i + 1]
            limit = min(len(a), len(b))
            found = False
            for k in range(limit):
                if a[k] != b[k]:
                    if b[k] not in adj[a[k]]:
                        adj[a[k]].add(b[k])
                        indegree[b[k]] += 1
                    found = True
                    break
            if not found and len(a) > len(b):
                return ""

        heap = [ch for ch in letters if indegree[ch] == 0]
        heapq.heapify(heap)
        out = []
        while heap:
            ch = heapq.heappop(heap)
            out.append(ch)
            for nxt in sorted(adj[ch]):
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    heapq.heappush(heap, nxt)
        if len(out) != len(letters):
            return ""
        return "".join(out)`,
    cpp: `class Solution {
public:
    string alienOrder(vector<string>& words) {
        set<char> letters;
        for (size_t i = 0; i < words.size(); i++) {
            for (size_t j = 0; j < words[i].size(); j++) letters.insert(words[i][j]);
        }
        map<char, set<char> > adj;
        map<char, int> indegree;
        for (set<char>::iterator it = letters.begin(); it != letters.end(); ++it) {
            adj[*it] = set<char>();
            indegree[*it] = 0;
        }

        for (size_t i = 0; i + 1 < words.size(); i++) {
            const string& a = words[i];
            const string& b = words[i + 1];
            size_t limit = min(a.size(), b.size());
            bool found = false;
            for (size_t k = 0; k < limit; k++) {
                if (a[k] != b[k]) {
                    if (!adj[a[k]].count(b[k])) {
                        adj[a[k]].insert(b[k]);
                        indegree[b[k]]++;
                    }
                    found = true;
                    break;
                }
            }
            if (!found && a.size() > b.size()) return "";
        }

        priority_queue<char, vector<char>, greater<char> > heap;
        for (set<char>::iterator it = letters.begin(); it != letters.end(); ++it) {
            if (indegree[*it] == 0) heap.push(*it);
        }
        string out;
        while (!heap.empty()) {
            char ch = heap.top();
            heap.pop();
            out += ch;
            for (set<char>::iterator it = adj[ch].begin(); it != adj[ch].end(); ++it) {
                if (--indegree[*it] == 0) heap.push(*it);
            }
        }
        if (out.size() != letters.size()) return "";
        return out;
    }
};`,
  },

  // Misses the prefix rule and does not force the smallest ordering.
  wrong: {
    python: `class Solution:
    def alienOrder(self, words: List[str]) -> str:
        letters = []
        for w in words:
            for ch in w:
                if ch not in letters:
                    letters.append(ch)
        return "".join(letters)`,
    cpp: `class Solution {
public:
    string alienOrder(vector<string>& words) {
        string out;
        for (size_t i = 0; i < words.size(); i++) {
            for (size_t j = 0; j < words[i].size(); j++) {
                if (out.find(words[i][j]) == string::npos) out += words[i][j];
            }
        }
        return out;
    }
};`,
  },

  visible: [
    'words = ["wrt","wrf","er","ett","rftt"]',
    'words = ["z","x"]',
    'words = ["abc","ab"]',
    'words = ["z","x","z"]',
  ],

  hidden: [
    'words = ["a"]',
    'words = ["ab","adc"]',
    'words = ["a","b","c"]',
    'words = ["ac","ab","zc","zb"]',
    'words = ["ab","ab"]',
    'words = ["zy","zx"]',
    'words = ["wrt","wrtkj"]',
    'words = ["dfg","dfh","hgf","hfa","abc"]',
  ],
}
