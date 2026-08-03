import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS } from './_drivers.mjs'

const many = []
for (let i = 0; i < 300; i++) many.push(`"insert w${i}"`)
for (let i = 0; i < 300; i++) many.push(`"search w${i}"`)
many.push('"startsWith w2"', '"search w300"')

export default {
  question_number: 72,
  title: 'Implement Trie (Prefix Tree)',
  difficulty: 'Medium',
  question_uri: 'implement-trie',
  summary: 'Build a prefix tree supporting insert, exact search, and prefix search.',

  description_md: `A **trie** (prefix tree) is a tree structure used to store and retrieve keys in a string dataset, most famously for autocomplete and spellchecking.

Implement the \`Trie\` class:

- \`insert(word)\` — inserts \`word\` into the trie
- \`search(word)\` — returns \`true\` if \`word\` is in the trie
- \`startsWith(prefix)\` — returns \`true\` if any inserted word begins with \`prefix\`

The distinction between \`search\` and \`startsWith\` is the whole point: \`search\` must land on a node marked as the end of a word, while \`startsWith\` only needs the path to exist.

### Input format

Operations come as an array of strings, one operation per entry, each a name followed by its argument:

\`\`\`text
ops = ["insert apple","search apple","search app","startsWith app","insert app","search app"]
\`\`\`

### Output format

Print the number of operations that return a value on the first line, then one result per line, \`true\` or \`false\`. \`insert\` returns nothing and produces no line.

---

**Example 1**
\`\`\`text
Input: ops = ["insert apple","search apple","search app","startsWith app","insert app","search app"]
Output:
4
true
false
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
Input: ops = ["insert a","startsWith a","search a"]
Output:
2
true
true
\`\`\`

## Constraints

- \`1 <= word.length, prefix.length <= 2000\`
- Words and prefixes consist of lowercase English letters and digits.
- At most \`3 * 10^4\` calls in total.`,

  starters: {
    python: {
      imports: PY_IMPORTS,
      code: `class Trie:
    def __init__(self):
        pass

    def insert(self, word: str) -> None:
        pass

    def search(self, word: str) -> bool:
        pass

    def startsWith(self, prefix: str) -> bool:
        pass
`,
      main: `${PY_HELPERS}


if __name__ == "__main__":
    _ls = _lines()
    _ops = _pstrs(_ls[0] if len(_ls) > 0 else "")
    _trie = Trie()
    _results = []
    for _op in _ops:
        _parts = _op.split(" ", 1)
        _name = _parts[0]
        _arg = _parts[1] if len(_parts) > 1 else ""
        if _name == "insert":
            _trie.insert(_arg)
        elif _name == "search":
            _results.append("true" if _trie.search(_arg) else "false")
        elif _name == "startsWith":
            _results.append("true" if _trie.startsWith(_arg) else "false")
    print(len(_results))
    for _r in _results:
        print(_r)
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Trie {
public:
    Trie() {

    }

    void insert(string word) {

    }

    bool search(string word) {

    }

    bool startsWith(string prefix) {

    }
};`,
      main: `${CPP_HELPERS}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<string> ops = _pstrs(ls[0]);

    Trie trie;
    vector<string> results;
    for (size_t i = 0; i < ops.size(); i++) {
        size_t sp = ops[i].find(' ');
        string name = (sp == string::npos) ? ops[i] : ops[i].substr(0, sp);
        string arg = (sp == string::npos) ? "" : ops[i].substr(sp + 1);
        if (name == "insert") trie.insert(arg);
        else if (name == "search") results.push_back(trie.search(arg) ? "true" : "false");
        else if (name == "startsWith") results.push_back(trie.startsWith(arg) ? "true" : "false");
    }

    cout << results.size() << "\\n";
    for (size_t i = 0; i < results.size(); i++) cout << results[i] << "\\n";
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Trie:
    def __init__(self):
        self.children = {}
        self.is_word = False

    def insert(self, word: str) -> None:
        node = self
        for ch in word:
            if ch not in node.children:
                node.children[ch] = Trie()
            node = node.children[ch]
        node.is_word = True

    def _walk(self, text):
        node = self
        for ch in text:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and node.is_word

    def startsWith(self, prefix: str) -> bool:
        return self._walk(prefix) is not None`,
    cpp: `class Trie {
public:
    Trie() : isWord(false) {}

    void insert(string word) {
        Trie* node = this;
        for (size_t i = 0; i < word.size(); i++) {
            if (node->children.find(word[i]) == node->children.end()) {
                node->children[word[i]] = new Trie();
            }
            node = node->children[word[i]];
        }
        node->isWord = true;
    }

    bool search(string word) {
        Trie* node = walk(word);
        return node != NULL && node->isWord;
    }

    bool startsWith(string prefix) {
        return walk(prefix) != NULL;
    }

private:
    map<char, Trie*> children;
    bool isWord;

    Trie* walk(const string& text) {
        Trie* node = this;
        for (size_t i = 0; i < text.size(); i++) {
            map<char, Trie*>::iterator it = node->children.find(text[i]);
            if (it == node->children.end()) return NULL;
            node = it->second;
        }
        return node;
    }
};`,
  },

  // Stores whole words in a set, so startsWith degenerates to exact matching.
  wrong: {
    python: `class Trie:
    def __init__(self):
        self.words = set()

    def insert(self, word: str) -> None:
        self.words.add(word)

    def search(self, word: str) -> bool:
        return word in self.words

    def startsWith(self, prefix: str) -> bool:
        return prefix in self.words`,
    cpp: `class Trie {
public:
    Trie() {}

    void insert(string word) { words.insert(word); }

    bool search(string word) { return words.count(word) > 0; }

    bool startsWith(string prefix) { return words.count(prefix) > 0; }

private:
    set<string> words;
};`,
  },

  visible: [
    'ops = ["insert apple","search apple","search app","startsWith app","insert app","search app"]',
    'ops = ["search a"]',
    'ops = ["insert a","startsWith a","search a"]',
    'ops = ["insert abc","startsWith ab","search ab"]',
  ],

  hidden: [
    'ops = ["startsWith x"]',
    'ops = ["insert hello","insert help","startsWith hel","search hel","search help"]',
    'ops = ["insert a","insert ab","insert abc","search ab","startsWith abc","search abcd"]',
    'ops = ["insert zzz","search zz","startsWith zz","startsWith zzzz"]',
    'ops = ["insert word","insert word","search word"]',
    'ops = ["insert ab","search a","startsWith a"]',
    'ops = ["insert 123","search 123","startsWith 12"]',
    `ops = [${many.join(',')}]`,
  ],
}
