import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const stress = Array.from({ length: 20000 }, (_, i) => (i * 6151) % 10001)

export default {
  question_number: 15,
  title: 'Container With Most Water',
  difficulty: 'Medium',
  question_uri: 'container-with-most-water',
  summary: 'Pick two lines that together with the x-axis hold the most water.',

  description_md: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines, where the \`i\`-th line runs from \`(i, 0)\` to \`(i, height[i])\`.

Find two lines that, together with the x-axis, form a container holding the **most** water, and return that maximum amount.

The container cannot be tilted — its area is \`min(height[i], height[j]) * (j - i)\`.

---

**Example 1**
\`\`\`text
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The lines at index 1 and index 8 hold min(8,7) * 7 = 49.
\`\`\`

**Example 2**
\`\`\`text
Input: height = [1,1]
Output: 1
\`\`\`

**Example 3**
\`\`\`text
Input: height = [4,3,2,1,4]
Output: 16
Explanation: The two lines of height 4 are 4 apart.
\`\`\`

## Constraints

- \`2 <= height.length <= 10^5\`
- \`0 <= height[i] <= 10^4\``,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def maxArea(self, height: List[int]) -> int:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _height = _pints(_ls[0] if len(_ls) > 0 else "")
    print(Solution().maxArea(_height))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int maxArea(vector<int>& height) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> height = _pints(ls[0]);

    Solution sol;
    cout << sol.maxArea(height) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def maxArea(self, height: List[int]) -> int:
        i, j = 0, len(height) - 1
        best = 0
        while i < j:
            area = min(height[i], height[j]) * (j - i)
            if area > best:
                best = area
            if height[i] < height[j]:
                i += 1
            else:
                j -= 1
        return best`,
    cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int i = 0, j = (int)height.size() - 1;
        long long best = 0;
        while (i < j) {
            long long area = (long long)min(height[i], height[j]) * (j - i);
            if (area > best) best = area;
            if (height[i] < height[j]) i++;
            else j--;
        }
        return (int)best;
    }
};`,
  },

  // The classic wrong intuition: assume the widest pair is always best.
  wrong: {
    python: `class Solution:
    def maxArea(self, height: List[int]) -> int:
        return min(height[0], height[-1]) * (len(height) - 1)`,
    cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int n = (int)height.size();
        return min(height[0], height[n - 1]) * (n - 1);
    }
};`,
  },

  visible: [
    'height = [1,8,6,2,5,4,8,3,7]',
    'height = [1,1]',
    'height = [4,3,2,1,4]',
    'height = [1,2,1]',
  ],

  hidden: [
    'height = [2,3,4,5,18,17,6]',
    'height = [1,2]',
    'height = [100,1,1,100]',
    'height = [1,1,1,1,1]',
    'height = [0,2]',
    'height = [2,1]',
    'height = [1,3,2,5,25,24,5]',
    `height = [${stress.join(',')}]`,
  ],
}
