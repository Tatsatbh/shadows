import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_TREENODE, CPP_TREENODE, PY_TREE_HELPERS, CPP_TREE_HELPERS,
} from './_drivers.mjs'

// Right-leaning chain 0,1,2,...,999 — a valid BST that is 1000 deep.
const chain = ['0']
for (let i = 1; i < 1000; i++) chain.push('null', String(i))

export default {
  question_number: 70,
  title: 'Kth Smallest Element in a BST',
  difficulty: 'Medium',
  question_uri: 'kth-smallest-element-in-a-bst',
  summary: 'Return the kth smallest value in a binary search tree.',

  description_md: `Given the \`root\` of a binary search tree and an integer \`k\`, return the \`k\`-th **smallest** value (**1-indexed**) among all node values.

An inorder traversal of a BST visits values in ascending order, so the answer is simply the \`k\`-th node visited — and you can stop as soon as you reach it.

Trees are given in level order, with \`null\` marking an absent child.

---

**Example 1**
\`\`\`text
Input: root = [3,1,4,null,2], k = 1
Output: 1
\`\`\`

**Example 2**
\`\`\`text
Input: root = [5,3,6,2,4,null,null,1], k = 3
Output: 3
\`\`\`

**Example 3**
\`\`\`text
Input: root = [1], k = 1
Output: 1
\`\`\`

## Constraints

- The number of nodes is \`n\`, with \`1 <= k <= n <= 10^4\`.
- \`0 <= Node.val <= 10^4\`
- The tree is a valid BST, and \`k\` is always in range.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


${PY_TREENODE}`,
      code: `class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        pass
`,
      main: `${PY_HELPERS}


${PY_TREE_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _root = _build_tree(_ptokens(_ls[0] if len(_ls) > 0 else ""))
    _k = _pint(_ls[1] if len(_ls) > 1 else "1")
    print(Solution().kthSmallest(_root, _k))
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

${CPP_TREENODE}`,
      code: `class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_TREE_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    TreeNode* root = _buildTree(_ptokens(ls[0]));
    int k = _pint(ls[1]);

    Solution sol;
    cout << sol.kthSmallest(root, k) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        stack = []
        node = root
        seen = 0
        while stack or node is not None:
            while node is not None:
                stack.append(node)
                node = node.left
            node = stack.pop()
            seen += 1
            if seen == k:
                return node.val
            node = node.right
        return -1`,
    cpp: `class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        vector<TreeNode*> stack;
        TreeNode* node = root;
        int seen = 0;
        while (!stack.empty() || node != NULL) {
            while (node != NULL) { stack.push_back(node); node = node->left; }
            node = stack.back();
            stack.pop_back();
            if (++seen == k) return node->val;
            node = node->right;
        }
        return -1;
    }
};`,
  },

  // Uses preorder instead of inorder, so the ordering is wrong.
  wrong: {
    python: `class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        vals = []
        stack = [root]
        while stack:
            node = stack.pop()
            if node is None:
                continue
            vals.append(node.val)
            stack.append(node.right)
            stack.append(node.left)
        return vals[k - 1] if k - 1 < len(vals) else -1`,
    cpp: `class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        vector<int> vals;
        vector<TreeNode*> stack;
        stack.push_back(root);
        while (!stack.empty()) {
            TreeNode* node = stack.back();
            stack.pop_back();
            if (node == NULL) continue;
            vals.push_back(node->val);
            stack.push_back(node->right);
            stack.push_back(node->left);
        }
        return (k - 1) < (int)vals.size() ? vals[k - 1] : -1;
    }
};`,
  },

  visible: [
    'root = [3,1,4,null,2]\nk = 1',
    'root = [5,3,6,2,4,null,null,1]\nk = 3',
    'root = [1]\nk = 1',
    'root = [3,1,4,null,2]\nk = 4',
  ],

  hidden: [
    'root = [2,1]\nk = 2',
    'root = [2,1,3]\nk = 2',
    'root = [5,3,8,1,4,7,9]\nk = 5',
    'root = [10,5,15,2,7,12,20]\nk = 7',
    'root = [4,2,6,1,3,5,7]\nk = 1',
    'root = [4,2,6,1,3,5,7]\nk = 7',
    'root = [1,null,2]\nk = 2',
    `root = [${chain.join(',')}]\nk = 777`,
  ],
}
