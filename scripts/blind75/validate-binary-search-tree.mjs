import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_TREENODE, CPP_TREENODE, PY_TREE_HELPERS, CPP_TREE_HELPERS,
} from './_drivers.mjs'

// A right-leaning chain 0,1,2,... which is a valid BST 1000 nodes deep.
const chain = ['0']
for (let i = 1; i < 1000; i++) chain.push('null', String(i))

export default {
  question_number: 69,
  title: 'Validate Binary Search Tree',
  difficulty: 'Medium',
  question_uri: 'validate-binary-search-tree',
  summary: 'Check that every node in a tree obeys the binary-search-tree ordering.',

  description_md: `Given the \`root\` of a binary tree, determine whether it is a valid **binary search tree**.

A valid BST requires:

- every value in a node's **left** subtree is **strictly less** than the node's value,
- every value in its **right** subtree is **strictly greater**, and
- both subtrees are themselves valid BSTs.

Checking only a node against its immediate children is **not** sufficient — the constraint applies to the whole subtree, so bounds must be carried down.

Trees are given in level order, with \`null\` marking an absent child.

---

**Example 1**
\`\`\`text
Input: root = [2,1,3]
Output: true
\`\`\`

**Example 2**
\`\`\`text
Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: 3 sits in the right subtree of 5 but is smaller than 5.
\`\`\`

**Example 3**
\`\`\`text
Input: root = [5,4,6,null,null,3,7]
Output: false
Explanation: 3 is a valid left child of 6, but it violates the bound set by 5.
\`\`\`

## Constraints

- The number of nodes is in the range \`[1, 10^4]\`.
- \`-2^31 <= Node.val <= 2^31 - 1\`
- Values at the extremes of the 32-bit range are in scope, so sentinel bounds must be chosen with care.
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


${PY_TREENODE}`,
      code: `class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        pass
`,
      main: `${PY_HELPERS}


${PY_TREE_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _root = _build_tree(_ptokens(_ls[0] if len(_ls) > 0 else ""))
    print("true" if Solution().isValidBST(_root) else "false")
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

${CPP_TREENODE}`,
      code: `class Solution {
public:
    bool isValidBST(TreeNode* root) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_TREE_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    TreeNode* root = _buildTree(_ptokens(ls[0]));

    Solution sol;
    cout << (sol.isValidBST(root) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        stack = [(root, None, None)]
        while stack:
            node, lo, hi = stack.pop()
            if node is None:
                continue
            if lo is not None and node.val <= lo:
                return False
            if hi is not None and node.val >= hi:
                return False
            stack.append((node.left, lo, node.val))
            stack.append((node.right, node.val, hi))
        return True`,
    cpp: `class Solution {
public:
    bool isValidBST(TreeNode* root) {
        // long long bounds, so values at the edges of the int range are fine.
        return check(root, LLONG_MIN, LLONG_MAX);
    }

private:
    bool check(TreeNode* node, long long lo, long long hi) {
        if (node == NULL) return true;
        if ((long long)node->val <= lo || (long long)node->val >= hi) return false;
        return check(node->left, lo, node->val) && check(node->right, node->val, hi);
    }
};`,
  },

  // Compares each node only against its immediate children.
  wrong: {
    python: `class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        stack = [root]
        while stack:
            node = stack.pop()
            if node is None:
                continue
            if node.left is not None and node.left.val >= node.val:
                return False
            if node.right is not None and node.right.val <= node.val:
                return False
            stack.append(node.left)
            stack.append(node.right)
        return True`,
    cpp: `class Solution {
public:
    bool isValidBST(TreeNode* root) {
        vector<TreeNode*> stack;
        stack.push_back(root);
        while (!stack.empty()) {
            TreeNode* node = stack.back();
            stack.pop_back();
            if (node == NULL) continue;
            if (node->left != NULL && node->left->val >= node->val) return false;
            if (node->right != NULL && node->right->val <= node->val) return false;
            stack.push_back(node->left);
            stack.push_back(node->right);
        }
        return true;
    }
};`,
  },

  visible: [
    'root = [2,1,3]',
    'root = [5,1,4,null,null,3,6]',
    'root = [5,4,6,null,null,3,7]',
    'root = [1]',
  ],

  hidden: [
    'root = [-2147483648]',
    'root = [2147483647]',
    'root = [1,1]',
    'root = [10,5,15,null,null,6,20]',
    'root = [3,1,5,0,2,4,6]',
    'root = [2,2,2]',
    'root = [5,3,8,1,4,7,9]',
    `root = [${chain.join(',')}]`,
  ],
}
