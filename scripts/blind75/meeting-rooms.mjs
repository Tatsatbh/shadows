import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

const many = Array.from({ length: 5000 }, (_, i) => `[${i * 10},${i * 10 + 9}]`).join(',')

export default {
  question_number: 43,
  title: 'Meeting Rooms',
  difficulty: 'Easy',
  question_uri: 'meeting-rooms',
  summary: 'Decide whether a person could attend every meeting without a clash.',

  description_md: `Given an array of meeting time intervals \`intervals\` where \`intervals[i] = [start, end]\`, determine if a person could attend **all** meetings.

Meetings that merely touch — one ending exactly when the next begins — do **not** conflict.

---

**Example 1**
\`\`\`text
Input: intervals = [[0,30],[5,10],[15,20]]
Output: false
Explanation: [0,30] overlaps [5,10].
\`\`\`

**Example 2**
\`\`\`text
Input: intervals = [[7,10],[2,4]]
Output: true
\`\`\`

**Example 3**
\`\`\`text
Input: intervals = [[1,2],[2,3]]
Output: true
Explanation: The first ends exactly when the second starts.
\`\`\`

## Constraints

- \`0 <= intervals.length <= 10^4\`
- \`0 <= start < end <= 10^6\`
- The input is **not** guaranteed to be sorted.
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _intervals = _pmatrix(_ls[0] if len(_ls) > 0 else "")
    print("true" if Solution().canAttendMeetings(_intervals) else "false")
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {

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
    cout << (sol.canAttendMeetings(intervals) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        order = sorted(intervals)
        for i in range(1, len(order)):
            if order[i][0] < order[i - 1][1]:
                return False
        return True`,
    cpp: `class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        vector<vector<int> > order = intervals;
        sort(order.begin(), order.end());
        for (size_t i = 1; i < order.size(); i++) {
            if (order[i][0] < order[i - 1][1]) return false;
        }
        return true;
    }
};`,
  },

  // Forgets to sort, so unsorted input is misjudged.
  wrong: {
    python: `class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        for i in range(1, len(intervals)):
            if intervals[i][0] < intervals[i - 1][1]:
                return False
        return True`,
    cpp: `class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        for (size_t i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] < intervals[i - 1][1]) return false;
        }
        return true;
    }
};`,
  },

  visible: [
    'intervals = [[0,30],[5,10],[15,20]]',
    'intervals = [[7,10],[2,4]]',
    'intervals = [[1,2],[2,3]]',
    'intervals = []',
  ],

  hidden: [
    'intervals = [[1,5]]',
    'intervals = [[5,8],[6,8]]',
    'intervals = [[13,15],[1,13]]',
    'intervals = [[9,10],[4,9],[4,17]]',
    'intervals = [[2,7]]',
    'intervals = [[1,2],[3,4],[5,6],[7,8]]',
    'intervals = [[8,9],[6,7],[4,5],[2,3],[0,1]]',
    `intervals = [${many}]`,
  ],
}
