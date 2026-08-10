import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_LISTNODE, CPP_LISTNODE, PY_LIST_HELPERS, CPP_LIST_HELPERS,
} from './_drivers.mjs'

const long = Array.from({ length: 5000 }, (_, i) => i)

export default {
  question_number: 51,
  title: 'Remove Nth Node From End of List',
  difficulty: 'Medium',
  question_uri: 'remove-nth-node-from-end-of-list',
  summary: 'Delete the nth node counting from the end, in a single pass.',

  description_md: `Given the \`head\` of a linked list, remove the \`n\`-th node **from the end** of the list and return the head.

The interesting version does it in **one pass**, using two pointers held \`n\` apart.

### Output format

Print the number of remaining nodes on the first line, then their values space-separated. An empty result prints \`0\` and nothing else.

---

**Example 1**
\`\`\`text
Input: head = [1,2,3,4,5], n = 2
Output:
4
1 2 3 5
\`\`\`

**Example 2**
\`\`\`text
Input: head = [1], n = 1
Output:
0
Explanation: Removing the only node leaves an empty list.
\`\`\`

**Example 3**
\`\`\`text
Input: head = [1,2], n = 2
Output:
1
2
Explanation: Removing from the end can remove the head itself.
\`\`\`

## Constraints

- The number of nodes is \`sz\`, with \`1 <= sz <= 5000\`.
- \`1 <= n <= sz\`
- \`0 <= Node.val <= 5000\`
- A two-pass length count is accepted, but aim for one pass.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}


${PY_LISTNODE}`,
      code: `class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        pass
`,
      main: `${PY_HELPERS}


${PY_LIST_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _head = _build_list(_pints(_ls[0] if len(_ls) > 0 else ""))
    _n = _pint(_ls[1] if len(_ls) > 1 else "0")
    _out = _dump_list(Solution().removeNthFromEnd(_head, _n))
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
    ListNode* removeNthFromEnd(ListNode* head, int n) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_LIST_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    ListNode* head = _buildList(_pints(ls[0]));
    int n = _pint(ls[1]);

    Solution sol;
    vector<string> out = _dumpList(sol.removeNthFromEnd(head, n));
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
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0)
        dummy.next = head
        fast = dummy
        slow = dummy
        for _ in range(n):
            if fast.next is None:
                return head
            fast = fast.next
        while fast.next is not None:
            fast = fast.next
            slow = slow.next
        slow.next = slow.next.next
        return dummy.next`,
    cpp: `class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0);
        dummy.next = head;
        ListNode* fast = &dummy;
        ListNode* slow = &dummy;
        for (int i = 0; i < n; i++) {
            if (fast->next == NULL) return head;
            fast = fast->next;
        }
        while (fast->next != NULL) { fast = fast->next; slow = slow->next; }
        slow->next = slow->next->next;
        return dummy.next;
    }
};`,
  },

  // Removes the nth node from the FRONT instead of the end.
  wrong: {
    python: `class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0)
        dummy.next = head
        prev = dummy
        for _ in range(n - 1):
            if prev.next is None:
                return dummy.next
            prev = prev.next
        if prev.next is not None:
            prev.next = prev.next.next
        return dummy.next`,
    cpp: `class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0);
        dummy.next = head;
        ListNode* prev = &dummy;
        for (int i = 0; i < n - 1; i++) {
            if (prev->next == NULL) return dummy.next;
            prev = prev->next;
        }
        if (prev->next != NULL) prev->next = prev->next->next;
        return dummy.next;
    }
};`,
  },

  visible: [
    'head = [1,2,3,4,5]\nn = 2',
    'head = [1]\nn = 1',
    'head = [1,2]\nn = 2',
    'head = [1,2]\nn = 1',
  ],

  hidden: [
    'head = [1,2,3]\nn = 3',
    'head = [1,2,3]\nn = 1',
    'head = [1,2,3,4,5]\nn = 5',
    'head = [1,2,3,4,5]\nn = 1',
    'head = [7,7,7,7]\nn = 2',
    'head = [0,1,2,3,4,5,6,7,8,9]\nn = 4',
    'head = [100]\nn = 1',
    `head = [${long.join(',')}]\nn = 2500`,
  ],
}
