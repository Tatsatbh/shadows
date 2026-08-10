import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_LISTNODE, CPP_LISTNODE, PY_LIST_HELPERS, CPP_LIST_HELPERS,
} from './_drivers.mjs'

const long = Array.from({ length: 10000 }, (_, i) => i)

export default {
  question_number: 50,
  title: 'Linked List Cycle',
  difficulty: 'Easy',
  question_uri: 'linked-list-cycle',
  summary: 'Detect whether a linked list loops back on itself.',

  description_md: `Given the \`head\` of a linked list, determine if the list has a **cycle** in it.

A cycle exists if some node can be reached again by continuously following \`next\`.

### Input format

The list is given as an array of values, plus \`pos\` — the index of the node that the tail connects to. \`pos = -1\` means the list has no cycle. \`pos\` is **not** passed to your function; the driver wires up the cycle before calling it.

Floyd's tortoise-and-hare gives an O(1) space solution.

---

**Example 1**
\`\`\`text
Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: The tail connects back to the node at index 1.
\`\`\`

**Example 2**
\`\`\`text
Input: head = [1,2], pos = 0
Output: true
\`\`\`

**Example 3**
\`\`\`text
Input: head = [1], pos = -1
Output: false
\`\`\`

## Constraints

- The number of nodes is in the range \`[0, 10^4]\`.
- \`-10^5 <= Node.val <= 10^5\`
- \`pos\` is \`-1\` or a valid index in the list.
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}


${PY_LISTNODE}`,
      code: `class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        pass
`,
      main: `${PY_HELPERS}


${PY_LIST_HELPERS}


def _attach_cycle(head, pos):
    if head is None or pos < 0:
        return head
    target = head
    for _ in range(pos):
        if target.next is None:
            return head
        target = target.next
    tail = head
    while tail.next is not None:
        tail = tail.next
    tail.next = target
    return head


if __name__ == "__main__":
    _ls = _lines()
    _head = _build_list(_pints(_ls[0] if len(_ls) > 0 else ""))
    _pos = _pint(_ls[1] if len(_ls) > 1 else "-1")
    _head = _attach_cycle(_head, _pos)
    print("true" if Solution().hasCycle(_head) else "false")
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

${CPP_LISTNODE}`,
      code: `class Solution {
public:
    bool hasCycle(ListNode *head) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_LIST_HELPERS}

static ListNode* _attachCycle(ListNode* head, int pos) {
    if (head == NULL || pos < 0) return head;
    ListNode* target = head;
    for (int i = 0; i < pos; i++) {
        if (target->next == NULL) return head;
        target = target->next;
    }
    ListNode* tail = head;
    while (tail->next != NULL) tail = tail->next;
    tail->next = target;
    return head;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    ListNode* head = _buildList(_pints(ls[0]));
    int pos = _pint(ls[1]);
    head = _attachCycle(head, pos);

    Solution sol;
    cout << (sol.hasCycle(head) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = head
        fast = head
        while fast is not None and fast.next is not None:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False`,
    cpp: `class Solution {
public:
    bool hasCycle(ListNode *head) {
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast != NULL && fast->next != NULL) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};`,
  },

  // Bounded walk: declares a cycle after 5000 steps, so a long but perfectly
  // acyclic list (still inside the 10^4 limit) is misreported as cyclic.
  wrong: {
    python: `class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        steps = 0
        node = head
        while node is not None:
            steps += 1
            if steps > 5000:
                return True
            node = node.next
        return False`,
    cpp: `class Solution {
public:
    bool hasCycle(ListNode *head) {
        long long steps = 0;
        ListNode* node = head;
        while (node != NULL) {
            if (++steps > 5000) return true;
            node = node->next;
        }
        return false;
    }
};`,
  },

  visible: [
    'head = [3,2,0,-4]\npos = 1',
    'head = [1,2]\npos = 0',
    'head = [1]\npos = -1',
    'head = []\npos = -1',
  ],

  hidden: [
    'head = [1]\npos = 0',
    'head = [1,2]\npos = -1',
    'head = [1,2,3,4,5]\npos = 4',
    'head = [1,2,3,4,5]\npos = -1',
    'head = [-1,-7,7,-4,19,6,-9,-5,-2,-5]\npos = 6',
    'head = [0,0,0,0]\npos = 2',
    'head = [1,2,3]\npos = 1',
    `head = [${long.join(',')}]\npos = -1`,
  ],
}
