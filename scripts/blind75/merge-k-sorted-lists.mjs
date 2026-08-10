import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX,
  PY_LISTNODE, CPP_LISTNODE, PY_LIST_HELPERS, CPP_LIST_HELPERS,
} from './_drivers.mjs'

// 100 lists of 100 values each, interleaved so no single list dominates.
const many = Array.from(
  { length: 100 },
  (_, k) => `[${Array.from({ length: 100 }, (_, i) => i * 100 + k).join(',')}]`
).join(',')

export default {
  question_number: 53,
  title: 'Merge k Sorted Lists',
  difficulty: 'Hard',
  question_uri: 'merge-k-sorted-lists',
  summary: 'Merge k sorted linked lists into one sorted list, efficiently.',

  description_md: `You are given an array of \`k\` linked lists, each sorted in ascending order.

Merge all of them into a single sorted linked list and return its head.

The naive approach concatenates and sorts in O(N log N); the intended solutions use a **min-heap** of the k current heads, or repeated **pairwise merging**, for O(N log k).

### Input format

The lists are given as an array of arrays. The driver builds each linked list and passes the array of heads to your function.

### Output format

Print the total number of nodes on the first line, then the values space-separated. An empty result prints \`0\`.

---

**Example 1**
\`\`\`text
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output:
8
1 1 2 3 4 4 5 6
Explanation: The three lists hold 3 + 3 + 2 = 8 values in total.
\`\`\`

**Example 2**
\`\`\`text
Input: lists = []
Output:
0
\`\`\`

**Example 3**
\`\`\`text
Input: lists = [[]]
Output:
0
Explanation: A single empty list still merges to nothing.
\`\`\`

## Constraints

- \`0 <= k <= 10^4\`
- \`0 <= lists[i].length <= 500\`
- \`-10^4 <= lists[i][j] <= 10^4\`
- Each \`lists[i]\` is sorted in ascending order.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}


${PY_LISTNODE}`,
      code: `class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


${PY_LIST_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _rows = _pmatrix(_ls[0] if len(_ls) > 0 else "")
    _heads = [_build_list(_row) for _row in _rows]
    _out = _dump_list(Solution().mergeKLists(_heads))
    print(len(_out))
    if _out:
        print(" ".join(_out))
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

${CPP_LISTNODE}`,
      code: `class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_MATRIX}

${CPP_LIST_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<vector<int> > rows = _pmatrix(ls[0]);
    vector<ListNode*> heads;
    for (size_t i = 0; i < rows.size(); i++) heads.push_back(_buildList(rows[i]));

    Solution sol;
    vector<string> out = _dumpList(sol.mergeKLists(heads));
    cout << out.size() << "\\n";
    if (!out.empty()) {
        for (size_t i = 0; i < out.size(); i++) {
            if (i) cout << " ";
            cout << out[i];
        }
        cout << "\\n";
    }
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        def merge_two(a, b):
            dummy = ListNode(0)
            tail = dummy
            while a is not None and b is not None:
                if a.val <= b.val:
                    tail.next = a
                    a = a.next
                else:
                    tail.next = b
                    b = b.next
                tail = tail.next
            tail.next = a if a is not None else b
            return dummy.next

        queue = [node for node in lists if node is not None]
        if not queue:
            return None
        while len(queue) > 1:
            merged = []
            for i in range(0, len(queue), 2):
                if i + 1 < len(queue):
                    merged.append(merge_two(queue[i], queue[i + 1]))
                else:
                    merged.append(queue[i])
            queue = merged
        return queue[0]`,
    cpp: `class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        vector<ListNode*> queue;
        for (size_t i = 0; i < lists.size(); i++) {
            if (lists[i] != NULL) queue.push_back(lists[i]);
        }
        if (queue.empty()) return NULL;
        while (queue.size() > 1) {
            vector<ListNode*> merged;
            for (size_t i = 0; i < queue.size(); i += 2) {
                if (i + 1 < queue.size()) merged.push_back(mergeTwo(queue[i], queue[i + 1]));
                else merged.push_back(queue[i]);
            }
            queue = merged;
        }
        return queue[0];
    }

private:
    ListNode* mergeTwo(ListNode* a, ListNode* b) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (a != NULL && b != NULL) {
            if (a->val <= b->val) { tail->next = a; a = a->next; }
            else { tail->next = b; b = b->next; }
            tail = tail->next;
        }
        tail->next = (a != NULL) ? a : b;
        return dummy.next;
    }
};`,
  },

  // Concatenates the lists without merging, so the result is not sorted.
  wrong: {
    python: `class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        dummy = ListNode(0)
        tail = dummy
        for node in lists:
            while node is not None:
                tail.next = ListNode(node.val)
                tail = tail.next
                node = node.next
        return dummy.next`,
    cpp: `class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        for (size_t i = 0; i < lists.size(); i++) {
            for (ListNode* n = lists[i]; n != NULL; n = n->next) {
                tail->next = new ListNode(n->val);
                tail = tail->next;
            }
        }
        return dummy.next;
    }
};`,
  },

  visible: [
    'lists = [[1,4,5],[1,3,4],[2,6]]',
    'lists = []',
    'lists = [[]]',
    'lists = [[1],[0]]',
  ],

  hidden: [
    'lists = [[1,2,3]]',
    'lists = [[],[1]]',
    'lists = [[],[]]',
    'lists = [[-10,-5,0],[-8,-3,2],[-1,1]]',
    'lists = [[1,1,1],[1,1],[1]]',
    'lists = [[5],[4],[3],[2],[1]]',
    'lists = [[1,3,5,7],[2,4,6,8],[0,9]]',
    `lists = [${many}]`,
  ],
}
