import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_TREENODE, CPP_TREENODE, PY_TREE_HELPERS, CPP_TREE_HELPERS,
} from './_drivers.mjs'

// A left-leaning chain of 1000 nodes: preorder 0..999, inorder reversed.
const pre = Array.from({ length: 1000 }, (_, i) => i)
const ino = pre.slice().reverse()

export default {
  question_number: 68,
  title: 'Construct Binary Tree from Preorder and Inorder Traversal',
  difficulty: 'Medium',
  question_uri: 'construct-binary-tree-from-preorder-and-inorder',
  summary: 'Rebuild a binary tree from its preorder and inorder traversals.',

  description_md: `Given two integer arrays \`preorder\` and \`inorder\`, where \`preorder\` is the preorder traversal of a binary tree and \`inorder\` is the inorder traversal of the **same** tree, reconstruct and return the tree.

The first element of \`preorder\` is always the root; locating it in \`inorder\` splits the remaining nodes into the left and right subtrees. A hash map from value to inorder index turns the repeated search into O(1).

### Output format

Print the number of level-order tokens on the first line, then the reconstructed tree in level order, space-separated, using \`null\` for absent children. Trailing nulls are trimmed.

---

**Example 1**
\`\`\`text
Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output:
7
3 9 20 null null 15 7
\`\`\`

**Example 2**
\`\`\`text
Input: preorder = [-1], inorder = [-1]
Output:
1
-1
\`\`\`

**Example 3**
\`\`\`text
Input: preorder = [1,2], inorder = [2,1]
Output:
2
1 2
Explanation: 2 sits to the left of 1 in the inorder traversal.
\`\`\`

## Constraints

- \`1 <= preorder.length <= 3000\` and \`inorder.length == preorder.length\`
- \`-3000 <= preorder[i], inorder[i] <= 3000\`
- All values are **unique**, and \`inorder\` is a permutation of \`preorder\`.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


${PY_TREENODE}`,
      code: `class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        pass
`,
      main: `${PY_HELPERS}


${PY_TREE_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _pre = _pints(_ls[0] if len(_ls) > 0 else "")
    _in = _pints(_ls[1] if len(_ls) > 1 else "")
    _out = _serialize_tree(Solution().buildTree(_pre, _in))
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
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_TREE_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<int> pre = _pints(ls[0]);
    vector<int> ino = _pints(ls[1]);

    Solution sol;
    vector<string> out = _serializeTree(sol.buildTree(pre, ino));
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
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        index = dict((v, i) for i, v in enumerate(inorder))
        self._pos = 0

        def build(lo, hi):
            if lo > hi:
                return None
            val = preorder[self._pos]
            self._pos += 1
            node = TreeNode(val)
            mid = index[val]
            node.left = build(lo, mid - 1)
            node.right = build(mid + 1, hi)
            return node

        if not preorder:
            return None
        return build(0, len(inorder) - 1)`,
    cpp: `class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        pre = &preorder;
        pos = 0;
        index.clear();
        for (size_t i = 0; i < inorder.size(); i++) index[inorder[i]] = (int)i;
        if (preorder.empty()) return NULL;
        return build(0, (int)inorder.size() - 1);
    }

private:
    vector<int>* pre;
    size_t pos;
    unordered_map<int, int> index;

    TreeNode* build(int lo, int hi) {
        if (lo > hi) return NULL;
        int val = (*pre)[pos++];
        TreeNode* node = new TreeNode(val);
        int mid = index[val];
        node->left = build(lo, mid - 1);
        node->right = build(mid + 1, hi);
        return node;
    }
};`,
  },

  // Treats preorder as a level-order array, ignoring inorder entirely.
  wrong: {
    python: `class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        if not preorder:
            return None
        nodes = [TreeNode(v) for v in preorder]
        for i in range(len(nodes)):
            if 2 * i + 1 < len(nodes):
                nodes[i].left = nodes[2 * i + 1]
            if 2 * i + 2 < len(nodes):
                nodes[i].right = nodes[2 * i + 2]
        return nodes[0]`,
    cpp: `class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        if (preorder.empty()) return NULL;
        vector<TreeNode*> nodes;
        for (size_t i = 0; i < preorder.size(); i++) nodes.push_back(new TreeNode(preorder[i]));
        for (size_t i = 0; i < nodes.size(); i++) {
            if (2 * i + 1 < nodes.size()) nodes[i]->left = nodes[2 * i + 1];
            if (2 * i + 2 < nodes.size()) nodes[i]->right = nodes[2 * i + 2];
        }
        return nodes[0];
    }
};`,
  },

  visible: [
    'preorder = [3,9,20,15,7]\ninorder = [9,3,15,20,7]',
    'preorder = [-1]\ninorder = [-1]',
    'preorder = [1,2]\ninorder = [2,1]',
    'preorder = [1,2]\ninorder = [1,2]',
  ],

  hidden: [
    'preorder = [1,2,3]\ninorder = [2,1,3]',
    'preorder = [1,2,3]\ninorder = [3,2,1]',
    'preorder = [1,2,3]\ninorder = [1,2,3]',
    'preorder = [5,3,1,4,8,7,9]\ninorder = [1,3,4,5,7,8,9]',
    'preorder = [10,5,2,7,15,12,20]\ninorder = [2,5,7,10,12,15,20]',
    'preorder = [1,2,4,5,3,6,7]\ninorder = [4,2,5,1,6,3,7]',
    'preorder = [-3000,3000]\ninorder = [-3000,3000]',
    `preorder = [${pre.join(',')}]\ninorder = [${ino.join(',')}]`,
  ],
}
