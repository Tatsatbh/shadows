import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

// 3000 meetings all overlapping the same instant, so the answer is 3000.
const many = Array.from({ length: 3000 }, (_, i) => `[${i},${6000 - i}]`).join(',')

export default {
  question_number: 44,
  title: 'Meeting Rooms II',
  difficulty: 'Medium',
  question_uri: 'meeting-rooms-ii',
  summary: 'Find the minimum number of rooms needed to host all meetings without conflicts.',

  description_md: `Given an array of meeting time intervals \`intervals\` where \`intervals[i] = [start, end]\`, return the **minimum number of conference rooms** required to hold all the meetings.

A meeting ending exactly when another begins can reuse the same room.

The usual solutions are a min-heap of end times, or a sweep over separately sorted start and end times.

---

**Example 1**
\`\`\`text
Input: intervals = [[0,30],[5,10],[15,20]]
Output: 2
Explanation: [0,30] needs its own room; [5,10] and [15,20] share the second.
\`\`\`

**Example 2**
\`\`\`text
Input: intervals = [[7,10],[2,4]]
Output: 1
\`\`\`

**Example 3**
\`\`\`text
Input: intervals = [[1,2],[2,3],[3,4]]
Output: 1
Explanation: Each meeting ends as the next starts, so one room suffices.
\`\`\`

## Constraints

- \`0 <= intervals.length <= 10^4\`
- \`0 <= start < end <= 10^6\`
- An empty schedule needs \`0\` rooms.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _intervals = _pmatrix(_ls[0] if len(_ls) > 0 else "")
    print(Solution().minMeetingRooms(_intervals))
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {

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
    cout << sol.minMeetingRooms(intervals) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        if not intervals:
            return 0
        starts = sorted(iv[0] for iv in intervals)
        ends = sorted(iv[1] for iv in intervals)
        rooms = 0
        best = 0
        i = j = 0
        while i < len(starts):
            if starts[i] < ends[j]:
                rooms += 1
                best = max(best, rooms)
                i += 1
            else:
                rooms -= 1
                j += 1
        return best`,
    cpp: `class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        vector<int> starts, ends;
        for (size_t k = 0; k < intervals.size(); k++) {
            starts.push_back(intervals[k][0]);
            ends.push_back(intervals[k][1]);
        }
        sort(starts.begin(), starts.end());
        sort(ends.begin(), ends.end());
        int rooms = 0, best = 0;
        size_t i = 0, j = 0;
        while (i < starts.size()) {
            if (starts[i] < ends[j]) { rooms++; best = max(best, rooms); i++; }
            else { rooms--; j++; }
        }
        return best;
    }
};`,
  },

  // Counts only pairwise-adjacent clashes after sorting by start.
  wrong: {
    python: `class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        if not intervals:
            return 0
        order = sorted(intervals)
        clashes = 0
        for i in range(1, len(order)):
            if order[i][0] < order[i - 1][1]:
                clashes += 1
        return 1 + clashes if order else 0`,
    cpp: `class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        vector<vector<int> > order = intervals;
        sort(order.begin(), order.end());
        int clashes = 0;
        for (size_t i = 1; i < order.size(); i++) {
            if (order[i][0] < order[i - 1][1]) clashes++;
        }
        return 1 + clashes;
    }
};`,
  },

  visible: [
    'intervals = [[0,30],[5,10],[15,20]]',
    'intervals = [[7,10],[2,4]]',
    'intervals = [[1,2],[2,3],[3,4]]',
    'intervals = []',
  ],

  hidden: [
    'intervals = [[1,5]]',
    'intervals = [[1,5],[2,6],[3,7]]',
    'intervals = [[9,10],[4,9],[4,17]]',
    'intervals = [[2,11],[6,16],[11,16]]',
    'intervals = [[1,10],[2,3],[4,5],[6,7],[8,9]]',
    'intervals = [[0,1],[0,1],[0,1],[0,1]]',
    'intervals = [[5,8],[6,8],[7,9],[1,2]]',
    `intervals = [${many}]`,
  ],
}
