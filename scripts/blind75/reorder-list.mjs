import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_LISTNODE, CPP_LISTNODE, PY_LIST_HELPERS, CPP_LIST_HELPERS,
} from './_drivers.mjs'

const long = Array.from({ length: 5000 }, (_, i) => i)

export default {
  question_number: 52,
  title: 'Reorder List',
  difficulty: 'Medium',
  question_uri: 'reorder-list',
  summary: 'Interleave a list front-to-back: first, last, second, second-last, and so on.',

  description_md: `You are given the head of a singly linked list \`L0 -> L1 -> ... -> Ln-1 -> Ln\`.

Reorder it in place to become \`L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...\`

You may not modify the values in the nodes — only the links between them.

The standard approach is three steps: find the middle, reverse the second half, then weave the halves together.

### Output format

Print the number of nodes on the first line, then their values space-separated.

---

**Example 1**
\`\`\`text
Input: head = [1,2,3,4]
Output:
4
1 4 2 3
\`\`\`

**Example 2**
\`\`\`text
Input: head = [1,2,3,4,5]
Output:
5
1 5 2 4 3
\`\`\`

**Example 3**
\`\`\`text
Input: head = [1]
Output:
1
1
\`\`\`

## Constraints

- The number of nodes is in the range \`[1, 5 * 10^4]\`.
- \`1 <= Node.val <= 1000\`
- The reordering must be done by relinking nodes, not by copying values.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}


${PY_LISTNODE}`,
      code: `class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        """Modify the list in-place instead of returning it."""
        pass
`,
      main: `${PY_HELPERS}


${PY_LIST_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _head = _build_list(_pints(_ls[0] if len(_ls) > 0 else ""))
    Solution().reorderList(_head)
    _out = _dump_list(_head)
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
    void reorderList(ListNode* head) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_LIST_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    ListNode* head = _buildList(_pints(ls[0]));

    Solution sol;
    sol.reorderList(head);

    vector<string> out = _dumpList(head);
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
    def reorderList(self, head: Optional[ListNode]) -> None:
        if head is None or head.next is None:
            return
        slow, fast = head, head
        while fast.next is not None and fast.next.next is not None:
            slow = slow.next
            fast = fast.next.next
        second = slow.next
        slow.next = None
        prev = None
        while second is not None:
            nxt = second.next
            second.next = prev
            prev = second
            second = nxt
        first = head
        while prev is not None:
            f_next = first.next
            p_next = prev.next
            first.next = prev
            prev.next = f_next
            first = f_next
            prev = p_next`,
    cpp: `class Solution {
public:
    void reorderList(ListNode* head) {
        if (head == NULL || head->next == NULL) return;
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast->next != NULL && fast->next->next != NULL) {
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode* second = slow->next;
        slow->next = NULL;
        ListNode* prev = NULL;
        while (second != NULL) {
            ListNode* nxt = second->next;
            second->next = prev;
            prev = second;
            second = nxt;
        }
        ListNode* first = head;
        while (prev != NULL) {
            ListNode* fNext = first->next;
            ListNode* pNext = prev->next;
            first->next = prev;
            prev->next = fNext;
            first = fNext;
            prev = pNext;
        }
    }
};`,
  },

  // Reverses the whole list instead of weaving the halves.
  wrong: {
    python: `class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        values = []
        node = head
        while node is not None:
            values.append(node.val)
            node = node.next
        values.reverse()
        node = head
        for v in values:
            node.val = v
            node = node.next`,
    cpp: `class Solution {
public:
    void reorderList(ListNode* head) {
        vector<int> values;
        for (ListNode* n = head; n != NULL; n = n->next) values.push_back(n->val);
        reverse(values.begin(), values.end());
        ListNode* n = head;
        for (size_t i = 0; i < values.size(); i++) { n->val = values[i]; n = n->next; }
    }
};`,
  },

  visible: ['head = [1,2,3,4]', 'head = [1,2,3,4,5]', 'head = [1]', 'head = [1,2]'],

  hidden: [
    'head = [1,2,3]',
    'head = [1,1,1,1]',
    'head = [5,4,3,2,1]',
    'head = [1,2,3,4,5,6]',
    'head = [1,2,3,4,5,6,7]',
    'head = [10,20]',
    'head = [1,2,3,4,5,6,7,8,9,10]',
    `head = [${long.join(',')}]`,
  ],
}
