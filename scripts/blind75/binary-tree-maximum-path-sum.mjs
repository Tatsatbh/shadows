import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_TREENODE, CPP_TREENODE, PY_TREE_HELPERS, CPP_TREE_HELPERS,
} from './_drivers.mjs'

const perfect = Array.from({ length: 1023 }, (_, i) => String((i % 200) - 100)).join(',')

export default {
  question_number: 64,
  title: 'Binary Tree Maximum Path Sum',
  difficulty: 'Hard',
  question_uri: 'binary-tree-maximum-path-sum',
  summary: 'Find the largest sum along any path through the tree, which need not pass through the root.',

  description_md: `A **path** in a binary tree is a sequence of nodes where each adjacent pair is connected by an edge. A node appears at most once, and the path **does not need to pass through the root**.

Given the \`root\` of a binary tree, return the maximum sum of any non-empty path.

The recursion has two distinct quantities: what a subtree can *contribute* upward (at most one branch), and the best path *through* the current node (both branches). Confusing them is the classic mistake.

Trees are given in level order, with \`null\` marking an absent child.

---

**Example 1**
\`\`\`text
Input: root = [1,2,3]
Output: 6
Explanation: The path 2 -> 1 -> 3 sums to 6.
\`\`\`

**Example 2**
\`\`\`text
Input: root = [-10,9,20,null,null,15,7]
Output: 42
Explanation: The path 15 -> 20 -> 7 sums to 42 and skips the root.
\`\`\`

**Example 3**
\`\`\`text
Input: root = [-3]
Output: -3
Explanation: The path must be non-empty, so an all-negative tree returns its largest value.
\`\`\`

## Constraints

- The number of nodes is in the range \`[1, 3 * 10^4]\`.
- \`-1000 <= Node.val <= 1000\``,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


${PY_TREENODE}`,
      code: `class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        pass
`,
      main: `${PY_HELPERS}


${PY_TREE_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _root = _build_tree(_ptokens(_ls[0] if len(_ls) > 0 else ""))
    print(Solution().maxPathSum(_root))
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

${CPP_TREENODE}`,
      code: `class Solution {
public:
    int maxPathSum(TreeNode* root) {

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
    cout << sol.maxPathSum(root) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        best = [-(10 ** 18)]

        def gain(node):
            if node is None:
                return 0
            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)
            through = node.val + left + right
            if through > best[0]:
                best[0] = through
            return node.val + max(left, right)

        gain(root)
        return best[0]`,
    cpp: `class Solution {
public:
    int maxPathSum(TreeNode* root) {
        best = LLONG_MIN;
        gain(root);
        return (int)best;
    }

private:
    long long best;

    long long gain(TreeNode* node) {
        if (node == NULL) return 0;
        long long left = max(gain(node->left), 0LL);
        long long right = max(gain(node->right), 0LL);
        long long through = node->val + left + right;
        if (through > best) best = through;
        return node->val + max(left, right);
    }
};`,
  },

  // Sums both branches when reporting upward, allowing invalid V-shaped paths.
  wrong: {
    python: `class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        def gain(node):
            if node is None:
                return 0
            return node.val + max(gain(node.left), 0) + max(gain(node.right), 0)
        return gain(root)`,
    cpp: `class Solution {
public:
    int maxPathSum(TreeNode* root) {
        return (int)gain(root);
    }

private:
    long long gain(TreeNode* node) {
        if (node == NULL) return 0;
        return node->val + max(gain(node->left), 0LL) + max(gain(node->right), 0LL);
    }
};`,
  },

  visible: ['root = [1,2,3]', 'root = [-10,9,20,null,null,15,7]', 'root = [-3]', 'root = [2,-1]'],

  hidden: [
    'root = [1]',
    'root = [-1,-2,-3]',
    'root = [5,4,8,11,null,13,4,7,2,null,null,null,1]',
    'root = [1,-2,-3,1,3,-2,null,-1]',
    'root = [2,-1,-2]',
    'root = [-2,1]',
    'root = [9,6,-3,null,null,-6,2,null,null,2,null,-6,-6,-6]',
    `root = [${perfect}]`,
  ],
}
