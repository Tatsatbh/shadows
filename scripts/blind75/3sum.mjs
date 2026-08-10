import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const stress = Array.from({ length: 300 }, (_, i) => ((i * 37) % 41) - 20)

export default {
  question_number: 16,
  title: '3Sum',
  difficulty: 'Medium',
  question_uri: '3sum',
  summary: 'Find every unique triplet in the array that sums to zero.',

  description_md: `Given an integer array \`nums\`, return all the **unique** triplets \`[nums[i], nums[j], nums[k]]\` such that \`i\`, \`j\` and \`k\` are distinct indices and \`nums[i] + nums[j] + nums[k] == 0\`.

The solution set must not contain duplicate triplets.

### Output format

Because any ordering of the triplets would be equally correct, the output is **canonicalised** for you — the driver sorts each triplet ascending, then sorts the list of triplets, so you may return them in any order.

Print the number of triplets on the first line, then one triplet per line as space-separated values.

---

**Example 1**
\`\`\`text
Input: nums = [-1,0,1,2,-1,-4]
Output:
2
-1 -1 2
-1 0 1
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [0,1,1]
Output:
0
Explanation: No triplet sums to zero.
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [0,0,0]
Output:
1
0 0 0
\`\`\`

## Constraints

- \`0 <= nums.length <= 3000\`
- \`-10^5 <= nums[i] <= 10^5\`
- Each triplet must appear **once**; returning the same triplet twice is incorrect.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    _res = Solution().threeSum(_nums) or []
    _canon = sorted(sorted(int(v) for v in _t) for _t in _res)
    print(len(_canon))
    for _t in _canon:
        print(" ".join(str(v) for v in _t))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);

    Solution sol;
    vector<vector<int> > res = sol.threeSum(nums);
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
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums = sorted(nums)
        n = len(nums)
        out = []
        for i in range(n - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            lo, hi = i + 1, n - 1
            while lo < hi:
                total = nums[i] + nums[lo] + nums[hi]
                if total < 0:
                    lo += 1
                elif total > 0:
                    hi -= 1
                else:
                    out.append([nums[i], nums[lo], nums[hi]])
                    lo += 1
                    hi -= 1
                    while lo < hi and nums[lo] == nums[lo - 1]:
                        lo += 1
                    while lo < hi and nums[hi] == nums[hi + 1]:
                        hi -= 1
        return out`,
    cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<int> a = nums;
        sort(a.begin(), a.end());
        int n = (int)a.size();
        vector<vector<int> > out;
        for (int i = 0; i + 2 < n; i++) {
            if (i > 0 && a[i] == a[i - 1]) continue;
            int lo = i + 1, hi = n - 1;
            while (lo < hi) {
                long long total = (long long)a[i] + a[lo] + a[hi];
                if (total < 0) lo++;
                else if (total > 0) hi--;
                else {
                    vector<int> t;
                    t.push_back(a[i]);
                    t.push_back(a[lo]);
                    t.push_back(a[hi]);
                    out.push_back(t);
                    lo++;
                    hi--;
                    while (lo < hi && a[lo] == a[lo - 1]) lo++;
                    while (lo < hi && a[hi] == a[hi + 1]) hi--;
                }
            }
        }
        return out;
    }
};`,
  },

  // Brute force without de-duplication: right count only when no duplicates exist.
  wrong: {
    python: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        out = []
        n = len(nums)
        for i in range(n):
            for j in range(i + 1, n):
                for k in range(j + 1, n):
                    if nums[i] + nums[j] + nums[k] == 0:
                        out.append([nums[i], nums[j], nums[k]])
        return out`,
    cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<vector<int> > out;
        int n = (int)nums.size();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                for (int k = j + 1; k < n; k++)
                    if (nums[i] + nums[j] + nums[k] == 0) {
                        vector<int> t;
                        t.push_back(nums[i]);
                        t.push_back(nums[j]);
                        t.push_back(nums[k]);
                        out.push_back(t);
                    }
        return out;
    }
};`,
  },

  visible: [
    'nums = [-1,0,1,2,-1,-4]',
    'nums = [0,1,1]',
    'nums = [0,0,0]',
    'nums = [-2,0,1,1,2]',
  ],

  hidden: [
    'nums = []',
    'nums = [0,0,0,0]',
    'nums = [-1,0,1,0]',
    'nums = [3,0,-2,-1,1,2]',
    'nums = [1,2,-2,-1]',
    'nums = [5,-5,0]',
    'nums = [-4,-2,-2,-2,0,1,2,2,2,3,3,4,4,6,6]',
    `nums = [${stress.join(',')}]`,
  ],
}
