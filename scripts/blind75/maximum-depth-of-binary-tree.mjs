import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

// Left-skewed chain of 1000 nodes, serialised level-order.
const chain = ['1']
for (let i = 2; i <= 1000; i++) chain.push(String(i), 'null')

export default {
  question_number: 11,
  title: 'Maximum Depth of Binary Tree',
  difficulty: 'Easy',
  question_uri: 'maximum-depth-of-binary-tree',
  summary: 'Return the number of nodes along the longest path from the root down to a leaf.',

  description_md: `Given the \`root\` of a binary tree, return its **maximum depth** — the number of nodes along the longest path from the root node down to the farthest leaf node.

The tree is given in **level order**, with \`null\` marking an absent child.

---

**Example 1**
\`\`\`text
Input: root = [3,9,20,null,null,15,7]
Output: 3
Explanation: The longest path is 3 -> 20 -> 15 (or 3 -> 20 -> 7).
\`\`\`

**Example 2**
\`\`\`text
Input: root = [1,null,2]
Output: 2
\`\`\`

**Example 3**
\`\`\`text
Input: root = []
Output: 0
Explanation: An empty tree has depth 0.
\`\`\`

## Constraints

- The number of nodes is in the range \`[0, 10^4]\`.
- \`-100 <= Node.val <= 100\`
- Trees may be deeply skewed, so a recursive solution must tolerate a depth of ~1000.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

# Deeply skewed trees are in range, so raise the recursion ceiling.
sys.setrecursionlimit(200000)


# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right`,
      code: `class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        pass
`,
      main: `${PY_HELPERS}


def _ptokens(line):
    v = _val(line)
    if v.startswith("["):
        v = v[1:]
    if v.endswith("]"):
        v = v[:-1]
    return [t.strip() for t in v.split(",") if t.strip() != ""]


def _build_tree(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = TreeNode(int(tokens[0]))
    queue = [root]
    head = 0
    i = 1
    while i < len(tokens) and head < len(queue):
        node = queue[head]
        head += 1
        if i < len(tokens):
            if tokens[i] != "null":
                node.left = TreeNode(int(tokens[i]))
                queue.append(node.left)
            i += 1
        if i < len(tokens):
            if tokens[i] != "null":
                node.right = TreeNode(int(tokens[i]))
                queue.append(node.right)
            i += 1
    return root


if __name__ == "__main__":
    _ls = _lines()
    _root = _build_tree(_ptokens(_ls[0] if len(_ls) > 0 else ""))
    print(Solution().maxDepth(_root))
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(NULL), right(NULL) {}
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};`,
      code: `class Solution {
public:
    int maxDepth(TreeNode* root) {

    }
};`,
      main: `${CPP_HELPERS}

static vector<string> _ptokens(const string& line) {
    string v = _val(line);
    if (!v.empty() && v[0] == '[') v.erase(v.begin());
    if (!v.empty() && v[v.size() - 1] == ']') v.erase(v.end() - 1);
    vector<string> out;
    string tok;
    stringstream ss(v);
    while (getline(ss, tok, ',')) {
        size_t b = tok.find_first_not_of(" \\t\\r\\n");
        if (b == string::npos) continue;
        size_t e = tok.find_last_not_of(" \\t\\r\\n");
        out.push_back(tok.substr(b, e - b + 1));
    }
    return out;
}

static TreeNode* _buildTree(const vector<string>& toks) {
    if (toks.empty() || toks[0] == "null") return NULL;
    TreeNode* root = new TreeNode(stoi(toks[0]));
    queue<TreeNode*> q;
    q.push(root);
    size_t i = 1;
    while (i < toks.size() && !q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        if (i < toks.size()) {
            if (toks[i] != "null") {
                node->left = new TreeNode(stoi(toks[i]));
                q.push(node->left);
            }
            i++;
        }
        if (i < toks.size()) {
            if (toks[i] != "null") {
                node->right = new TreeNode(stoi(toks[i]));
                q.push(node->right);
            }
            i++;
        }
    }
    return root;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    TreeNode* root = _buildTree(_ptokens(ls[0]));

    Solution sol;
    cout << sol.maxDepth(root) << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if root is None:
            return 0
        best = 0
        stack = [(root, 1)]
        while stack:
            node, depth = stack.pop()
            if depth > best:
                best = depth
            if node.left is not None:
                stack.append((node.left, depth + 1))
            if node.right is not None:
                stack.append((node.right, depth + 1))
        return best`,
    cpp: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (root == NULL) return 0;
        int best = 0;
        vector<pair<TreeNode*, int> > stack;
        stack.push_back(make_pair(root, 1));
        while (!stack.empty()) {
            pair<TreeNode*, int> top = stack.back();
            stack.pop_back();
            if (top.second > best) best = top.second;
            if (top.first->left) stack.push_back(make_pair(top.first->left, top.second + 1));
            if (top.first->right) stack.push_back(make_pair(top.first->right, top.second + 1));
        }
        return best;
    }
};`,
  },

  // Counts nodes instead of measuring depth.
  wrong: {
    python: `class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if root is None:
            return 0
        return 1 + self.maxDepth(root.left) + self.maxDepth(root.right)`,
    cpp: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (root == NULL) return 0;
        return 1 + maxDepth(root->left) + maxDepth(root->right);
    }
};`,
  },

  visible: [
    'root = [3,9,20,null,null,15,7]',
    'root = [1,null,2]',
    'root = []',
    'root = [1]',
  ],

  hidden: [
    'root = [1,2]',
    'root = [1,2,3,4,5]',
    'root = [0]',
    'root = [1,null,2,null,3,null,4]',
    'root = [1,2,3,null,null,4,5,6,7]',
    'root = [-1,-2,-3]',
    'root = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]',
    `root = [${chain.join(',')}]`,
  ],
}
