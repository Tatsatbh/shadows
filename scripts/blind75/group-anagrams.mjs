import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const words = ['abc', 'bca', 'cab', 'xyz', 'zyx', 'lmno', 'onml']
const stress = Array.from({ length: 2000 }, (_, i) => words[i % words.length])

export default {
  question_number: 18,
  title: 'Group Anagrams',
  difficulty: 'Medium',
  question_uri: 'group-anagrams',
  summary: 'Bucket a list of words so that every group contains exactly the words that are anagrams of each other.',

  description_md: `Given an array of strings \`strs\`, group together all the strings that are **anagrams** of one another.

An anagram is a word formed by rearranging the letters of another, using every letter exactly once.

### Output format

Because any ordering of the groups — and of the words inside them — would be equally correct, the output is **canonicalised** for you. The driver sorts the words inside each group and then sorts the groups, so you may return them in any order.

Print the number of groups on the first line, then one group per line as space-separated words.

---

**Example 1**
\`\`\`text
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output:
3
ate eat tea
bat
nat tan
\`\`\`

**Example 2**
\`\`\`text
Input: strs = ["a"]
Output:
1
a
\`\`\`

**Example 3**
\`\`\`text
Input: strs = ["abc","bca","cab","xyz"]
Output:
2
abc bca cab
xyz
\`\`\`

## Constraints

- \`0 <= strs.length <= 10^4\`
- \`0 <= strs[i].length <= 100\`
- \`strs[i]\` consists of lowercase English letters.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _strs = _pstrs(_ls[0] if len(_ls) > 0 else "")
    _res = Solution().groupAnagrams(_strs) or []
    _canon = sorted(sorted(_g) for _g in _res)
    print(len(_canon))
    for _g in _canon:
        print(" ".join(_g))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<string> strs = _pstrs(ls[0]);

    Solution sol;
    vector<vector<string> > res = sol.groupAnagrams(strs);
    for (size_t i = 0; i < res.size(); i++) sort(res[i].begin(), res[i].end());
    sort(res.begin(), res.end());

    cout << res.size() << "\\n";
    for (size_t i = 0; i < res.size(); i++) {
        for (size_t j = 0; j < res[i].size(); j++) {
            if (j) cout << " ";
            cout << res[i][j];
        }
        cout << "\\n";
    }
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        buckets = {}
        for word in strs:
            key = "".join(sorted(word))
            if key not in buckets:
                buckets[key] = []
            buckets[key].append(word)
        return list(buckets.values())`,
    cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string> > buckets;
        for (size_t i = 0; i < strs.size(); i++) {
            string key = strs[i];
            sort(key.begin(), key.end());
            buckets[key].push_back(strs[i]);
        }
        vector<vector<string> > out;
        for (unordered_map<string, vector<string> >::iterator it = buckets.begin();
             it != buckets.end(); ++it) {
            out.push_back(it->second);
        }
        return out;
    }
};`,
  },

  // Grouping by length instead of by letter multiset.
  wrong: {
    python: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        buckets = {}
        for word in strs:
            buckets.setdefault(len(word), []).append(word)
        return list(buckets.values())`,
    cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        map<size_t, vector<string> > buckets;
        for (size_t i = 0; i < strs.size(); i++) buckets[strs[i].size()].push_back(strs[i]);
        vector<vector<string> > out;
        for (map<size_t, vector<string> >::iterator it = buckets.begin(); it != buckets.end(); ++it) {
            out.push_back(it->second);
        }
        return out;
    }
};`,
  },

  visible: [
    'strs = ["eat","tea","tan","ate","nat","bat"]',
    'strs = ["a"]',
    'strs = ["abc","bca","cab","xyz"]',
    'strs = ["ab","ba","abc","cba","bac"]',
  ],

  hidden: [
    'strs = []',
    'strs = ["a","b","c"]',
    'strs = ["listen","silent","enlist","google","gogole"]',
    'strs = ["aa","aa","aa"]',
    'strs = ["abc","def","ghi"]',
    'strs = ["ddddddddddd","dddddddddd"]',
    'strs = ["tar","rat","art","star","tars","arts"]',
    `strs = [${stress.map((w) => `"${w}"`).join(',')}]`,
  ],
}
