import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

// Value v appears v times, so the top frequencies are unambiguous.
const stress = []
for (let v = 1; v <= 200; v++) for (let c = 0; c < v; c++) stress.push(v)

export default {
  question_number: 75,
  title: 'Top K Frequent Elements',
  difficulty: 'Medium',
  question_uri: 'top-k-frequent-elements',
  summary: 'Return the k values that occur most often in an array.',

  description_md: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements.

A heap gives O(n log k); bucket sort by frequency gives O(n), which beats the O(n log n) of simply sorting by count.

### Output format

Any order of the answer is acceptable — the driver **sorts the returned values ascending** before printing. Print the count on the first line, then the values space-separated.

The test data guarantees the answer is **unique**, so there is never a tie at the k-th position.

---

**Example 1**
\`\`\`text
Input: nums = [1,1,1,2,2,3], k = 2
Output:
2
1 2
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [1], k = 1
Output:
1
1
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [4,4,4,5,5,6], k = 3
Output:
3
4 5 6
\`\`\`

## Constraints

- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`
- \`k\` is in the range \`[1, number of distinct elements]\`.
- The answer is guaranteed to be unique.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    _k = _pint(_ls[1] if len(_ls) > 1 else "0")
    _res = Solution().topKFrequent(_nums, _k) or []
    _canon = sorted(int(v) for v in _res)
    print(len(_canon))
    if _canon:
        print(" ".join(str(v) for v in _canon))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);
    int k = _pint(ls[1]);

    Solution sol;
    vector<int> res = sol.topKFrequent(nums, k);
    sort(res.begin(), res.end());
    cout << res.size() << "\\n";
    if (!res.empty()) {
        for (size_t i = 0; i < res.size(); i++) {
            if (i) cout << " ";
            cout << res[i];
        }
        cout << "\\n";
    }
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        counts = {}
        for x in nums:
            counts[x] = counts.get(x, 0) + 1
        buckets = [[] for _ in range(len(nums) + 1)]
        for value, freq in counts.items():
            buckets[freq].append(value)
        out = []
        for freq in range(len(buckets) - 1, 0, -1):
            for value in buckets[freq]:
                out.append(value)
                if len(out) == k:
                    return out
        return out`,
    cpp: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> counts;
        for (size_t i = 0; i < nums.size(); i++) counts[nums[i]]++;
        vector<vector<int> > buckets(nums.size() + 1);
        for (unordered_map<int, int>::iterator it = counts.begin(); it != counts.end(); ++it) {
            buckets[it->second].push_back(it->first);
        }
        vector<int> out;
        for (int freq = (int)buckets.size() - 1; freq > 0; freq--) {
            for (size_t i = 0; i < buckets[freq].size(); i++) {
                out.push_back(buckets[freq][i]);
                if ((int)out.size() == k) return out;
            }
        }
        return out;
    }
};`,
  },

  // Returns the k largest values rather than the k most frequent.
  wrong: {
    python: `class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        return sorted(set(nums), reverse=True)[:k]`,
    cpp: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        set<int> distinct(nums.begin(), nums.end());
        vector<int> all(distinct.rbegin(), distinct.rend());
        if ((int)all.size() > k) all.resize(k);
        return all;
    }
};`,
  },

  visible: [
    'nums = [1,1,1,2,2,3]\nk = 2',
    'nums = [1]\nk = 1',
    'nums = [4,4,4,5,5,6]\nk = 3',
    'nums = [1,1,2]\nk = 1',
  ],

  hidden: [
    'nums = [3,0,1,0]\nk = 1',
    'nums = [-1,-1,-2]\nk = 1',
    'nums = [5,5,4,4,4,3,3,3,3]\nk = 2',
    'nums = [1,2,3,4,5]\nk = 5',
    'nums = [7,7,7,7]\nk = 1',
    'nums = [1,1,1,2,2,3,3,3,3,4]\nk = 2',
    'nums = [-10000,-10000,10000]\nk = 1',
    `nums = [${stress.join(',')}]\nk = 5`,
  ],
}
