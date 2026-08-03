import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_TREENODE, CPP_TREENODE, PY_TREE_HELPERS, CPP_TREE_HELPERS,
} from './_drivers.mjs'

const perfect = Array.from({ length: 1023 }, (_, i) => String(i + 1)).join(',')

export default {
  question_number: 67,
  title: 'Subtree of Another Tree',
  difficulty: 'Easy',
  question_uri: 'subtree-of-another-tree',
  summary: 'Check whether one tree appears as a complete subtree of another.',

  description_md: `Given the roots of two binary trees \`root\` and \`subRoot\`, return \`true\` if there is a subtree of \`root\` with the same structure and node values as \`subRoot\`.

A **subtree** consists of some node in \`root\` **and all of that node's descendants**. Matching a fragment is not enough — the match must run all the way to the leaves.

Trees are given in level order, with \`null\` marking an absent child.

---

**Example 1**
\`\`\`text
Input: root = [3,4,5,1,2], subRoot = [4,1,2]
Output: true
\`\`\`

**Example 2**
\`\`\`text
Input: root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]
Output: false
Explanation: The node 4 now has an extra descendant, so the match is not complete.
\`\`\`

**Example 3**
\`\`\`text
Input: root = [1,1], subRoot = [1]
Output: true
Explanation: The left child is a leaf holding 1.
\`\`\`

## Constraints

- The number of nodes in \`root\` is in the range \`[1, 2000]\`.
- The number of nodes in \`subRoot\` is in the range \`[1, 1000]\`.
- \`-10^4 <= Node.val <= 10^4\`
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


${PY_TREENODE}`,
      code: `class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        pass
`,
      main: `${PY_HELPERS}


${PY_TREE_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _root = _build_tree(_ptokens(_ls[0] if len(_ls) > 0 else ""))
    _sub = _build_tree(_ptokens(_ls[1] if len(_ls) > 1 else ""))
    print("true" if Solution().isSubtree(_root, _sub) else "false")
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

${CPP_TREENODE}`,
      code: `class Solution {
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_TREE_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    TreeNode* root = _buildTree(_ptokens(ls[0]));
    TreeNode* sub = _buildTree(_ptokens(ls[1]));

    Solution sol;
    cout << (sol.isSubtree(root, sub) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        def same(a, b):
            stack = [(a, b)]
            while stack:
                x, y = stack.pop()
                if x is None and y is None:
                    continue
                if x is None or y is None or x.val != y.val:
                    return False
                stack.append((x.left, y.left))
                stack.append((x.right, y.right))
            return True

        if subRoot is None:
            return True
        stack = [root]
        while stack:
            node = stack.pop()
            if node is None:
                continue
            if node.val == subRoot.val and same(node, subRoot):
                return True
            stack.append(node.left)
            stack.append(node.right)
        return False`,
    cpp: `class Solution {
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        if (subRoot == NULL) return true;
        vector<TreeNode*> stack;
        stack.push_back(root);
        while (!stack.empty()) {
            TreeNode* node = stack.back();
            stack.pop_back();
            if (node == NULL) continue;
            if (node->val == subRoot->val && same(node, subRoot)) return true;
            stack.push_back(node->left);
            stack.push_back(node->right);
        }
        return false;
    }

private:
    bool same(TreeNode* a, TreeNode* b) {
        vector<pair<TreeNode*, TreeNode*> > stack;
        stack.push_back(make_pair(a, b));
        while (!stack.empty()) {
            pair<TreeNode*, TreeNode*> cur = stack.back();
            stack.pop_back();
            TreeNode* x = cur.first;
            TreeNode* y = cur.second;
            if (x == NULL && y == NULL) continue;
            if (x == NULL || y == NULL || x->val != y->val) return false;
            stack.push_back(make_pair(x->left, y->left));
            stack.push_back(make_pair(x->right, y->right));
        }
        return true;
    }
};`,
  },

  // Matches the subtree's shape only downward from a value match, allowing extra
  // descendants in root to slip through.
  wrong: {
    python: `class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        def covers(a, b):
            if b is None:
                return True
            if a is None or a.val != b.val:
                return False
            return covers(a.left, b.left) and covers(a.right, b.right)

        stack = [root]
        while stack:
            node = stack.pop()
            if node is None:
                continue
            if covers(node, subRoot):
                return True
            stack.append(node.left)
            stack.append(node.right)
        return False`,
    cpp: `class Solution {
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        vector<TreeNode*> stack;
        stack.push_back(root);
        while (!stack.empty()) {
            TreeNode* node = stack.back();
            stack.pop_back();
            if (node == NULL) continue;
            if (covers(node, subRoot)) return true;
            stack.push_back(node->left);
            stack.push_back(node->right);
        }
        return false;
    }

private:
    bool covers(TreeNode* a, TreeNode* b) {
        if (b == NULL) return true;
        if (a == NULL || a->val != b->val) return false;
        return covers(a->left, b->left) && covers(a->right, b->right);
    }
};`,
  },

  visible: [
    'root = [3,4,5,1,2]\nsubRoot = [4,1,2]',
    'root = [3,4,5,1,2,null,null,null,null,0]\nsubRoot = [4,1,2]',
    'root = [1,1]\nsubRoot = [1]',
    'root = [1]\nsubRoot = [1]',
  ],

  hidden: [
    'root = [1]\nsubRoot = [2]',
    'root = [1,2,3]\nsubRoot = [2]',
    'root = [1,2,3]\nsubRoot = [1,2,3]',
    'root = [1,2,3]\nsubRoot = [1,2]',
    'root = [4,5,6,7]\nsubRoot = [5,7]',
    'root = [12]\nsubRoot = [2]',
    'root = [3,4,5,1,2]\nsubRoot = [3,1,2]',
    `root = [${perfect}]\nsubRoot = [511,1022,1023]`,
  ],
}
