import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_TREENODE, CPP_TREENODE, PY_TREE_HELPERS, CPP_TREE_HELPERS,
} from './_drivers.mjs'

// Perfect tree of depth 10 (1023 nodes).
const perfect = Array.from({ length: 1023 }, (_, i) => String(i + 1)).join(',')

export default {
  question_number: 63,
  title: 'Invert Binary Tree',
  difficulty: 'Easy',
  question_uri: 'invert-binary-tree',
  summary: 'Mirror a binary tree by swapping every left and right child.',

  description_md: `Given the \`root\` of a binary tree, **invert** it — swap the left and right child of every node — and return the root.

Trees are given in level order, with \`null\` marking an absent child.

### Output format

Print the number of level-order tokens on the first line, then the inverted tree in level order, space-separated, using \`null\` for absent children. Trailing nulls are trimmed.

---

**Example 1**
\`\`\`text
Input: root = [4,2,7,1,3,6,9]
Output:
7
4 7 2 9 6 3 1
\`\`\`

**Example 2**
\`\`\`text
Input: root = [2,1,3]
Output:
3
2 3 1
\`\`\`

**Example 3**
\`\`\`text
Input: root = []
Output:
0
\`\`\`

## Constraints

- The number of nodes is in the range \`[0, 100]\`.
- \`-100 <= Node.val <= 100\``,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


${PY_TREENODE}`,
      code: `class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        pass
`,
      main: `${PY_HELPERS}


${PY_TREE_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _root = _build_tree(_ptokens(_ls[0] if len(_ls) > 0 else ""))
    _out = _serialize_tree(Solution().invertTree(_root))
    print(len(_out))
    if _out:
        print(" ".join(_out))
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

${CPP_TREENODE}`,
      code: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {

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
    vector<string> out = _serializeTree(sol.invertTree(root));
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
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        stack = [root]
        while stack:
            node = stack.pop()
            if node is None:
                continue
            node.left, node.right = node.right, node.left
            stack.append(node.left)
            stack.append(node.right)
        return root`,
    cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        vector<TreeNode*> stack;
        stack.push_back(root);
        while (!stack.empty()) {
            TreeNode* node = stack.back();
            stack.pop_back();
            if (node == NULL) continue;
            TreeNode* tmp = node->left;
            node->left = node->right;
            node->right = tmp;
            stack.push_back(node->left);
            stack.push_back(node->right);
        }
        return root;
    }
};`,
  },

  // Swaps only the root's children.
  wrong: {
    python: `class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if root is not None:
            root.left, root.right = root.right, root.left
        return root`,
    cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (root != NULL) {
            TreeNode* tmp = root->left;
            root->left = root->right;
            root->right = tmp;
        }
        return root;
    }
};`,
  },

  visible: ['root = [4,2,7,1,3,6,9]', 'root = [2,1,3]', 'root = []', 'root = [1]'],

  hidden: [
    'root = [1,2]',
    'root = [1,null,2]',
    'root = [1,2,3,4,5,6,7]',
    'root = [1,2,null,3]',
    'root = [-1,-2,-3]',
    'root = [1,2,3,null,4,null,5]',
    'root = [5,3,8,1,4,7,9]',
    `root = [${perfect}]`,
  ],
}
