import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const stress = Array.from({ length: 100 }, (_, i) => (i * 137) % 401)

export default {
  question_number: 19,
  title: 'House Robber',
  difficulty: 'Medium',
  question_uri: 'house-robber',
  summary: 'Maximize the loot from a row of houses without ever robbing two adjacent ones.',

  description_md: `You are a robber planning to rob houses along a street. Each house holds a certain amount of money, given by the array \`nums\`.

Adjacent houses have connected security systems, so robbing **two adjacent houses on the same night** triggers the alarm.

Return the maximum amount of money you can rob tonight **without alerting the police**.

---

**Example 1**
\`\`\`text
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 0 (money = 1) and house 2 (money = 3).
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [2,7,9,3,1]
Output: 12
Explanation: Rob houses 0, 2 and 4 (2 + 9 + 1 = 12).
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [2,1,1,2]
Output: 4
Explanation: Rob houses 0 and 3.
\`\`\`

## Constraints

- \`1 <= nums.length <= 100\`
- \`0 <= nums[i] <= 400\``,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def rob(self, nums: List[int]) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    print(Solution().rob(_nums))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int rob(vector<int>& nums) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);

    Solution sol;
    cout << sol.rob(nums) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def rob(self, nums: List[int]) -> int:
        skip, take = 0, 0
        for x in nums:
            skip, take = max(skip, take), skip + x
        return max(skip, take)`,
    cpp: `class Solution {
public:
    int rob(vector<int>& nums) {
        int skip = 0, take = 0;
        for (int x : nums) {
            int newSkip = max(skip, take);
            int newTake = skip + x;
            skip = newSkip;
            take = newTake;
        }
        return max(skip, take);
    }
};`,
  },

  // Robbing strictly every other house from index 0 is a common wrong greedy.
  wrong: {
    python: `class Solution:
    def rob(self, nums: List[int]) -> int:
        return sum(nums[0::2])`,
    cpp: `class Solution {
public:
    int rob(vector<int>& nums) {
        int total = 0;
        for (size_t i = 0; i < nums.size(); i += 2) total += nums[i];
        return total;
    }
};`,
  },

  visible: [
    'nums = [1,2,3,1]',
    'nums = [2,7,9,3,1]',
    'nums = [2,1,1,2]',
    'nums = [5]',
  ],

  hidden: [
    'nums = [1,2]',
    'nums = [0]',
    'nums = [1,1,1,1]',
    'nums = [10,1,1,10]',
    'nums = [2,3,2]',
    'nums = [100,1,1,100,1,1,100]',
    'nums = [1,2,3,4,5,6,7,8,9,10]',
    `nums = [${stress.join(',')}]`,
  ],
}
