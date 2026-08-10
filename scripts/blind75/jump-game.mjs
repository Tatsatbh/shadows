import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

// Every element is at least 1, so the end is always reachable.
const reachable = Array.from({ length: 10000 }, (_, i) => ((i * 7919) % 4) + 1)

export default {
  question_number: 40,
  title: 'Jump Game',
  difficulty: 'Medium',
  question_uri: 'jump-game',
  summary: 'Decide whether you can reach the last index when each value is a maximum jump length.',

  description_md: `You are given an integer array \`nums\`. You start at the **first index**, and each element represents your **maximum** jump length from that position.

Return \`true\` if you can reach the last index, and \`false\` otherwise.

A greedy pass tracking the furthest reachable index solves this in O(n).

---

**Example 1**
\`\`\`text
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step to index 1, then 3 steps to the last index.
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [3,2,1,0,4]
Output: false
Explanation: Every route lands on index 3, whose value 0 makes further movement impossible.
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [0]
Output: true
Explanation: You start on the last index already.
\`\`\`

## Constraints

- \`1 <= nums.length <= 10^4\`
- \`0 <= nums[i] <= 10^5\`
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def canJump(self, nums: List[int]) -> bool:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    print("true" if Solution().canJump(_nums) else "false")
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    bool canJump(vector<int>& nums) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);

    Solution sol;
    cout << (sol.canJump(nums) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def canJump(self, nums: List[int]) -> bool:
        furthest = 0
        for i, x in enumerate(nums):
            if i > furthest:
                return False
            if i + x > furthest:
                furthest = i + x
        return True`,
    cpp: `class Solution {
public:
    bool canJump(vector<int>& nums) {
        long long furthest = 0;
        for (int i = 0; i < (int)nums.size(); i++) {
            if (i > furthest) return false;
            furthest = max(furthest, (long long)i + nums[i]);
        }
        return true;
    }
};`,
  },

  // "Any zero blocks the path" — wrong when the zero can be jumped over.
  wrong: {
    python: `class Solution:
    def canJump(self, nums: List[int]) -> bool:
        return 0 not in nums[:-1]`,
    cpp: `class Solution {
public:
    bool canJump(vector<int>& nums) {
        for (size_t i = 0; i + 1 < nums.size(); i++) if (nums[i] == 0) return false;
        return true;
    }
};`,
  },

  visible: ['nums = [2,3,1,1,4]', 'nums = [3,2,1,0,4]', 'nums = [0]', 'nums = [2,0,0]'],

  hidden: [
    'nums = [1,0]',
    'nums = [0,1]',
    'nums = [1,1,1,1]',
    'nums = [5,0,0,0,0,1]',
    'nums = [1,2,0,1]',
    'nums = [2,5,0,0]',
    'nums = [3,0,8,2,0,0,1]',
    `nums = [${reachable.join(',')}]`,
  ],
}
