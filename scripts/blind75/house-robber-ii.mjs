import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const stress = Array.from({ length: 100 }, (_, i) => (i * 211) % 1001)

export default {
  question_number: 37,
  title: 'House Robber II',
  difficulty: 'Medium',
  question_uri: 'house-robber-ii',
  summary: 'Same no-adjacent robbery rule, but the houses are arranged in a circle.',

  description_md: `You are a robber planning to rob houses along a street where **the houses are arranged in a circle** — the first house is the neighbour of the last one.

As before, adjacent houses have connected alarms, so you cannot rob two adjacent houses on the same night.

Given the array \`nums\` of money in each house, return the maximum you can rob **without alerting the police**.

The circular constraint means the first and last house can never both be robbed, which suggests solving two linear subproblems.

---

**Example 1**
\`\`\`text
Input: nums = [2,3,2]
Output: 3
Explanation: You cannot rob houses 0 and 2, since they are adjacent in a circle.
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 0 and house 2.
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [1,2,3]
Output: 3
\`\`\`

## Constraints

- \`1 <= nums.length <= 100\`
- \`0 <= nums[i] <= 1000\`
- A single house can always be robbed outright.`,

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
        def rob_line(values):
            skip, take = 0, 0
            for x in values:
                skip, take = max(skip, take), skip + x
            return max(skip, take)

        if len(nums) == 1:
            return nums[0]
        return max(rob_line(nums[:-1]), rob_line(nums[1:]))`,
    cpp: `class Solution {
public:
    int rob(vector<int>& nums) {
        if (nums.size() == 1) return nums[0];
        return max(robLine(nums, 0, (int)nums.size() - 1),
                   robLine(nums, 1, (int)nums.size()));
    }

private:
    int robLine(const vector<int>& nums, int from, int to) {
        int skip = 0, take = 0;
        for (int i = from; i < to; i++) {
            int newSkip = max(skip, take);
            int newTake = skip + nums[i];
            skip = newSkip;
            take = newTake;
        }
        return max(skip, take);
    }
};`,
  },

  // Forgets the circle and solves the plain linear version.
  wrong: {
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
        for (size_t i = 0; i < nums.size(); i++) {
            int newSkip = max(skip, take);
            int newTake = skip + nums[i];
            skip = newSkip;
            take = newTake;
        }
        return max(skip, take);
    }
};`,
  },

  visible: ['nums = [2,3,2]', 'nums = [1,2,3,1]', 'nums = [1,2,3]', 'nums = [5]'],

  hidden: [
    'nums = [1,2]',
    'nums = [0]',
    'nums = [200,3,140,20,10]',
    'nums = [1,1,1,1]',
    'nums = [10,1,1,10]',
    'nums = [100,1,1,100,1,1,100]',
    'nums = [1,2,3,4,5,6,7,8,9,10]',
    `nums = [${stress.join(',')}]`,
  ],
}
