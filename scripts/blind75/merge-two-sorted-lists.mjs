import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_LISTNODE, CPP_LISTNODE, PY_LIST_HELPERS, CPP_LIST_HELPERS,
} from './_drivers.mjs'

const evens = Array.from({ length: 2500 }, (_, i) => i * 2)
const odds = Array.from({ length: 2500 }, (_, i) => i * 2 + 1)

export default {
  question_number: 49,
  title: 'Merge Two Sorted Lists',
  difficulty: 'Easy',
  question_uri: 'merge-two-sorted-lists',
  summary: 'Splice two sorted linked lists into one sorted list.',

  description_md: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge them into a single **sorted** list, formed by splicing together the nodes of the two lists, and return the head of the merged list.

### Output format

Print the number of nodes on the first line, then the values space-separated on the second line. An empty result prints \`0\` and nothing else.

---

**Example 1**
\`\`\`text
Input: list1 = [1,2,4], list2 = [1,3,4]
Output:
6
1 1 2 3 4 4
\`\`\`

**Example 2**
\`\`\`text
Input: list1 = [], list2 = []
Output:
0
\`\`\`

**Example 3**
\`\`\`text
Input: list1 = [], list2 = [0]
Output:
1
0
\`\`\`

## Constraints

- The number of nodes in each list is in the range \`[0, 50]\`.
- \`-100 <= Node.val <= 100\`
- Both lists are already sorted in non-decreasing order.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}


${PY_LISTNODE}`,
      code: `class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        pass
`,
      main: `${PY_HELPERS}


${PY_LIST_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _a = _build_list(_pints(_ls[0] if len(_ls) > 0 else ""))
    _b = _build_list(_pints(_ls[1] if len(_ls) > 1 else ""))
    _out = _dump_list(Solution().mergeTwoLists(_a, _b))
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
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_LIST_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    ListNode* a = _buildList(_pints(ls[0]));
    ListNode* b = _buildList(_pints(ls[1]));

    Solution sol;
    vector<string> out = _dumpList(sol.mergeTwoLists(a, b));
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
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        tail = dummy
        while list1 is not None and list2 is not None:
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        tail.next = list1 if list1 is not None else list2
        return dummy.next`,
    cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (list1 != NULL && list2 != NULL) {
            if (list1->val <= list2->val) { tail->next = list1; list1 = list1->next; }
            else { tail->next = list2; list2 = list2->next; }
            tail = tail->next;
        }
        tail->next = (list1 != NULL) ? list1 : list2;
        return dummy.next;
    }
};`,
  },

  // Drops whatever remains of the longer list.
  wrong: {
    python: `class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        tail = dummy
        while list1 is not None and list2 is not None:
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        return dummy.next`,
    cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (list1 != NULL && list2 != NULL) {
            if (list1->val <= list2->val) { tail->next = list1; list1 = list1->next; }
            else { tail->next = list2; list2 = list2->next; }
            tail = tail->next;
        }
        tail->next = NULL;
        return dummy.next;
    }
};`,
  },

  visible: [
    'list1 = [1,2,4]\nlist2 = [1,3,4]',
    'list1 = []\nlist2 = []',
    'list1 = []\nlist2 = [0]',
    'list1 = [5]\nlist2 = [1,2,3]',
  ],

  hidden: [
    'list1 = [1]\nlist2 = []',
    'list1 = [1,3,5]\nlist2 = [2,4,6]',
    'list1 = [-100,0,100]\nlist2 = [-50,50]',
    'list1 = [1,1,1]\nlist2 = [1,1]',
    'list1 = [2]\nlist2 = [1]',
    'list1 = [1,2,3,4,5]\nlist2 = [6]',
    'list1 = [0,0]\nlist2 = [0,0]',
    `list1 = [${evens.join(',')}]\nlist2 = [${odds.join(',')}]`,
  ],
}
