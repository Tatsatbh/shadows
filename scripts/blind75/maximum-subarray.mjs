import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const stress = Array.from({ length: 20000 }, (_, i) => ((i * 7919) % 201) - 100)

export default {
  question_number: 13,
  title: 'Maximum Subarray',
  difficulty: 'Medium',
  question_uri: 'maximum-subarray',
  summary: 'Find the largest sum obtainable from any contiguous subarray.',

  description_md: `Given an integer array \`nums\`, find the contiguous subarray containing **at least one** number which has the largest sum, and return that sum.

---

**Example 1**
\`\`\`text
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum, 6.
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [1]
Output: 1
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: The whole array is the best subarray.
\`\`\`

## Constraints

- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`
- The subarray must be non-empty, so an all-negative array returns its largest element.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    print(Solution().maxSubArray(_nums))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);

    Solution sol;
    cout << sol.maxSubArray(nums) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        best = nums[0]
        curr = nums[0]
        for x in nums[1:]:
            curr = max(x, curr + x)
            best = max(best, curr)
        return best`,
    cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int best = nums[0];
        int curr = nums[0];
        for (size_t i = 1; i < nums.size(); i++) {
            curr = max(nums[i], curr + nums[i]);
            best = max(best, curr);
        }
        return best;
    }
};`,
  },

  wrong: {
    python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        return max(nums)`,
    cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        return *max_element(nums.begin(), nums.end());
    }
};`,
  },

  visible: [
    'nums = [-2,1,-3,4,-1,2,1,-5,4]',
    'nums = [1]',
    'nums = [5,4,-1,7,8]',
    'nums = [-1]',
  ],

  hidden: [
    'nums = [-2,-1]',
    'nums = [-5]',
    'nums = [1,2,3,4,5]',
    'nums = [-1,-2,-3,-4]',
    'nums = [8,-19,5,-4,20]',
    'nums = [0]',
    'nums = [3,-2,3]',
    `nums = [${stress.join(',')}]`,
  ],
}
