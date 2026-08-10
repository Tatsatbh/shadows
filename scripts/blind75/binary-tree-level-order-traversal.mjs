import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_TREENODE, CPP_TREENODE, PY_TREE_HELPERS, CPP_TREE_HELPERS,
} from './_drivers.mjs'

const perfect = Array.from({ length: 1023 }, (_, i) => String(i + 1)).join(',')

export default {
  question_number: 65,
  title: 'Binary Tree Level Order Traversal',
  difficulty: 'Medium',
  question_uri: 'binary-tree-level-order-traversal',
  summary: 'Return the node values grouped level by level, top to bottom.',

  description_md: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values — grouped by depth, from left to right within each level.

Trees are given in level order, with \`null\` marking an absent child.

### Output format

Print the number of levels on the first line, then one line per level with that level's values space-separated.

---

**Example 1**
\`\`\`text
Input: root = [3,9,20,null,null,15,7]
Output:
3
3
9 20
15 7
\`\`\`

**Example 2**
\`\`\`text
Input: root = [1]
Output:
1
1
\`\`\`

**Example 3**
\`\`\`text
Input: root = []
Output:
0
\`\`\`

## Constraints

- The number of nodes is in the range \`[0, 2000]\`.
- \`-1000 <= Node.val <= 1000\``,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


${PY_TREENODE}`,
      code: `class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        pass
`,
      main: `${PY_HELPERS}


${PY_TREE_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _root = _build_tree(_ptokens(_ls[0] if len(_ls) > 0 else ""))
    _res = Solution().levelOrder(_root) or []
    print(len(_res))
    for _level in _res:
        print(" ".join(str(int(v)) for v in _level))
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

${CPP_TREENODE}`,
      code: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {

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
    vector<vector<int> > res = sol.levelOrder(root);
    cout << res.size() << "\\n";
    for (size_t i = 0; i < res.size(); i++) {
        for (size_t j = 0; j < res[i].size(); j++) {
            if (j) cout << " ";
            cout << res[i][j];
        }
        cout << "\\n";
    }
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if root is None:
            return []
        out = []
        level = [root]
        while level:
            out.append([node.val for node in level])
            nxt = []
            for node in level:
                if node.left is not None:
                    nxt.append(node.left)
                if node.right is not None:
                    nxt.append(node.right)
            level = nxt
        return out`,
    cpp: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int> > out;
        if (root == NULL) return out;
        vector<TreeNode*> level;
        level.push_back(root);
        while (!level.empty()) {
            vector<int> vals;
            vector<TreeNode*> nxt;
            for (size_t i = 0; i < level.size(); i++) {
                vals.push_back(level[i]->val);
                if (level[i]->left != NULL) nxt.push_back(level[i]->left);
                if (level[i]->right != NULL) nxt.push_back(level[i]->right);
            }
            out.push_back(vals);
            level = nxt;
        }
        return out;
    }
};`,
  },

  // Flattens everything into a single level.
  wrong: {
    python: `class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if root is None:
            return []
        vals = []
        queue = [root]
        head = 0
        while head < len(queue):
            node = queue[head]
            head += 1
            vals.append(node.val)
            if node.left is not None:
                queue.append(node.left)
            if node.right is not None:
                queue.append(node.right)
        return [vals]`,
    cpp: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int> > out;
        if (root == NULL) return out;
        vector<int> vals;
        vector<TreeNode*> queue;
        queue.push_back(root);
        size_t head = 0;
        while (head < queue.size()) {
            TreeNode* node = queue[head++];
            vals.push_back(node->val);
            if (node->left) queue.push_back(node->left);
            if (node->right) queue.push_back(node->right);
        }
        out.push_back(vals);
        return out;
    }
};`,
  },

  visible: ['root = [3,9,20,null,null,15,7]', 'root = [1]', 'root = []', 'root = [1,2,3]'],

  hidden: [
    'root = [1,2]',
    'root = [1,null,2]',
    'root = [1,2,3,4,5,6,7]',
    'root = [1,null,2,null,3,null,4]',
    'root = [-1,-2,-3]',
    'root = [0]',
    'root = [1,2,3,null,null,4,5]',
    `root = [${perfect}]`,
  ],
}
