import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

// 0..4999 rotated left by 1234.
const base = Array.from({ length: 5000 }, (_, i) => i)
const rotated = base.slice(1234).concat(base.slice(0, 1234))

export default {
  question_number: 28,
  title: 'Find Minimum in Rotated Sorted Array',
  difficulty: 'Medium',
  question_uri: 'find-minimum-in-rotated-sorted-array',
  summary: 'Locate the smallest element of a sorted array that has been rotated, in logarithmic time.',

  description_md: `Suppose an array of length \`n\` sorted in ascending order is **rotated** between \`1\` and \`n\` times. Given the rotated array \`nums\` of **unique** elements, return the minimum element.

You must write an algorithm that runs in **O(log n)** time.

---

**Example 1**
\`\`\`text
Input: nums = [3,4,5,1,2]
Output: 1
Explanation: The original array was [1,2,3,4,5], rotated 3 times.
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [4,5,6,7,0,1,2]
Output: 0
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [11,13,15,17]
Output: 11
Explanation: Rotating n times returns the original array.
\`\`\`

## Constraints

- \`1 <= nums.length <= 5000\`
- \`-5000 <= nums[i] <= 5000\`, all values unique
- \`nums\` is a rotation of a strictly increasing array.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def findMin(self, nums: List[int]) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    print(Solution().findMin(_nums))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int findMin(vector<int>& nums) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);

    Solution sol;
    cout << sol.findMin(nums) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def findMin(self, nums: List[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] > nums[hi]:
                lo = mid + 1
            else:
                hi = mid
        return nums[lo]`,
    cpp: `class Solution {
public:
    int findMin(vector<int>& nums) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid;
        }
        return nums[lo];
    }
};`,
  },

  // Assumes a rotation always happened, so a non-rotated array breaks it.
  wrong: {
    python: `class Solution:
    def findMin(self, nums: List[int]) -> int:
        for i in range(1, len(nums)):
            if nums[i] < nums[i - 1]:
                return nums[i]
        return nums[-1]`,
    cpp: `class Solution {
public:
    int findMin(vector<int>& nums) {
        for (size_t i = 1; i < nums.size(); i++) if (nums[i] < nums[i-1]) return nums[i];
        return nums[nums.size() - 1];
    }
};`,
  },

  visible: ['nums = [3,4,5,1,2]', 'nums = [4,5,6,7,0,1,2]', 'nums = [11,13,15,17]', 'nums = [1]'],

  hidden: [
    'nums = [2,1]',
    'nums = [1,2]',
    'nums = [5,1,2,3,4]',
    'nums = [2,3,4,5,1]',
    'nums = [-5,-4,-3]',
    'nums = [3,-5,-4]',
    'nums = [7,8,9,10,1,2,3,4,5,6]',
    `nums = [${rotated.join(',')}]`,
  ],
}
