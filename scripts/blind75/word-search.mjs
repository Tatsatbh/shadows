import { PY_HELPERS, CPP_HELPERS, CPP_INCLUDES, PY_IMPORTS, PY_MATRIX, CPP_MATRIX } from './_drivers.mjs'

// 6x6 of 'a' with no 'b', so the search must exhaust every path before failing.
const grid = Array.from({ length: 6 }, () => `["a","a","a","a","a","a"]`).join(',')

export default {
  question_number: 48,
  title: 'Word Search',
  difficulty: 'Medium',
  question_uri: 'word-search',
  summary: 'Decide whether a word can be spelled by walking adjacent cells of a grid without reuse.',

  description_md: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word is built from letters of **sequentially adjacent** cells, where adjacent means horizontally or vertically neighbouring. **The same cell may not be used more than once.**

---

**Example 1**
\`\`\`text
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true
\`\`\`

**Example 2**
\`\`\`text
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
Output: true
\`\`\`

**Example 3**
\`\`\`text
Input: board = [["A","B"],["C","D"]], word = "ABCD"
Output: false
Explanation: B and C are not adjacent, and diagonal moves are not allowed.
\`\`\`

## Constraints

- \`1 <= m, n <= 6\`
- \`1 <= word.length <= 15\`
- \`board\` and \`word\` consist of uppercase and lowercase English letters.
- Print \`true\` or \`false\` in lowercase.`,

  starters: {
    python: {
      imports: `${PY_IMPORTS}

sys.setrecursionlimit(200000)`,
      code: `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        pass
`,
      main: `${PY_HELPERS}


${PY_MATRIX}


if __name__ == "__main__":
    _ls = _lines()
    _board = _pstrmatrix(_ls[0] if len(_ls) > 0 else "")
    _word = _pstr(_ls[1] if len(_ls) > 1 else "")
    print("true" if Solution().exist(_board, _word) else "false")
`,
    },
    cpp: {
      imports: CPP_INCLUDES,
      code: `class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {

    }
};`,
      main: `${CPP_HELPERS}

${CPP_MATRIX}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<string> ls = _lines();
    vector<vector<string> > raw = _pstrmatrix(ls[0]);
    string word = _pstr(ls[1]);

    // The Solution signature takes chars; the parser yields one-character strings.
    vector<vector<char> > board;
    for (size_t i = 0; i < raw.size(); i++) {
        vector<char> row;
        for (size_t j = 0; j < raw[i].size(); j++) {
            row.push_back(raw[i][j].empty() ? ' ' : raw[i][j][0]);
        }
        board.push_back(row);
    }

    Solution sol;
    cout << (sol.exist(board, word) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  solutions: {
    python: `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        if not board or not board[0] or not word:
            return False
        rows, cols = len(board), len(board[0])

        def dfs(r, c, k):
            if k == len(word):
                return True
            if r < 0 or r >= rows or c < 0 or c >= cols:
                return False
            if board[r][c] != word[k]:
                return False
            saved = board[r][c]
            board[r][c] = "#"
            found = (dfs(r + 1, c, k + 1) or dfs(r - 1, c, k + 1) or
                     dfs(r, c + 1, k + 1) or dfs(r, c - 1, k + 1))
            board[r][c] = saved
            return found

        for i in range(rows):
            for j in range(cols):
                if dfs(i, j, 0):
                    return True
        return False`,
    cpp: `class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        if (board.empty() || board[0].empty() || word.empty()) return false;
        rows = (int)board.size();
        cols = (int)board[0].size();
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (dfs(board, word, i, j, 0)) return true;
            }
        }
        return false;
    }

private:
    int rows, cols;

    bool dfs(vector<vector<char> >& board, const string& word, int r, int c, int k) {
        if (k == (int)word.size()) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
        if (board[r][c] != word[k]) return false;
        char saved = board[r][c];
        board[r][c] = '#';
        bool found = dfs(board, word, r + 1, c, k + 1) || dfs(board, word, r - 1, c, k + 1) ||
                     dfs(board, word, r, c + 1, k + 1) || dfs(board, word, r, c - 1, k + 1);
        board[r][c] = saved;
        return found;
    }
};`,
  },

  // Never marks cells as visited, so a letter can be reused.
  wrong: {
    python: `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        if not board or not board[0] or not word:
            return False
        rows, cols = len(board), len(board[0])

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
        return False`,
    cpp: `class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        if (board.empty() || board[0].empty() || word.empty()) return false;
        rows = (int)board.size();
        cols = (int)board[0].size();
        for (int i = 0; i < rows; i++)
            for (int j = 0; j < cols; j++)
                if (dfs(board, word, i, j, 0)) return true;
        return false;
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
};`,
  },

  visible: [
    'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nword = "ABCCED"',
    'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nword = "SEE"',
    'board = [["A","B"],["C","D"]]\nword = "ABCD"',
    'board = [["A"]]\nword = "A"',
  ],

  hidden: [
    'board = [["A"]]\nword = "B"',
    'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nword = "ABCB"',
    'board = [["a","b"],["c","d"]]\nword = "abcd"',
    'board = [["C","A","A"],["A","A","A"],["B","C","D"]]\nword = "AAB"',
    'board = [["a","a"]]\nword = "aaa"',
    'board = [["A","B","C","E"],["S","F","E","S"],["A","D","E","E"]]\nword = "ABCESEEEFS"',
    'board = [["b","a","a","b","a","b"],["a","b","a","a","a","a"],["a","b","a","a","a","b"],["a","b","a","b","b","a"],["a","a","b","b","a","b"],["a","a","b","b","b","a"]]\nword = "abbbababaa"',
    `board = [${grid}]\nword = "aaaaaaaaaaaab"`,
  ],
}
