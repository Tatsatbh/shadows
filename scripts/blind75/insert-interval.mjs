import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

const many = Array.from({ length: 5000 }, (_, i) => `[${i * 10},${i * 10 + 5}]`).join(',')

export default {
  question_number: 41,
  title: 'Insert Interval',
  difficulty: 'Medium',
  question_uri: 'insert-interval',
  summary: 'Insert a new interval into a sorted non-overlapping list, merging where it overlaps.',

  description_md: `You are given an array of non-overlapping intervals \`intervals\`, sorted by start time, and a new interval \`newInterval\`.

Insert \`newInterval\` so that the list remains sorted and non-overlapping, merging any intervals it touches, and return the result.

### Output format

Print the number of intervals on the first line, then one interval per line as \`start end\`.

---

**Example 1**
\`\`\`text
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output:
2
1 5
6 9
\`\`\`

**Example 2**
\`\`\`text
Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
Output:
3
1 2
3 10
12 16
\`\`\`

**Example 3**
\`\`\`text
Input: intervals = [], newInterval = [5,7]
Output:
1
5 7
\`\`\`

## Constraints

- \`0 <= intervals.length <= 10^4\`
- \`intervals[i].length == 2\` and \`0 <= start <= end <= 10^5\`
- \`intervals\` is sorted by start and contains no overlaps.
- Intervals that merely touch at an endpoint, such as \`[1,2]\` and \`[2,3]\`, are considered overlapping and merge.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _intervals = _pmatrix(_ls[0] if len(_ls) > 0 else "")
    _new = _pints(_ls[1] if len(_ls) > 1 else "")
    _res = Solution().insert(_intervals, _new) or []
    print(len(_res))
    for _iv in _res:
        print(" ".join(str(int(v)) for v in _iv))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_MATRIX}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<vector<int> > intervals = _pmatrix(ls[0]);
    vector<int> newInterval = _pints(ls[1]);

    Solution sol;
    vector<vector<int> > res = sol.insert(intervals, newInterval);
    cout << res.size() << "\\n";
    for (size_t i = 0; i < res.size(); i++) {
        for (size_t j = 0; j < res[i].size(); j++) {
            if (j) cout << " ";
            cout << res[i][j];
        }
        cout << "\\n";
    }
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        out = []
        start, end = newInterval[0], newInterval[1]
        i = 0
        n = len(intervals)
        while i < n and intervals[i][1] < start:
            out.append(intervals[i])
            i += 1
        while i < n and intervals[i][0] <= end:
            start = min(start, intervals[i][0])
            end = max(end, intervals[i][1])
            i += 1
        out.append([start, end])
        while i < n:
            out.append(intervals[i])
            i += 1
        return out`,
    cpp: `class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int> > out;
        int start = newInterval[0], end = newInterval[1];
        size_t i = 0, n = intervals.size();
        while (i < n && intervals[i][1] < start) out.push_back(intervals[i++]);
        while (i < n && intervals[i][0] <= end) {
            start = min(start, intervals[i][0]);
            end = max(end, intervals[i][1]);
            i++;
        }
        vector<int> merged;
        merged.push_back(start);
        merged.push_back(end);
        out.push_back(merged);
        while (i < n) out.push_back(intervals[i++]);
        return out;
    }
};`,
  },

  // Appends and sorts without merging.
  wrong: {
    python: `class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        return sorted(intervals + [newInterval])`,
    cpp: `class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int> > out = intervals;
        out.push_back(newInterval);
        sort(out.begin(), out.end());
        return out;
    }
};`,
  },

  visible: [
    'intervals = [[1,3],[6,9]]\nnewInterval = [2,5]',
    'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]]\nnewInterval = [4,8]',
    'intervals = []\nnewInterval = [5,7]',
    'intervals = [[1,5]]\nnewInterval = [2,3]',
  ],

  hidden: [
    'intervals = [[1,5]]\nnewInterval = [6,8]',
    'intervals = [[1,5]]\nnewInterval = [0,0]',
    'intervals = [[3,5],[12,15]]\nnewInterval = [6,6]',
    'intervals = [[1,2],[3,4]]\nnewInterval = [2,3]',
    'intervals = [[2,4],[6,8]]\nnewInterval = [1,9]',
    'intervals = [[1,2]]\nnewInterval = [3,4]',
    'intervals = [[0,1],[3,5],[7,9]]\nnewInterval = [4,8]',
    `intervals = [${many}]\nnewInterval = [15,25]`,
  ],
}
