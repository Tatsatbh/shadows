import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

// Values in [-3,3]. 7919 mod 7 == 2, so (2i) mod 7 cycles through every residue
// and a zero lands every 7th element — that caps any subarray product at 3^6,
// keeping it inside the 32-bit range the problem guarantees. Without those
// zeros the product compounds without bound: Python returns a 1200-digit
// integer while C++ silently overflows.
const stress = Array.from({ length: 10000 }, (_, i) => ((i * 7919) % 7) - 3)

export default {
  question_number: 27,
  title: 'Maximum Product Subarray',
  difficulty: 'Medium',
  question_uri: 'maximum-product-subarray',
  summary: 'Find the contiguous subarray with the largest product, where negatives can flip the sign.',

  description_md: `Given an integer array \`nums\`, find a contiguous **non-empty** subarray that has the largest **product**, and return that product.

The twist over Maximum Subarray is sign: two negatives make a positive, so the smallest running product matters as much as the largest.

---

**Example 1**
\`\`\`text
Input: nums = [2,3,-2,4]
Output: 6
Explanation: [2,3] has the largest product 6.
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [-2,0,-1]
Output: 0
Explanation: The answer is 0; [-2,-1] is not contiguous.
\`\`\`

**Example 3**
\`\`\`text
Input: nums = [-2,3,-4]
Output: 24
Explanation: The whole array, because the two negatives cancel.
\`\`\`

## Constraints

- \`1 <= nums.length <= 2 * 10^4\`
- \`-10 <= nums[i] <= 10\`
- The answer is guaranteed to fit in a 32-bit integer.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    print(Solution().maxProduct(_nums))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int maxProduct(vector<int>& nums) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);

    Solution sol;
    cout << sol.maxProduct(nums) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        best = nums[0]
        hi = nums[0]
        lo = nums[0]
        for x in nums[1:]:
            if x < 0:
                hi, lo = lo, hi
            hi = max(x, hi * x)
            lo = min(x, lo * x)
            best = max(best, hi)
        return best`,
    cpp: `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        long long best = nums[0], hi = nums[0], lo = nums[0];
        for (size_t i = 1; i < nums.size(); i++) {
            long long x = nums[i];
            if (x < 0) { long long t = hi; hi = lo; lo = t; }
            hi = max(x, hi * x);
            lo = min(x, lo * x);
            best = max(best, hi);
        }
        return (int)best;
    }
};`,
  },

  // Tracks only the running maximum, so a pair of negatives is missed.
  wrong: {
    python: `class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        best = nums[0]
        curr = nums[0]
        for x in nums[1:]:
            curr = max(x, curr * x)
            best = max(best, curr)
        return best`,
    cpp: `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        long long best = nums[0], curr = nums[0];
        for (size_t i = 1; i < nums.size(); i++) {
            long long x = nums[i];
            curr = max(x, curr * x);
            best = max(best, curr);
        }
        return (int)best;
    }
};`,
  },

  visible: ['nums = [2,3,-2,4]', 'nums = [-2,0,-1]', 'nums = [-2,3,-4]', 'nums = [0]'],

  hidden: [
    'nums = [-2]',
    'nums = [2,-5,-2,-4,3]',
    'nums = [-1,-1]',
    'nums = [0,2]',
    'nums = [3,-1,4]',
    'nums = [-4,-3,-2]',
    'nums = [1,0,-1,2,3,-5,-2]',
    `nums = [${stress.join(',')}]`,
  ],
}
