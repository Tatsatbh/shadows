import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const many = []
for (let i = 0; i < 200; i++) many.push(`"addWord w${String.fromCharCode(97 + (i % 26))}${i}"`)
many.push('"search w.1"', '"search ......"', '"search wa0"', '"search zzzz"')

export default {
  question_number: 73,
  title: 'Design Add and Search Words Data Structure',
  difficulty: 'Medium',
  question_uri: 'design-add-and-search-words',
  summary: 'A word dictionary whose search supports "." as a single-character wildcard.',

  description_md: `Design a data structure that supports adding new words and searching for words that may contain a wildcard.

Implement the \`WordDictionary\` class:

- \`addWord(word)\` — adds \`word\` to the structure
- \`search(word)\` — returns \`true\` if any added word matches \`word\`, where a \`.\` in the query matches **any one letter**

A plain trie handles \`addWord\`; the wildcard forces \`search\` to branch, trying every child whenever it meets a \`.\`.

### Input format

Operations come as an array of strings, one per entry, each a name followed by its argument:

\`\`\`text
ops = ["addWord bad","addWord dad","search pad","search .ad","search b.."]
\`\`\`

### Output format

Print the number of \`search\` calls on the first line, then one result per line, \`true\` or \`false\`. \`addWord\` produces no line.

---

**Example 1**
\`\`\`text
Input: ops = ["addWord bad","addWord dad","addWord mad","search pad","search bad","search .ad","search b.."]
Output:
4
false
true
true
true
\`\`\`

**Example 2**
\`\`\`text
Input: ops = ["search a"]
Output:
1
false
\`\`\`

**Example 3**
\`\`\`text
Input: ops = ["addWord a","search ."]
Output:
1
true
\`\`\`

## Constraints

- \`1 <= word.length <= 25\`
- Words in \`addWord\` consist of lowercase English letters and digits.
- Words in \`search\` may also contain \`.\`.
- At most \`10^4\` calls in total.
- A query only matches words of the **same length**.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)`,
      code: `class WordDictionary:
    def __init__(self):
        pass

    def addWord(self, word: str) -> None:
        pass

    def search(self, word: str) -> bool:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _ops = _pstrs(_ls[0] if len(_ls) > 0 else "")
    _wd = WordDictionary()
    _results = []
    for _op in _ops:
        _parts = _op.split(" ", 1)
        _name = _parts[0]
        _arg = _parts[1] if len(_parts) > 1 else ""
        if _name == "addWord":
            _wd.addWord(_arg)
        elif _name == "search":
            _results.append("true" if _wd.search(_arg) else "false")
    print(len(_results))
    for _r in _results:
        print(_r)
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class WordDictionary {
public:
    WordDictionary() {

    }

    void addWord(string word) {

    }

    bool search(string word) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<string> ops = _pstrs(ls[0]);

    WordDictionary wd;
    vector<string> results;
    for (size_t i = 0; i < ops.size(); i++) {
        size_t sp = ops[i].find(' ');
        string name = (sp == string::npos) ? ops[i] : ops[i].substr(0, sp);
        string arg = (sp == string::npos) ? "" : ops[i].substr(sp + 1);
        if (name == "addWord") wd.addWord(arg);
        else if (name == "search") results.push_back(wd.search(arg) ? "true" : "false");
    }

    cout << results.size() << "\\n";
    for (size_t i = 0; i < results.size(); i++) cout << results[i] << "\\n";
    return 0;
}`,
    },
  },

  solutions: {
    python: `class _Node:
    def __init__(self):
        self.children = {}
        self.is_word = False


class WordDictionary:
    def __init__(self):
        self.root = _Node()

    def addWord(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = _Node()
            node = node.children[ch]
        node.is_word = True

    def search(self, word: str) -> bool:
        def match(node, i):
            if i == len(word):
                return node.is_word
            ch = word[i]
            if ch == ".":
                for child in node.children.values():
                    if match(child, i + 1):
                        return True
                return False
            child = node.children.get(ch)
            return child is not None and match(child, i + 1)

        return match(self.root, 0)`,
    cpp: `class WordDictionary {
public:
    WordDictionary() { root = new Node(); }

    void addWord(string word) {
        Node* node = root;
        for (size_t i = 0; i < word.size(); i++) {
            if (node->children.find(word[i]) == node->children.end()) {
                node->children[word[i]] = new Node();
            }
            node = node->children[word[i]];
        }
        node->isWord = true;
    }

    bool search(string word) {
        return match(root, word, 0);
    }

private:
    struct Node {
        map<char, Node*> children;
        bool isWord;
        Node() : isWord(false) {}
    };

    Node* root;

    bool match(Node* node, const string& word, size_t i) {
        if (i == word.size()) return node->isWord;
        char ch = word[i];
        if (ch == '.') {
            for (map<char, Node*>::iterator it = node->children.begin();
                 it != node->children.end(); ++it) {
                if (match(it->second, word, i + 1)) return true;
            }
            return false;
        }
        map<char, Node*>::iterator it = node->children.find(ch);
        if (it == node->children.end()) return false;
        return match(it->second, word, i + 1);
    }
};`,
  },

  // Exact matching only — every wildcard query fails.
  wrong: {
    python: `class WordDictionary:
    def __init__(self):
        self.words = set()

    def addWord(self, word: str) -> None:
        self.words.add(word)

    def search(self, word: str) -> bool:
        return word in self.words`,
    cpp: `class WordDictionary {
public:
    WordDictionary() {}

    void addWord(string word) { words.insert(word); }

    bool search(string word) { return words.count(word) > 0; }

private:
    set<string> words;
};`,
  },

  visible: [
    'ops = ["addWord bad","addWord dad","addWord mad","search pad","search bad","search .ad","search b.."]',
    'ops = ["search a"]',
    'ops = ["addWord a","search ."]',
    'ops = ["addWord ab","search a.","search .b","search .."]',
  ],

  hidden: [
    'ops = ["addWord a","search a","search b"]',
    'ops = ["addWord abc","search ...","search ....","search ..","search a.c"]',
    'ops = ["addWord at","addWord and","addWord an","search a.","search .n"]',
    'ops = ["addWord xyz","search x..","search ..z","search ...z"]',
    'ops = ["addWord aa","addWord ab","search a."]',
    'ops = ["addWord hello","search h.llo","search hell.","search .....","search ......"]',
    'ops = ["addWord 12","search 1.","search .2"]',
    `ops = [${many.join(',')}]`,
  ],
}
