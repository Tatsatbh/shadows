import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

// 10x10 all-'a' board with words that mostly do not exist: the case that
// punishes a per-word backtracking search and rewards a trie.
const board = Array.from({ length: 10 }, () => `[${Array(10).fill('"a"').join(',')}]`).join(',')
const words = Array.from({ length: 30 }, (_, i) => `"${'a'.repeat(9)}${i === 0 ? 'a' : 'b'}"`).join(',')

export default {
  question_number: 74,
  title: 'Word Search II',
  difficulty: 'Hard',
  question_uri: 'word-search-ii',
  summary: 'Find every dictionary word that can be traced on a character grid.',

  description_md: `Given an \`m x n\` \`board\` of characters and a list of strings \`words\`, return **all the words on the board**.

Each word must be built from letters of **sequentially adjacent** cells — horizontally or vertically neighbouring — and the same cell may not be used more than once **within a single word**.

Searching for each word independently is too slow when the dictionary is large. Building a **trie** of the dictionary and walking the board once, pruning branches with no matching prefix, is the intended solution.

### Output format

Any order is accepted — the driver **sorts the returned words** before printing. Print the number of words found on the first line, then one word per line.

---

**Example 1**
\`\`\`text
Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
Output:
2
eat
oath
\`\`\`

**Example 2**
\`\`\`text
Input: board = [["a","b"],["c","d"]], words = ["abcb"]
Output:
0
Explanation: Reusing the 'b' cell is not allowed.
\`\`\`

**Example 3**
\`\`\`text
Input: board = [["a"]], words = ["a"]
Output:
1
a
\`\`\`

## Constraints

- \`1 <= m, n <= 12\`
- \`1 <= words.length <= 3 * 10^4\`
- \`1 <= words[i].length <= 10\`
- All words are unique and consist of lowercase English letters.
- Each word appears in the output **at most once**, even if it can be traced by several paths.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)`,
      code: `class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _board = _pstrmatrix(_ls[0] if len(_ls) > 0 else "")
    _words = _pstrs(_ls[1] if len(_ls) > 1 else "")
    _res = Solution().findWords(_board, _words) or []
    _canon = sorted(set(_res))
    print(len(_canon))
    for _w in _canon:
        print(_w)
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_MATRIX}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<vector<string> > raw = _pstrmatrix(ls[0]);
    vector<string> words = _pstrs(ls[1]);

    vector<vector<char> > board;
    for (size_t i = 0; i < raw.size(); i++) {
        vector<char> row;
        for (size_t j = 0; j < raw[i].size(); j++) {
            row.push_back(raw[i][j].empty() ? ' ' : raw[i][j][0]);
        }
        board.push_back(row);
    }

    Solution sol;
    vector<string> res = sol.findWords(board, words);
    sort(res.begin(), res.end());
    res.erase(unique(res.begin(), res.end()), res.end());

    cout << res.size() << "\\n";
    for (size_t i = 0; i < res.size(); i++) cout << res[i] << "\\n";
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        if not board or not board[0]:
            return []
        root = {}
        for word in words:
            node = root
            for ch in word:
                node = node.setdefault(ch, {})
            node["$"] = word

        rows, cols = len(board), len(board[0])
        found = []

        def dfs(r, c, node):
            ch = board[r][c]
            nxt = node.get(ch)
            if nxt is None:
                return
            word = nxt.pop("$", None)
            if word is not None:
                found.append(word)
            board[r][c] = "#"
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "#":
                    dfs(nr, nc, nxt)
            board[r][c] = ch
            if not nxt:
                node.pop(ch, None)

        for i in range(rows):
            for j in range(cols):
                dfs(i, j, root)
        return found`,
    cpp: `class Solution {
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        vector<string> found;
        if (board.empty() || board[0].empty()) return found;
        Node* root = new Node();
        for (size_t i = 0; i < words.size(); i++) {
            Node* node = root;
            for (size_t j = 0; j < words[i].size(); j++) {
                if (node->children.find(words[i][j]) == node->children.end()) {
                    node->children[words[i][j]] = new Node();
                }
                node = node->children[words[i][j]];
            }
            node->word = words[i];
        }
        rows = (int)board.size();
        cols = (int)board[0].size();
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) dfs(board, i, j, root, found);
        }
        return found;
    }

private:
    struct Node {
        map<char, Node*> children;
        string word;
    };

    int rows, cols;

    void dfs(vector<vector<char> >& board, int r, int c, Node* node, vector<string>& found) {
        char ch = board[r][c];
        map<char, Node*>::iterator it = node->children.find(ch);
        if (it == node->children.end()) return;
        Node* nxt = it->second;
        if (!nxt->word.empty()) {
            found.push_back(nxt->word);
            nxt->word.clear();
        }
        board[r][c] = '#';
        int dr[4] = {1, -1, 0, 0};
        int dc[4] = {0, 0, 1, -1};
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (board[nr][nc] == '#') continue;
            dfs(board, nr, nc, nxt, found);
        }
        board[r][c] = ch;
        if (nxt->children.empty() && nxt->word.empty()) node->children.erase(ch);
    }
};`,
  },

  // Ignores the visited rule, so a cell can be reused inside one word.
  wrong: {
    python: `class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        if not board or not board[0]:
            return []
        rows, cols = len(board), len(board[0])

        def exists(word):
            def dfs(r, c, k):
                if k == len(word):
                    return True
                if r < 0 or r >= rows or c < 0 or c >= cols:
                    return False
                if board[r][c] != word[k]:
                    return False
                return (dfs(r + 1, c, k + 1) or dfs(r - 1, c, k + 1) or
                        dfs(r, c + 1, k + 1) or dfs(r, c - 1, k + 1))
            for i in range(rows):
                for j in range(cols):
                    if dfs(i, j, 0):
                        return True
            return False

        return [w for w in words if exists(w)]`,
    cpp: `class Solution {
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        vector<string> out;
        if (board.empty() || board[0].empty()) return out;
        rows = (int)board.size();
        cols = (int)board[0].size();
        for (size_t i = 0; i < words.size(); i++) {
            if (exists(board, words[i])) out.push_back(words[i]);
        }
        return out;
    }

private:
    int rows, cols;

    bool dfs(vector<vector<char> >& board, const string& word, int r, int c, int k) {
        if (k == (int)word.size()) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
        if (board[r][c] != word[k]) return false;
        return dfs(board, word, r + 1, c, k + 1) || dfs(board, word, r - 1, c, k + 1) ||
               dfs(board, word, r, c + 1, k + 1) || dfs(board, word, r, c - 1, k + 1);
    }

    bool exists(vector<vector<char> >& board, const string& word) {
        for (int i = 0; i < rows; i++)
            for (int j = 0; j < cols; j++)
                if (dfs(board, word, i, j, 0)) return true;
        return false;
    }
};`,
  },

  visible: [
    'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\nwords = ["oath","pea","eat","rain"]',
    'board = [["a","b"],["c","d"]]\nwords = ["abcb"]',
    'board = [["a"]]\nwords = ["a"]',
    'board = [["a","b"],["c","d"]]\nwords = ["ab","cd","ac","abcd"]',
  ],

  hidden: [
    'board = [["a"]]\nwords = ["b"]',
    'board = [["a","a"]]\nwords = ["aaa"]',
    'board = [["a","b"],["a","a"]]\nwords = ["aba","baa","bab","aaab","aaa","aaaa","aaba"]',
    'board = [["o","a","b","n"],["o","t","a","e"],["a","h","k","r"],["a","f","l","v"]]\nwords = ["oa","oaa"]',
    'board = [["a","b","c"],["a","e","d"],["a","f","g"]]\nwords = ["abcdefg","gfedcbaaa","eaabcdgfa","befa","dgc","ade"]',
    'board = [["a","b","e"],["b","c","d"]]\nwords = ["abcdeb"]',
    'board = [["c","a","t"],["a","a","a"],["t","a","c"]]\nwords = ["cat","tac","aaa","cata"]',
    `board = [${board}]\nwords = [${words}]`,
  ],
}
