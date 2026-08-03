import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const stress = Array.from({ length: 5000 }, (_, i) => (i * 13) % 5001)

export default {
  question_number: 12,
  title: 'Reverse Linked List',
  difficulty: 'Easy',
  question_uri: 'reverse-linked-list',
  summary: 'Reverse a singly linked list and return the new head.',

  description_md: `Given the \`head\` of a singly linked list, reverse the list and return the head of the reversed list.

The list is given as an array of its values, in order from head to tail.

### Output format

Print the number of nodes on the first line, then the reversed values space-separated on the second line. An empty list prints \`0\` and nothing else.

---

**Example 1**
\`\`\`text
Input: head = [1,2,3,4,5]
Output:
5
5 4 3 2 1
\`\`\`

**Example 2**
\`\`\`text
Input: head = [1,2]
Output:
2
2 1
\`\`\`

**Example 3**
\`\`\`text
Input: head = []
Output:
0
\`\`\`

## Constraints

- The number of nodes is in the range \`[0, 5000]\`.
- \`-5000 <= Node.val <= 5000\`
- Try it both iteratively and recursively.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next`,
      code: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        pass
`,
      main: `${PY_HELPERS}


def _build_list(values):
    head = None
    for v in reversed(values):
        node = ListNode(v)
        node.next = head
        head = node
    return head


if __name__ == "__main__":
    _ls = _lines()
    _values = _pints(_ls[0] if len(_ls) > 0 else "")
    _node = Solution().reverseList(_build_list(_values))
    _out = []
    while _node is not None:
        _out.append(str(_node.val))
        _node = _node.next
    print(len(_out))
    if _out:
        print(" ".join(_out))
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(NULL) {}
    ListNode(int x) : val(x), next(NULL) {}
};`,
      code: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {

    }
};`,
      main: `${CPP_HELPERS}

static ListNode* _buildList(const vector<int>& values) {
    ListNode* head = NULL;
    for (int i = (int)values.size() - 1; i >= 0; i--) {
        ListNode* node = new ListNode(values[i]);
        node->next = head;
        head = node;
    }
    return head;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> values = _pints(ls[0]);

    Solution sol;
    ListNode* node = sol.reverseList(_buildList(values));

    vector<int> out;
    while (node != NULL) {
        out.push_back(node->val);
        node = node->next;
    }
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
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr is not None:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev`,
    cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = NULL;
        ListNode* curr = head;
        while (curr != NULL) {
            ListNode* nxt = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }
};`,
  },

  // Returns the list untouched.
  wrong: {
    python: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        return head`,
    cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        return head;
    }
};`,
  },

  visible: [
    'head = [1,2,3,4,5]',
    'head = [1,2]',
    'head = []',
    'head = [1]',
  ],

  hidden: [
    'head = [1,2,3]',
    'head = [-1,-2,-3]',
    'head = [0,0]',
    'head = [5,4,3,2,1]',
    'head = [1,1,2,2]',
    'head = [7]',
    'head = [1,2,3,4,5,6,7,8,9,10]',
    `head = [${stress.join(',')}]`,
  ],
}
