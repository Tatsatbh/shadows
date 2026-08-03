import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

export default {
  question_number: 36,
  title: 'Combination Sum IV',
  difficulty: 'Medium',
  question_uri: 'combination-sum-iv',
  summary: 'Count the ordered ways to reach a target by summing numbers that may repeat.',

  description_md: `Given an array of **distinct** integers \`nums\` and a target integer \`target\`, return the number of possible combinations that add up to \`target\`.

Despite the name, **order matters** — \`(1,3)\` and \`(3,1)\` count as two different combinations. That makes this a permutation count, which changes the loop order of the dynamic program.

---

**Example 1**
\`\`\`text
Input: nums = [1,2,3], target = 4
Output: 7
Explanation: (1,1,1,1) (1,1,2) (1,2,1) (1,3) (2,1,1) (2,2) (3,1)
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [9], target = 3
Output: 0
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [1,2,3], target = 0
Output: 1
Explanation: The empty combination sums to zero.
\`\`\`

## Constraints

- \`1 <= nums.length <= 200\`
- \`1 <= nums[i] <= 1000\`, all values distinct
- \`0 <= target <= 1000\`
- The answer is guaranteed to fit in a 32-bit integer.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    _target = _pint(_ls[1] if len(_ls) > 1 else "0")
    print(Solution().combinationSum4(_nums, _target))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int combinationSum4(vector<int>& nums, int target) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);
    int target = _pint(ls[1]);

    Solution sol;
    cout << sol.combinationSum4(nums, target) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        dp = [0] * (target + 1)
        dp[0] = 1
        for total in range(1, target + 1):
            for x in nums:
                if x <= total:
                    dp[total] += dp[total - x]
        return dp[target]`,
    cpp: `class Solution {
public:
    int combinationSum4(vector<int>& nums, int target) {
        vector<unsigned long long> dp(target + 1, 0);
        dp[0] = 1;
        for (int total = 1; total <= target; total++) {
            for (size_t k = 0; k < nums.size(); k++) {
                if (nums[k] <= total) dp[total] += dp[total - nums[k]];
            }
        }
        return (int)dp[target];
    }
};`,
  },

  // Loops in the other order, counting unordered combinations.
  wrong: {
    python: `class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        dp = [0] * (target + 1)
        dp[0] = 1
        for x in nums:
            for total in range(x, target + 1):
                dp[total] += dp[total - x]
        return dp[target]`,
    cpp: `class Solution {
public:
    int combinationSum4(vector<int>& nums, int target) {
        vector<unsigned long long> dp(target + 1, 0);
        dp[0] = 1;
        for (size_t k = 0; k < nums.size(); k++) {
            for (int total = nums[k]; total <= target; total++) dp[total] += dp[total - nums[k]];
        }
        return (int)dp[target];
    }
};`,
  },

  visible: [
    'nums = [1,2,3]\ntarget = 4',
    'nums = [9]\ntarget = 3',
    'nums = [1,2,3]\ntarget = 0',
    'nums = [2]\ntarget = 4',
  ],

  hidden: [
    'nums = [1]\ntarget = 1',
    'nums = [1,2]\ntarget = 5',
    // target stays small enough that the count fits in 32 bits; the classic
    // [3,33,333]/10000 case overflows and is outside the stated constraint.
    'nums = [3,33,333]\ntarget = 99',
    'nums = [4,2,1]\ntarget = 32',
    'nums = [10,20,30]\ntarget = 15',
    'nums = [1,2,3]\ntarget = 10',
    'nums = [5,10]\ntarget = 20',
    'nums = [1,2,3,4]\ntarget = 25',
  ],
}
