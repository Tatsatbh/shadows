import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

// 0..20000 with 7331 removed, shuffled deterministically.
const big = []
for (let i = 0; i <= 20000; i++) if (i !== 7331) big.push(i)
for (let i = big.length - 1; i > 0; i--) {
  const j = (i * 7919 + 13) % (i + 1)
  const t = big[i]
  big[i] = big[j]
  big[j] = t
}

export default {
  question_number: 25,
  title: 'Missing Number',
  difficulty: 'Easy',
  question_uri: 'missing-number',
  summary: 'One number in the range 0..n is absent from the array — find it.',

  description_md: `Given an array \`nums\` containing \`n\` **distinct** numbers drawn from the range \`[0, n]\`, return the one number in that range which is missing from the array.

Can you do it in O(n) time and O(1) extra space? XOR and the arithmetic-sum identity both work.

---

**Example 1**
\`\`\`text
Input: nums = [3,0,1]
Output: 2
Explanation: n = 3, so the range is [0,3]. 2 is missing.
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [0,1]
Output: 2
Explanation: n = 2, so the range is [0,2]. 2 is missing.
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [9,6,4,2,3,5,7,0,1]
Output: 8
\`\`\`

## Constraints

- \`1 <= n <= 10^4\`
- \`0 <= nums[i] <= n\`, all values distinct
- The missing number can be \`0\` or \`n\` itself.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    print(Solution().missingNumber(_nums))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int missingNumber(vector<int>& nums) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);

    Solution sol;
    cout << sol.missingNumber(nums) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        result = len(nums)
        for i, x in enumerate(nums):
            result ^= i ^ x
        return result`,
    cpp: `class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int result = (int)nums.size();
        for (int i = 0; i < (int)nums.size(); i++) result ^= i ^ nums[i];
        return result;
    }
};`,
  },

  // Assumes the array is sorted.
  wrong: {
    python: `class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        for i, x in enumerate(nums):
            if i != x:
                return i
        return len(nums)`,
    cpp: `class Solution {
public:
    int missingNumber(vector<int>& nums) {
        for (int i = 0; i < (int)nums.size(); i++) if (nums[i] != i) return i;
        return (int)nums.size();
    }
};`,
  },

  visible: ['nums = [3,0,1]', 'nums = [0,1]', 'nums = [9,6,4,2,3,5,7,0,1]', 'nums = [0]'],

  hidden: [
    'nums = [1]',
    'nums = [1,0]',
    'nums = [0,2]',
    'nums = [2,1,0]',
    'nums = [4,3,2,1]',
    'nums = [1,2,3,4,5]',
    'nums = [5,4,3,2,1,0]',
    `nums = [${big.join(',')}]`,
  ],
}
