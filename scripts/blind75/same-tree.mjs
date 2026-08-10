import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_TREENODE, CPP_TREENODE, PY_TREE_HELPERS, CPP_TREE_HELPERS,
} from './_drivers.mjs'

const chain = ['1']
for (let i = 2; i <= 1000; i++) chain.push(String(i), 'null')

export default {
  question_number: 62,
  title: 'Same Tree',
  difficulty: 'Easy',
  question_uri: 'same-tree',
  summary: 'Decide whether two binary trees are structurally identical with equal values.',

  description_md: `Given the roots of two binary trees \`p\` and \`q\`, return \`true\` if they are **the same tree**.

Two binary trees are the same when they are structurally identical **and** every corresponding pair of nodes holds the same value. Structure matters on its own: a left child and a right child are not interchangeable.

Trees are given in level order, with \`null\` marking an absent child.

---

**Example 1**
\`\`\`text
Input: p = [1,2,3], q = [1,2,3]
Output: true
\`\`\`

**Example 2**
\`\`\`text
Input: p = [1,2], q = [1,null,2]
Output: false
Explanation: Same values, but one hangs left and the other right.
\`\`\`

**Example 3**
\`\`\`text
Input: p = [1,2,1], q = [1,1,2]
Output: false
\`\`\`

## Constraints

- The number of nodes in each tree is in the range \`[0, 100]\`.
- \`-10^4 <= Node.val <= 10^4\`
- Two empty trees are the same.
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


${PY_TREENODE}`,
      code: `class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        pass
`,
      main: `${PY_HELPERS}


${PY_TREE_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _p = _build_tree(_ptokens(_ls[0] if len(_ls) > 0 else ""))
    _q = _build_tree(_ptokens(_ls[1] if len(_ls) > 1 else ""))
    print("true" if Solution().isSameTree(_p, _q) else "false")
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

${CPP_TREENODE}`,
      code: `class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_TREE_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    TreeNode* p = _buildTree(_ptokens(ls[0]));
    TreeNode* q = _buildTree(_ptokens(ls[1]));

    Solution sol;
    cout << (sol.isSameTree(p, q) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        stack = [(p, q)]
        while stack:
            a, b = stack.pop()
            if a is None and b is None:
                continue
            if a is None or b is None or a.val != b.val:
                return False
            stack.append((a.left, b.left))
            stack.append((a.right, b.right))
        return True`,
    cpp: `class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        vector<pair<TreeNode*, TreeNode*> > stack;
        stack.push_back(make_pair(p, q));
        while (!stack.empty()) {
            pair<TreeNode*, TreeNode*> cur = stack.back();
            stack.pop_back();
            TreeNode* a = cur.first;
            TreeNode* b = cur.second;
            if (a == NULL && b == NULL) continue;
            if (a == NULL || b == NULL || a->val != b->val) return false;
            stack.push_back(make_pair(a->left, b->left));
            stack.push_back(make_pair(a->right, b->right));
        }
        return true;
    }
};`,
  },

  // Compares the multiset of values, ignoring structure.
  wrong: {
    python: `class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        def collect(node, out):
            if node is None:
                return
            out.append(node.val)
            collect(node.left, out)
            collect(node.right, out)
        a, b = [], []
        collect(p, a)
        collect(q, b)
        return sorted(a) == sorted(b)`,
    cpp: `class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        vector<int> a, b;
        collect(p, a);
        collect(q, b);
        sort(a.begin(), a.end());
        sort(b.begin(), b.end());
        return a == b;
    }

private:
    void collect(TreeNode* node, vector<int>& out) {
        if (node == NULL) return;
        out.push_back(node->val);
        collect(node->left, out);
        collect(node->right, out);
    }
};`,
  },

  visible: [
    'p = [1,2,3]\nq = [1,2,3]',
    'p = [1,2]\nq = [1,null,2]',
    'p = [1,2,1]\nq = [1,1,2]',
    'p = []\nq = []',
  ],

  hidden: [
    'p = [1]\nq = []',
    'p = []\nq = [1]',
    'p = [1]\nq = [2]',
    'p = [1,2,3,4,5]\nq = [1,2,3,4,5]',
    'p = [1,2,3,4,5]\nq = [1,2,3,4,6]',
    'p = [10,5,15]\nq = [10,5,15]',
    'p = [1,null,2,null,3]\nq = [1,null,2,null,3]',
    `p = [${chain.join(',')}]\nq = [${chain.join(',')}]`,
  ],
}
