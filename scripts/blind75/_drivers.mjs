// Shared stdin-parsing helpers interpolated into every question's `main`.
//
// Input grammar (LeetCode-style, one named argument per line):
//   nums = [2,7,11,15]
//   target = 9
//   s = "babad"
//   strs = ["eat","tea","tan"]
//
// Every helper tolerates the `name =` prefix being absent, so a bare
// `[2,7,11,15]` or `babad` parses identically.
//
// Output conventions (must match `expected_output` exactly; Judge0 trims
// only trailing whitespace):
//   bool          -> true / false        (lowercase)
//   int           -> 42
//   int array     -> space separated on one line
//   string        -> raw, unquoted
//   list of lists -> one per line, values space separated

export const PY_HELPERS = `
def _val(line):
    """Strip a leading 'name =' prefix, if present."""
    if line is None:
        return ""
    return line.split("=", 1)[1].strip() if "=" in line else line.strip()


def _pstr(line):
    v = _val(line)
    if len(v) >= 2 and v[0] == '"' and v[-1] == '"':
        v = v[1:-1]
    elif len(v) >= 2 and v[0] == "'" and v[-1] == "'":
        v = v[1:-1]
    return v


def _pint(line):
    v = _val(line).strip("[]")
    return int(v) if v else 0


def _pints(line):
    v = _val(line).replace("[", " ").replace("]", " ").replace(",", " ")
    return [int(tok) for tok in v.split()]


def _pstrs(line):
    v = _val(line).strip()
    if v.startswith("["):
        v = v[1:]
    if v.endswith("]"):
        v = v[:-1]
    # Emptiness is decided on the raw text, before quotes are stripped, so that
    # an empty bracket pair yields [] while a bracketed empty string yields [""].
    if v.strip() == "":
        return []
    out = []
    for tok in v.split(","):
        tok = tok.strip()
        if len(tok) >= 2 and tok[0] == '"' and tok[-1] == '"':
            tok = tok[1:-1]
        elif len(tok) >= 2 and tok[0] == "'" and tok[-1] == "'":
            tok = tok[1:-1]
        out.append(tok)
    return out


def _lines():
    return sys.stdin.read().split("\\n")
`.trim()

export const CPP_HELPERS = `
static string _val(const string& line) {
    size_t eq = line.find('=');
    string v = (eq == string::npos) ? line : line.substr(eq + 1);
    size_t b = v.find_first_not_of(" \\t\\r\\n");
    if (b == string::npos) return "";
    size_t e = v.find_last_not_of(" \\t\\r\\n");
    return v.substr(b, e - b + 1);
}

static string _pstr(const string& line) {
    string v = _val(line);
    if (v.size() >= 2 && ((v.front() == '"' && v.back() == '"') ||
                          (v.front() == '\\'' && v.back() == '\\''))) {
        v = v.substr(1, v.size() - 2);
    }
    return v;
}

static int _pint(const string& line) {
    string v = _val(line);
    string digits;
    for (char c : v) {
        if (isdigit((unsigned char)c) || c == '-') digits += c;
    }
    return digits.empty() ? 0 : stoi(digits);
}

static vector<int> _pints(const string& line) {
    string v = _val(line);
    for (char& c : v) {
        if (c == '[' || c == ']' || c == ',') c = ' ';
    }
    vector<int> out;
    stringstream ss(v);
    long long x;
    while (ss >> x) out.push_back((int)x);
    return out;
}

static vector<string> _pstrs(const string& line) {
    string v = _val(line);
    if (!v.empty() && v.front() == '[') v.erase(v.begin());
    if (!v.empty() && v.back() == ']') v.pop_back();
    // Emptiness is decided on the raw text, before quotes are stripped, so that
    // an empty bracket pair yields [] while a bracketed empty string yields [""].
    if (v.find_first_not_of(" \\t\\r\\n") == string::npos) return vector<string>();
    vector<string> out;
    string tok;
    stringstream ss(v);
    while (getline(ss, tok, ',')) {
        size_t b = tok.find_first_not_of(" \\t\\r\\n");
        if (b == string::npos) { out.push_back(""); continue; }
        size_t e = tok.find_last_not_of(" \\t\\r\\n");
        tok = tok.substr(b, e - b + 1);
        if (tok.size() >= 2 && ((tok.front() == '"' && tok.back() == '"') ||
                                (tok.front() == '\\'' && tok.back() == '\\''))) {
            tok = tok.substr(1, tok.size() - 2);
        }
        out.push_back(tok);
    }
    return out;
}

static vector<string> _lines() {
    vector<string> ls;
    string l;
    while (getline(cin, l)) {
        if (!l.empty() && l.back() == '\\r') l.pop_back();
        ls.push_back(l);
    }
    while (ls.size() < 8) ls.push_back("");
    return ls;
}
`.trim()

// Standard C++ prelude. Deliberately NOT <bits/stdc++.h>: that is a GCC
// extension, so it builds on Judge0's GCC 9.2 but not on local Apple clang,
// which would make local verification impossible.
export const CPP_INCLUDES = `#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <climits>
#include <cctype>

using namespace std;`

// Standard Python prelude. Judge0 language 71 is Python 3.8, so no builtin
// generics (`list[int]`) — typing.List only.
export const PY_IMPORTS = `import sys
from typing import List, Optional`

// --- matrix / nested-array parsing --------------------------------------
// For inputs like `matrix = [[1,2],[3,4]]` or `board = [["A","B"],["C","D"]]`.
// Written as a bracket-depth scan rather than a regex so no extra import is
// needed on the Python side.

export const PY_MATRIX = `
def _pmatrix(line):
    v = _val(line)
    rows = []
    depth = 0
    buf = ""
    for ch in v:
        if ch == "[":
            depth += 1
            if depth == 2:
                buf = ""
            continue
        if ch == "]":
            if depth == 2:
                rows.append([int(t) for t in buf.replace(",", " ").split()])
            depth -= 1
            continue
        if depth == 2:
            buf += ch
    return rows


def _pstrmatrix(line):
    v = _val(line)
    rows = []
    depth = 0
    buf = ""
    for ch in v:
        if ch == "[":
            depth += 1
            if depth == 2:
                buf = ""
            continue
        if ch == "]":
            if depth == 2:
                row = []
                for tok in buf.split(","):
                    tok = tok.strip()
                    if len(tok) >= 2 and tok[0] == '"' and tok[-1] == '"':
                        tok = tok[1:-1]
                    if tok != "":
                        row.append(tok)
                rows.append(row)
            depth -= 1
            continue
        if depth == 2:
            buf += ch
    return rows
`.trim()

export const CPP_MATRIX = `
static vector<vector<int> > _pmatrix(const string& line) {
    string v = _val(line);
    vector<vector<int> > rows;
    int depth = 0;
    string buf;
    for (size_t i = 0; i < v.size(); i++) {
        char ch = v[i];
        if (ch == '[') { depth++; if (depth == 2) buf.clear(); continue; }
        if (ch == ']') {
            if (depth == 2) {
                for (size_t k = 0; k < buf.size(); k++) if (buf[k] == ',') buf[k] = ' ';
                vector<int> row;
                stringstream ss(buf);
                long long x;
                while (ss >> x) row.push_back((int)x);
                rows.push_back(row);
            }
            depth--;
            continue;
        }
        if (depth == 2) buf += ch;
    }
    return rows;
}

static vector<vector<string> > _pstrmatrix(const string& line) {
    string v = _val(line);
    vector<vector<string> > rows;
    int depth = 0;
    string buf;
    for (size_t i = 0; i < v.size(); i++) {
        char ch = v[i];
        if (ch == '[') { depth++; if (depth == 2) buf.clear(); continue; }
        if (ch == ']') {
            if (depth == 2) {
                vector<string> row;
                stringstream ss(buf);
                string tok;
                while (getline(ss, tok, ',')) {
                    size_t b = tok.find_first_not_of(" \\t\\r\\n");
                    if (b == string::npos) continue;
                    size_t e = tok.find_last_not_of(" \\t\\r\\n");
                    tok = tok.substr(b, e - b + 1);
                    if (tok.size() >= 2 && tok[0] == '"' && tok[tok.size() - 1] == '"') {
                        tok = tok.substr(1, tok.size() - 2);
                    }
                    if (!tok.empty()) row.push_back(tok);
                }
                rows.push_back(row);
            }
            depth--;
            continue;
        }
        if (depth == 2) buf += ch;
    }
    return rows;
}
`.trim()

// --- binary tree ---------------------------------------------------------
// Node definitions go in `imports` (candidates must see them); build/serialise
// helpers go in `main`. Serialisation trims trailing nulls so that two trees
// that are structurally equal always print identically.

export const PY_TREENODE = `
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
`.trim()

export const CPP_TREENODE = `
// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(NULL), right(NULL) {}
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
    TreeNode(int x, TreeNode *l, TreeNode *r) : val(x), left(l), right(r) {}
};
`.trim()

export const PY_TREE_HELPERS = `
def _ptokens(line):
    v = _val(line)
    if v.startswith("["):
        v = v[1:]
    if v.endswith("]"):
        v = v[:-1]
    out = []
    for t in v.split(","):
        t = t.strip()
        if len(t) >= 2 and t[0] == '"' and t[-1] == '"':
            t = t[1:-1]
        if t != "":
            out.append(t)
    return out


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


def _serialize_tree(root):
    """Level order with 'null' placeholders, trailing nulls trimmed."""
    if root is None:
        return []
    out = []
    queue = [root]
    head = 0
    while head < len(queue):
        node = queue[head]
        head += 1
        if node is None:
            out.append("null")
            continue
        out.append(str(node.val))
        queue.append(node.left)
        queue.append(node.right)
    while out and out[-1] == "null":
        out.pop()
    return out
`.trim()

export const CPP_TREE_HELPERS = `
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
        tok = tok.substr(b, e - b + 1);
        if (tok.size() >= 2 && tok[0] == '"' && tok[tok.size() - 1] == '"') {
            tok = tok.substr(1, tok.size() - 2);
        }
        if (!tok.empty()) out.push_back(tok);
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
            if (toks[i] != "null") { node->left = new TreeNode(stoi(toks[i])); q.push(node->left); }
            i++;
        }
        if (i < toks.size()) {
            if (toks[i] != "null") { node->right = new TreeNode(stoi(toks[i])); q.push(node->right); }
            i++;
        }
    }
    return root;
}

static vector<string> _serializeTree(TreeNode* root) {
    vector<string> out;
    if (root == NULL) return out;
    vector<TreeNode*> q;
    q.push_back(root);
    size_t head = 0;
    while (head < q.size()) {
        TreeNode* node = q[head++];
        if (node == NULL) { out.push_back("null"); continue; }
        ostringstream os;
        os << node->val;
        out.push_back(os.str());
        q.push_back(node->left);
        q.push_back(node->right);
    }
    while (!out.empty() && out[out.size() - 1] == "null") out.pop_back();
    return out;
}
`.trim()

// --- singly linked list --------------------------------------------------

export const PY_LISTNODE = `
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
`.trim()

export const CPP_LISTNODE = `
// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(NULL) {}
    ListNode(int x) : val(x), next(NULL) {}
    ListNode(int x, ListNode *n) : val(x), next(n) {}
};
`.trim()

export const PY_LIST_HELPERS = `
def _build_list(values):
    head = None
    for v in reversed(values):
        node = ListNode(v)
        node.next = head
        head = node
    return head


def _dump_list(node, limit=100000):
    out = []
    while node is not None and len(out) < limit:
        out.append(str(node.val))
        node = node.next
    return out
`.trim()

export const CPP_LIST_HELPERS = `
static ListNode* _buildList(const vector<int>& values) {
    ListNode* head = NULL;
    for (int i = (int)values.size() - 1; i >= 0; i--) {
        ListNode* node = new ListNode(values[i]);
        node->next = head;
        head = node;
    }
    return head;
}

static vector<string> _dumpList(ListNode* node, size_t limit = 100000) {
    vector<string> out;
    while (node != NULL && out.size() < limit) {
        ostringstream os;
        os << node->val;
        out.push_back(os.str());
        node = node->next;
    }
    return out;
}
`.trim()
