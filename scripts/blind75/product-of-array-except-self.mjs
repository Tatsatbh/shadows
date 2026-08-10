import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

// Mostly 1s so that every prefix/suffix product stays inside 32 bits.
const stress = Array.from({ length: 10000 }, (_, i) => (i === 0 || i === 4321 ? 2 : 1))

export default {
  question_number: 14,
  title: 'Product of Array Except Self',
  difficulty: 'Medium',
  question_uri: 'product-of-array-except-self',
  summary: 'For each index, return the product of every other element — without using division.',

  description_md: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` **except** \`nums[i]\`.

You must write an algorithm that runs in **O(n)** time and **without using the division operation**.

Print the result as space-separated values on one line.

---

**Example 1**
\`\`\`text
Input: nums = [1,2,3,4]
Output: 24 12 8 6
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [-1,1,0,-3,3]
Output: 0 0 9 0 0
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [2,3]
Output: 3 2
\`\`\`

## Constraints

- \`2 <= nums.length <= 10^5\`
- \`-30 <= nums[i] <= 30\`
- The product of any prefix or suffix of \`nums\` is guaranteed to fit in a 32-bit integer.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    _res = Solution().productExceptSelf(_nums)
    print(" ".join(str(int(x)) for x in _res))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);

    Solution sol;
    vector<int> res = sol.productExceptSelf(nums);
    for (size_t i = 0; i < res.size(); i++) {
        if (i) cout << " ";
        cout << res[i];
    }
    cout << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        answer = [1] * n
        prefix = 1
        for i in range(n):
            answer[i] = prefix
            prefix *= nums[i]
        suffix = 1
        for i in range(n - 1, -1, -1):
            answer[i] *= suffix
            suffix *= nums[i]
        return answer`,
    cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = (int)nums.size();
        vector<int> answer(n, 1);
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            answer[i] = prefix;
            prefix *= nums[i];
        }
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= suffix;
            suffix *= nums[i];
        }
        return answer;
    }
};`,
  },

  wrong: {
    python: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        return nums`,
    cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        return nums;
    }
};`,
  },

  visible: [
    'nums = [1,2,3,4]',
    'nums = [-1,1,0,-3,3]',
    'nums = [2,3]',
    'nums = [0,0]',
  ],

  hidden: [
    'nums = [1,0]',
    'nums = [0,1]',
    'nums = [1,1,1,1]',
    'nums = [-1,-1]',
    'nums = [5,2,1]',
    'nums = [1,2,3,4,5,6]',
    'nums = [-2,-3,4]',
    `nums = [${stress.join(',')}]`,
  ],
}
