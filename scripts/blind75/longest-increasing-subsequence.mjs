import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const stress = Array.from({ length: 2500 }, (_, i) => (i * 7919) % 10007)

export default {
  question_number: 33,
  title: 'Longest Increasing Subsequence',
  difficulty: 'Medium',
  question_uri: 'longest-increasing-subsequence',
  summary: 'Find the length of the longest strictly increasing subsequence.',

  description_md: `Given an integer array \`nums\`, return the length of the longest **strictly increasing subsequence**.

A subsequence is derived by deleting some or no elements without changing the order of the remaining ones.

The O(n^2) dynamic program is the expected answer; an O(n log n) solution using patience sorting also exists.

---

**Example 1**
\`\`\`text
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: The subsequence [2,3,7,101] has length 4.
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [0,1,0,3,2,3]
Output: 4
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [7,7,7,7,7]
Output: 1
Explanation: Strictly increasing, so equal values do not extend the run.
\`\`\`

## Constraints

- \`1 <= nums.length <= 2500\`
- \`-10^4 <= nums[i] <= 10^4\``,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    print(Solution().lengthOfLIS(_nums))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);

    Solution sol;
    cout << sol.lengthOfLIS(nums) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []
        for x in nums:
            lo, hi = 0, len(tails)
            while lo < hi:
                mid = (lo + hi) // 2
                if tails[mid] < x:
                    lo = mid + 1
                else:
                    hi = mid
            if lo == len(tails):
                tails.append(x)
            else:
                tails[lo] = x
        return len(tails)`,
    cpp: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (size_t i = 0; i < nums.size(); i++) {
            vector<int>::iterator it = lower_bound(tails.begin(), tails.end(), nums[i]);
            if (it == tails.end()) tails.push_back(nums[i]);
            else *it = nums[i];
        }
        return (int)tails.size();
    }
};`,
  },

  // Longest increasing RUN rather than subsequence.
  wrong: {
    python: `class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        best = 1 if nums else 0
        run = 1
        for i in range(1, len(nums)):
            run = run + 1 if nums[i] > nums[i - 1] else 1
            best = max(best, run)
        return best`,
    cpp: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        if (nums.empty()) return 0;
        int best = 1, run = 1;
        for (size_t i = 1; i < nums.size(); i++) {
            run = nums[i] > nums[i-1] ? run + 1 : 1;
            best = max(best, run);
        }
        return best;
    }
};`,
  },

  visible: [
    'nums = [10,9,2,5,3,7,101,18]',
    'nums = [0,1,0,3,2,3]',
    'nums = [7,7,7,7,7]',
    'nums = [1]',
  ],

  hidden: [
    'nums = [2,1]',
    'nums = [1,2]',
    'nums = [-1,-2,-3]',
    'nums = [4,10,4,3,8,9]',
    'nums = [1,3,6,7,9,4,10,5,6]',
    'nums = [5,4,3,2,1]',
    'nums = [1,2,3,4,5,6,7,8]',
    `nums = [${stress.join(',')}]`,
  ],
}
