import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

const many = Array.from({ length: 5000 }, (_, i) => `[${i},${i + 2}]`).join(',')

export default {
  question_number: 42,
  title: 'Non-overlapping Intervals',
  difficulty: 'Medium',
  question_uri: 'non-overlapping-intervals',
  summary: 'Remove the fewest intervals needed to leave the rest non-overlapping.',

  description_md: `Given an array of intervals \`intervals\` where \`intervals[i] = [start, end]\`, return the **minimum number of intervals you need to remove** to make the rest non-overlapping.

Intervals that only touch at an endpoint, such as \`[1,2]\` and \`[2,3]\`, do **not** count as overlapping.

The greedy answer sorts by **end** time and keeps the interval that finishes earliest.

---

**Example 1**
\`\`\`text
Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1
Explanation: Removing [1,3] leaves the rest non-overlapping.
\`\`\`

**Example 2**
\`\`\`text
Input: intervals = [[1,2],[1,2],[1,2]]
Output: 2
Explanation: Two of the three identical intervals must go.
\`\`\`

**Example 3**
\`\`\`text
Input: intervals = [[1,2],[2,3]]
Output: 0
Explanation: They only touch, so nothing needs removing.
\`\`\`

## Constraints

- \`1 <= intervals.length <= 10^5\`
- \`-5 * 10^4 <= start < end <= 5 * 10^4\``,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _intervals = _pmatrix(_ls[0] if len(_ls) > 0 else "")
    print(Solution().eraseOverlapIntervals(_intervals))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_MATRIX}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<vector<int> > intervals = _pmatrix(ls[0]);

    Solution sol;
    cout << sol.eraseOverlapIntervals(intervals) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        if not intervals:
            return 0
        order = sorted(intervals, key=lambda iv: iv[1])
        kept = 1
        end = order[0][1]
        for iv in order[1:]:
            if iv[0] >= end:
                kept += 1
                end = iv[1]
        return len(intervals) - kept`,
    cpp: `class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        vector<vector<int> > order = intervals;
        sort(order.begin(), order.end(),
             [](const vector<int>& a, const vector<int>& b) { return a[1] < b[1]; });
        int kept = 1, end = order[0][1];
        for (size_t i = 1; i < order.size(); i++) {
            if (order[i][0] >= end) { kept++; end = order[i][1]; }
        }
        return (int)intervals.size() - kept;
    }
};`,
  },

  // Greedy on start time instead of end time.
  wrong: {
    python: `class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        if not intervals:
            return 0
        order = sorted(intervals)
        kept = 1
        end = order[0][1]
        for iv in order[1:]:
            if iv[0] >= end:
                kept += 1
                end = iv[1]
        return len(intervals) - kept`,
    cpp: `class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        vector<vector<int> > order = intervals;
        sort(order.begin(), order.end());
        int kept = 1, end = order[0][1];
        for (size_t i = 1; i < order.size(); i++) {
            if (order[i][0] >= end) { kept++; end = order[i][1]; }
        }
        return (int)intervals.size() - kept;
    }
};`,
  },

  visible: [
    'intervals = [[1,2],[2,3],[3,4],[1,3]]',
    'intervals = [[1,2],[1,2],[1,2]]',
    'intervals = [[1,2],[2,3]]',
    'intervals = [[1,100],[11,22],[1,11],[2,12]]',
  ],

  hidden: [
    'intervals = [[1,2]]',
    'intervals = [[0,2],[1,3],[2,4],[3,5],[4,6]]',
    'intervals = [[-52,31],[-73,-26],[82,97],[-65,-11],[-62,-49],[95,99],[58,95],[-31,49],[66,98],[-63,2],[30,47],[-40,-26]]',
    'intervals = [[1,2],[3,4],[5,6]]',
    'intervals = [[1,10],[2,3],[3,4],[4,5]]',
    'intervals = [[-1,1],[0,2],[1,3]]',
    'intervals = [[5,10],[6,8],[1,5],[2,3],[1,10]]',
    `intervals = [${many}]`,
  ],
}
