import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

// 0..19999 shuffled, so the answer is the whole range.
const stress = Array.from({ length: 20000 }, (_, i) => i)
for (let i = stress.length - 1; i > 0; i--) {
  const j = (i * 7919 + 13) % (i + 1)
  const t = stress[i]
  stress[i] = stress[j]
  stress[j] = t
}

export default {
  question_number: 58,
  title: 'Longest Consecutive Sequence',
  difficulty: 'Medium',
  question_uri: 'longest-consecutive-sequence',
  summary: 'Find the longest run of consecutive integers present in an unsorted array.',

  description_md: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in **O(n)** time — sorting is the obvious answer and is explicitly not the intended one.

The trick is a hash set: only start counting from a value whose predecessor is absent, so each run is walked exactly once.

---

**Example 1**
\`\`\`text
Input: nums = [100,4,200,1,3,2]
Output: 4
Explanation: The run [1,2,3,4] has length 4.
\`\`\`

**Example 2**
\`\`\`text
Input: nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
Explanation: 0 through 8, with the duplicate 0 counted once.
\`\`\`

**Example 3**
\`\`\`text
Input: nums = []
Output: 0
\`\`\`

## Constraints

- \`0 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\`
- Duplicates do not extend a run.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _nums = _pints(_ls[0] if len(_ls) > 0 else "")
    print(Solution().longestConsecutive(_nums))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> nums = _pints(ls[0]);

    Solution sol;
    cout << sol.longestConsecutive(nums) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        seen = set(nums)
        best = 0
        for x in seen:
            if x - 1 in seen:
                continue
            length = 1
            while x + length in seen:
                length += 1
            if length > best:
                best = length
        return best`,
    cpp: `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> seen(nums.begin(), nums.end());
        int best = 0;
        for (unordered_set<int>::iterator it = seen.begin(); it != seen.end(); ++it) {
            int x = *it;
            if (seen.count(x - 1)) continue;
            int length = 1;
            while (seen.count(x + length)) length++;
            if (length > best) best = length;
        }
        return best;
    }
};`,
  },

  // Counts consecutive positions in the array as given, without sorting.
  wrong: {
    python: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        if not nums:
            return 0
        best = 1
        run = 1
        for i in range(1, len(nums)):
            if nums[i] == nums[i - 1] + 1:
                run += 1
                best = max(best, run)
            else:
                run = 1
        return best`,
    cpp: `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        if (nums.empty()) return 0;
        int best = 1, run = 1;
        for (size_t i = 1; i < nums.size(); i++) {
            if (nums[i] == nums[i-1] + 1) { run++; best = max(best, run); }
            else run = 1;
        }
        return best;
    }
};`,
  },

  visible: [
    'nums = [100,4,200,1,3,2]',
    'nums = [0,3,7,2,5,8,4,6,0,1]',
    'nums = []',
    'nums = [1]',
  ],

  hidden: [
    'nums = [1,2,0,1]',
    'nums = [9,1,4,7,3,-1,0,5,8,-1,6]',
    'nums = [-1,-2,-3]',
    'nums = [5,5,5,5]',
    'nums = [1,3,5,7]',
    'nums = [1000000000,-1000000000]',
    'nums = [2,1]',
    `nums = [${stress.join(',')}]`,
  ],
}
