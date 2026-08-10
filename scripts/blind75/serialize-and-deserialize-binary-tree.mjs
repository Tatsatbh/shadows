import {
  PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS,
  PY_TREENODE, CPP_TREENODE, PY_TREE_HELPERS, CPP_TREE_HELPERS,
} from './_drivers.mjs'

const perfect = Array.from({ length: 1023 }, (_, i) => String((i % 1000) - 500)).join(',')

export default {
  question_number: 66,
  title: 'Serialize and Deserialize Binary Tree',
  difficulty: 'Hard',
  question_uri: 'serialize-and-deserialize-binary-tree',
  summary: 'Encode a binary tree as a string and rebuild the identical tree from it.',

  description_md: `Design an algorithm to serialise a binary tree to a string, and to deserialise that string back into the original tree.

Implement two methods on the \`Codec\` class:

- \`serialize(root)\` — returns a string encoding the tree
- \`deserialize(data)\` — returns the tree encoded by that string

There is no required format. **Any** encoding is accepted as long as the round trip reproduces the original tree exactly — same structure, same values.

### How it is checked

The driver builds the tree from the input, calls \`serialize\` and feeds the result straight into \`deserialize\`, then prints the **reconstructed** tree in level order. Your own string format is never inspected.

### Output format

Print the number of level-order tokens on the first line, then the rebuilt tree in level order, space-separated, using \`null\` for absent children. Trailing nulls are trimmed.

---

**Example 1**
\`\`\`text
Input: root = [1,2,3,null,null,4,5]
Output:
7
1 2 3 null null 4 5
\`\`\`

**Example 2**
\`\`\`text
Input: root = []
Output:
0
\`\`\`

**Example 3**
\`\`\`text
Input: root = [1,2]
Output:
2
1 2
\`\`\`

## Constraints

- The number of nodes is in the range \`[0, 10^4]\`.
- \`-1000 <= Node.val <= 1000\`
- Negative values and multi-digit values must survive the round trip, so a single-character-per-node format will not do.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)


${PY_TREENODE}`,
      code: `class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        """Encode a tree to a single string."""
        pass

    def deserialize(self, data: str) -> Optional[TreeNode]:
        """Decode your encoded string back to a tree."""
        pass
`,
      main: `${PY_HELPERS}


${PY_TREE_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _root = _build_tree(_ptokens(_ls[0] if len(_ls) > 0 else ""))
    _codec = Codec()
    _rebuilt = _codec.deserialize(_codec.serialize(_root))
    _out = _serialize_tree(_rebuilt)
    print(len(_out))
    if _out:
        print(" ".join(_out))
`,
    },
    cpp: {
      imports: `${CPP_INCLUDES}

${CPP_TREENODE}`,
      code: `class Codec {
public:
    // Encode a tree to a single string.
    string serialize(TreeNode* root) {

    }

    // Decode your encoded string back to a tree.
    TreeNode* deserialize(string data) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_TREE_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    TreeNode* root = _buildTree(_ptokens(ls[0]));

    Codec codec;
    TreeNode* rebuilt = codec.deserialize(codec.serialize(root));

    vector<string> out = _serializeTree(rebuilt);
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
    python: `class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        parts = []
        stack = [root]
        while stack:
            node = stack.pop()
            if node is None:
                parts.append("#")
                continue
            parts.append(str(node.val))
            stack.append(node.right)
            stack.append(node.left)
        return ",".join(parts)

    def deserialize(self, data: str) -> Optional[TreeNode]:
        tokens = data.split(",") if data else []
        self._i = 0

        def build():
            if self._i >= len(tokens):
                return None
            tok = tokens[self._i]
            self._i += 1
            if tok == "#":
                return None
            node = TreeNode(int(tok))
            node.left = build()
            node.right = build()
            return node

        return build()`,
    cpp: `class Codec {
public:
    string serialize(TreeNode* root) {
        string out;
        vector<TreeNode*> stack;
        stack.push_back(root);
        while (!stack.empty()) {
            TreeNode* node = stack.back();
            stack.pop_back();
            if (!out.empty()) out += ",";
            if (node == NULL) { out += "#"; continue; }
            ostringstream os;
            os << node->val;
            out += os.str();
            stack.push_back(node->right);
            stack.push_back(node->left);
        }
        return out;
    }

    TreeNode* deserialize(string data) {
        tokens.clear();
        string tok;
        stringstream ss(data);
        while (getline(ss, tok, ',')) tokens.push_back(tok);
        i = 0;
        return build();
    }

private:
    vector<string> tokens;
    size_t i;

    TreeNode* build() {
        if (i >= tokens.size()) return NULL;
        string tok = tokens[i++];
        if (tok == "#") return NULL;
        TreeNode* node = new TreeNode(stoi(tok));
        node->left = build();
        node->right = build();
        return node;
    }
};`,
  },

  // Concatenates digits with no separator, so multi-digit and negative values
  // cannot be recovered.
  wrong: {
    python: `class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        parts = []
        stack = [root]
        while stack:
            node = stack.pop()
            if node is None:
                parts.append("#")
                continue
            parts.append(str(node.val))
            stack.append(node.right)
            stack.append(node.left)
        return "".join(parts)

    def deserialize(self, data: str) -> Optional[TreeNode]:
        tokens = list(data)
        self._i = 0

        def build():
            if self._i >= len(tokens):
                return None
            tok = tokens[self._i]
            self._i += 1
            if tok == "#":
                return None
            node = TreeNode(int(tok))
            node.left = build()
            node.right = build()
            return node

        return build()`,
    cpp: `class Codec {
public:
    string serialize(TreeNode* root) {
        string out;
        vector<TreeNode*> stack;
        stack.push_back(root);
        while (!stack.empty()) {
            TreeNode* node = stack.back();
            stack.pop_back();
            if (node == NULL) { out += "#"; continue; }
            ostringstream os;
            os << node->val;
            out += os.str();
            stack.push_back(node->right);
            stack.push_back(node->left);
        }
        return out;
    }

    TreeNode* deserialize(string data) {
        s = data;
        i = 0;
        return build();
    }

private:
    string s;
    size_t i;

    TreeNode* build() {
        if (i >= s.size()) return NULL;
        char c = s[i++];
        if (c == '#') return NULL;
        TreeNode* node = new TreeNode(c - '0');
        node->left = build();
        node->right = build();
        return node;
    }
};`,
  },

  visible: ['root = [1,2,3,null,null,4,5]', 'root = []', 'root = [1,2]', 'root = [1]'],

  hidden: [
    'root = [-1]',
    'root = [10,20,30]',
    'root = [1,null,2,null,3]',
    'root = [-500,1000,-1000]',
    'root = [5,3,8,1,4,7,9]',
    'root = [100,200,null,300]',
    'root = [0,0,0,0,0]',
    `root = [${perfect}]`,
  ],
}
