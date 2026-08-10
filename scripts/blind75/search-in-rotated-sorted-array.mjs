import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const base = Array.from({ length: 5000 }, (_, i) => i * 2)
const rotated = base.slice(3777).concat(base.slice(0, 3777))

export default {
  question_number: 29,
  title: 'Search in Rotated Sorted Array',
  difficulty: 'Medium',
  question_uri: 'search-in-rotated-sorted-array',
  summary: 'Binary-search a rotated sorted array for a target, returning its index or -1.',

  description_md: `There is an integer array \`nums\` sorted in ascending order with **distinct** values, which has been **rotated** at some unknown pivot.

Given \`nums\` after the rotation and an integer \`target\`, return the **index** of \`target\` if it is present, or \`-1\` if it is not.

You must write an algorithm with **O(log n)** runtime complexity.

---

**Example 1**
\`\`\`text
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [1], target = 0
Output: -1
\`\`\`

## Constraints

- \`1 <= nums.length <= 5000\`
- \`-10^4 <= nums[i], target <= 10^4\`, all values in \`nums\` unique
- At each step, at least one half of the array is guaranteed to be sorted.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    _target = _pint(_ls[1] if len(_ls) > 1 else "0")
    print(Solution().search(_nums, _target))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int search(vector<int>& nums, int target) {

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
    cout << sol.search(nums, target) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[lo] <= nums[mid]:
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return -1`,
    cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
};`,
  },

  // Plain binary search, ignoring the rotation.
  wrong: {
    python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1`,
    cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
};`,
  },

  visible: [
    'nums = [4,5,6,7,0,1,2]\ntarget = 0',
    'nums = [4,5,6,7,0,1,2]\ntarget = 3',
    'nums = [1]\ntarget = 0',
    'nums = [1]\ntarget = 1',
  ],

  hidden: [
    'nums = [3,1]\ntarget = 1',
    'nums = [5,1,3]\ntarget = 3',
    'nums = [1,2,3,4,5]\ntarget = 5',
    'nums = [4,5,6,7,8,1,2,3]\ntarget = 8',
    'nums = [-1,0,3,5,9,12]\ntarget = 9',
    'nums = [6,7,8,1,2,3,4,5]\ntarget = 6',
    'nums = [2,3,4,5,6,7,8,9,1]\ntarget = 1',
    `nums = [${rotated.join(',')}]\ntarget = 4200`,
  ],
}
