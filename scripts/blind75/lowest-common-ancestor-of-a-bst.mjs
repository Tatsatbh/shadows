import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_TREENODE, CPP_TREENODE, PY_TREE_HELPERS, CPP_TREE_HELPERS,
} from './_drivers.mjs'

const chain = ['0']
for (let i = 1; i < 1000; i++) chain.push('null', String(i))

export default {
  question_number: 71,
  title: 'Lowest Common Ancestor of a Binary Search Tree',
  difficulty: 'Medium',
  question_uri: 'lowest-common-ancestor-of-a-bst',
  summary: 'Use BST ordering to find the deepest node that is an ancestor of both targets.',

  description_md: `Given a binary search tree and two of its nodes \`p\` and \`q\`, find their **lowest common ancestor** — the deepest node that has both as descendants. A node is allowed to be a descendant of itself.

Unlike the general binary-tree version, the BST ordering makes this a simple walk: if both values sit below the current node, go left; if both sit above, go right; otherwise the current node splits them and is the answer.

### Input format

The tree is given in level order, followed by the **values** of \`p\` and \`q\`. The driver locates those nodes and passes them to your function.

---

**Example 1**
\`\`\`text
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
\`\`\`

**Example 2**
\`\`\`text
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
Output: 2
Explanation: A node can be an ancestor of itself.
\`\`\`

**Example 3**
\`\`\`text
Input: root = [2,1], p = 2, q = 1
Output: 2
\`\`\`

## Constraints

- The number of nodes is in the range \`[2, 10^5]\`.
- \`-10^9 <= Node.val <= 10^9\`, all values unique
- \`p\` and \`q\` both exist in the tree and are different nodes.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


${PY_TREENODE}`,
      code: `class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        pass
`,
      main: `${PY_HELPERS}


${PY_TREE_HELPERS}


def _find_node(root, val):
    stack = [root]
    while stack:
        node = stack.pop()
        if node is None:
            continue
        if node.val == val:
            return node
        stack.append(node.left)
        stack.append(node.right)
    return None


if __name__ == "__main__":
    _ls = _lines()
    _root = _build_tree(_ptokens(_ls[0] if len(_ls) > 0 else ""))
    _p = _find_node(_root, _pint(_ls[1] if len(_ls) > 1 else "0"))
    _q = _find_node(_root, _pint(_ls[2] if len(_ls) > 2 else "0"))
    _res = Solution().lowestCommonAncestor(_root, _p, _q)
    print(_res.val if _res is not None else "null")
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

${CPP_TREENODE}`,
      code: `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_TREE_HELPERS}

static TreeNode* _findNode(TreeNode* root, int val) {
    vector<TreeNode*> stack;
    stack.push_back(root);
    while (!stack.empty()) {
        TreeNode* node = stack.back();
        stack.pop_back();
        if (node == NULL) continue;
        if (node->val == val) return node;
        stack.push_back(node->left);
        stack.push_back(node->right);
    }
    return NULL;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    TreeNode* root = _buildTree(_ptokens(ls[0]));
    TreeNode* p = _findNode(root, _pint(ls[1]));
    TreeNode* q = _findNode(root, _pint(ls[2]));

    Solution sol;
    TreeNode* res = sol.lowestCommonAncestor(root, p, q);
    if (res != NULL) cout << res->val << endl;
    else cout << "null" << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        node = root
        while node is not None:
            if p.val < node.val and q.val < node.val:
                node = node.left
            elif p.val > node.val and q.val > node.val:
                node = node.right
            else:
                return node
        return None`,
    cpp: `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        TreeNode* node = root;
        while (node != NULL) {
            if (p->val < node->val && q->val < node->val) node = node->left;
            else if (p->val > node->val && q->val > node->val) node = node->right;
            else return node;
        }
        return NULL;
    }
};`,
  },

  // Always answers with the root.
  wrong: {
    python: `class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        return root`,
    cpp: `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        return root;
    }
};`,
  },

  visible: [
    'root = [6,2,8,0,4,7,9,null,null,3,5]\np = 2\nq = 8',
    'root = [6,2,8,0,4,7,9,null,null,3,5]\np = 2\nq = 4',
    'root = [2,1]\np = 2\nq = 1',
    'root = [6,2,8,0,4,7,9,null,null,3,5]\np = 3\nq = 5',
  ],

  hidden: [
    'root = [5,3,8,1,4,7,9]\np = 1\nq = 4',
    'root = [5,3,8,1,4,7,9]\np = 1\nq = 9',
    'root = [5,3,8,1,4,7,9]\np = 7\nq = 9',
    'root = [10,5,15,2,7,12,20]\np = 2\nq = 7',
    'root = [10,5,15,2,7,12,20]\np = 12\nq = 20',
    'root = [2,1,3]\np = 1\nq = 3',
    'root = [-1000000000,-1000000001]\np = -1000000000\nq = -1000000001',
    `root = [${chain.join(',')}]\np = 500\nq = 900`,
  ],
}
