import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const many = []
for (let i = 0; i < 2000; i++) {
  many.push(`"addNum ${(i * 7919) % 4001}"`)
  if (i % 200 === 0) many.push('"findMedian"')
}
many.push('"findMedian"')

export default {
  question_number: 76,
  title: 'Find Median from Data Stream',
  difficulty: 'Hard',
  question_uri: 'find-median-from-data-stream',
  summary: 'Maintain a running median as numbers arrive one at a time.',

  description_md: `The **median** is the middle value of an ordered list. When the list has an even number of values, it is the mean of the two middle values.

Implement the \`MedianFinder\` class:

- \`addNum(num)\` — adds \`num\` to the data structure
- \`findMedian()\` — returns the median of all elements added so far

Re-sorting on every query is too slow. Two heaps — a max-heap of the lower half and a min-heap of the upper half, kept balanced — give O(log n) insert and O(1) query.

### Input format

Operations come as an array of strings, one per entry:

\`\`\`text
ops = ["addNum 1","addNum 2","findMedian","addNum 3","findMedian"]
\`\`\`

### Output format

Print the number of \`findMedian\` calls on the first line, then one median per line, formatted to **exactly five decimal places** so the two languages agree.

---

**Example 1**
\`\`\`text
Input: ops = ["addNum 1","addNum 2","findMedian","addNum 3","findMedian"]
Output:
2
1.50000
2.00000
\`\`\`

**Example 2**
\`\`\`text
Input: ops = ["addNum 5","findMedian"]
Output:
1
5.00000
\`\`\`

**Example 3**
\`\`\`text
Input: ops = ["addNum -1","addNum -2","findMedian"]
Output:
1
-1.50000
\`\`\`

## Constraints

- \`-10^5 <= num <= 10^5\`
- \`findMedian\` is only called after at least one element has been added.
- At most \`5 * 10^4\` calls in total.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}
import heapq`,
      code: `class MedianFinder:
    def __init__(self):
        pass

    def addNum(self, num: int) -> None:
        pass

    def findMedian(self) -> float:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _ops = _pstrs(_ls[0] if len(_ls) > 0 else "")
    _mf = MedianFinder()
    _results = []
    for _op in _ops:
        _parts = _op.split(" ", 1)
        _name = _parts[0]
        if _name == "addNum":
            _mf.addNum(int(_parts[1]))
        elif _name == "findMedian":
            _results.append("%.5f" % float(_mf.findMedian()))
    print(len(_results))
    for _r in _results:
        print(_r)
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}
#include <functional>
#include <cstdio>`,
      code: `class MedianFinder {
public:
    MedianFinder() {

    }

    void addNum(int num) {

    }

    double findMedian() {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<string> ops = _pstrs(ls[0]);

    MedianFinder mf;
    vector<string> results;
    for (size_t i = 0; i < ops.size(); i++) {
        size_t sp = ops[i].find(' ');
        string name = (sp == string::npos) ? ops[i] : ops[i].substr(0, sp);
        if (name == "addNum") {
            mf.addNum(stoi(ops[i].substr(sp + 1)));
        } else if (name == "findMedian") {
            char buf[64];
            snprintf(buf, sizeof(buf), "%.5f", mf.findMedian());
            results.push_back(string(buf));
        }
    }

    cout << results.size() << "\\n";
    for (size_t i = 0; i < results.size(); i++) cout << results[i] << "\\n";
    return 0;
}`,
    },
  },

  solutions: {
    python: `class MedianFinder:
    def __init__(self):
        self.lower = []  # max-heap via negated values
        self.upper = []  # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.lower, -num)
        heapq.heappush(self.upper, -heapq.heappop(self.lower))
        if len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def findMedian(self) -> float:
        if len(self.lower) > len(self.upper):
            return float(-self.lower[0])
        return (-self.lower[0] + self.upper[0]) / 2.0`,
    cpp: `class MedianFinder {
public:
    MedianFinder() {}

    void addNum(int num) {
        lower.push(num);
        upper.push(lower.top());
        lower.pop();
        if (upper.size() > lower.size()) {
            lower.push(upper.top());
            upper.pop();
        }
    }

    double findMedian() {
        if (lower.size() > upper.size()) return (double)lower.top();
        return ((double)lower.top() + (double)upper.top()) / 2.0;
    }

private:
    priority_queue<int> lower;                                      // max-heap
    priority_queue<int, vector<int>, greater<int> > upper;          // min-heap
};`,
  },

  // Keeps everything in a list and takes the middle without sorting.
  wrong: {
    python: `class MedianFinder:
    def __init__(self):
        self.values = []

    def addNum(self, num: int) -> None:
        self.values.append(num)

    def findMedian(self) -> float:
        n = len(self.values)
        if n % 2 == 1:
            return float(self.values[n // 2])
        return (self.values[n // 2 - 1] + self.values[n // 2]) / 2.0`,
    cpp: `class MedianFinder {
public:
    MedianFinder() {}

    void addNum(int num) { values.push_back(num); }

    double findMedian() {
        size_t n = values.size();
        if (n % 2 == 1) return (double)values[n / 2];
        return ((double)values[n / 2 - 1] + (double)values[n / 2]) / 2.0;
    }

private:
    vector<int> values;
};`,
  },

  visible: [
    'ops = ["addNum 1","addNum 2","findMedian","addNum 3","findMedian"]',
    'ops = ["addNum 5","findMedian"]',
    'ops = ["addNum -1","addNum -2","findMedian"]',
    'ops = ["addNum 3","addNum 1","addNum 2","findMedian"]',
  ],

  hidden: [
    'ops = ["addNum 0","findMedian"]',
    'ops = ["addNum 100000","addNum -100000","findMedian"]',
    'ops = ["addNum 5","addNum 5","addNum 5","findMedian"]',
    'ops = ["addNum 4","addNum 2","addNum 8","addNum 6","findMedian"]',
    'ops = ["addNum 1","findMedian","addNum 2","findMedian","addNum 3","findMedian","addNum 4","findMedian"]',
    'ops = ["addNum 9","addNum 1","addNum 5","addNum 3","addNum 7","findMedian"]',
    'ops = ["addNum -5","addNum -3","addNum -1","findMedian"]',
    `ops = [${many.join(',')}]`,
  ],
}
