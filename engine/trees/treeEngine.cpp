#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <cctype>

using namespace std;

/* =========================
   STEP STRUCT
   ========================= */
struct Step {
    string op;                   // build | visit | found | not_found
    int i;                       // index in array
    int j;                       // step count
    vector<string> tree;         // tree snapshot
};

/* =========================
   BASIC PARSERS
   ========================= */
string parseString(const string& in, const string& key) {
    size_t p = in.find("\"" + key + "\"");
    if (p == string::npos) return "";
    p = in.find(":", p);
    p = in.find("\"", p) + 1;
    return in.substr(p, in.find("\"", p) - p);
}

int parseInt(const string& in, const string& key) {
    size_t p = in.find("\"" + key + "\"");
    if (p == string::npos) return -1;
    p = in.find(":", p);
    return stoi(in.substr(p + 1));
}

/* =========================
   PARSE VALUES ARRAY
   ========================= */
vector<string> parseValues(const string& input) {
    vector<string> out;
    size_t p = input.find("\"values\"");
    if (p == string::npos) return out;

    p = input.find("[", p);
    size_t e = input.find("]", p);

    string cur;
    for (size_t i = p + 1; i < e; i++) {
        char c = input[i];
        if (c == ',' || c == ']') {
            if (!cur.empty()) {
                out.push_back(cur);
                cur.clear();
            }
        } else if (!isspace(c) && c != '"') {
            cur += c;
        }
    }
    if (!cur.empty()) out.push_back(cur);
    return out;
}

/* =========================
   BST INSERTION
   ========================= */
void bstInsert(vector<string>& tree, int val, int idx) {
    if (idx >= tree.size()) {
        tree.resize(idx + 1, "null");
    }

    if (tree[idx] == "null") {
        tree[idx] = to_string(val);
        return;
    }

    int cur = stoi(tree[idx]);
    if (val < cur)
        bstInsert(tree, val, 2 * idx + 1);
    else
        bstInsert(tree, val, 2 * idx + 2);
}

/* =========================
   TRAVERSALS
   ========================= */
void inorder(int i, const vector<string>& t, vector<Step>& s, int& c) {
    if (i >= t.size() || t[i] == "null") return;
    inorder(2*i+1, t, s, c);
    s.push_back({"visit", i, c++, t});
    inorder(2*i+2, t, s, c);
}

void preorder(int i, const vector<string>& t, vector<Step>& s, int& c) {
    if (i >= t.size() || t[i] == "null") return;
    s.push_back({"visit", i, c++, t});
    preorder(2*i+1, t, s, c);
    preorder(2*i+2, t, s, c);
}

void postorder(int i, const vector<string>& t, vector<Step>& s, int& c) {
    if (i >= t.size() || t[i] == "null") return;
    postorder(2*i+1, t, s, c);
    postorder(2*i+2, t, s, c);
    s.push_back({"visit", i, c++, t});
}

void levelorder(const vector<string>& t, vector<Step>& s) {
    queue<int> q;
    int c = 0;
    if (!t.empty() && t[0] != "null") q.push(0);

    while (!q.empty()) {
        int i = q.front(); q.pop();
        s.push_back({"visit", i, c++, t});
        int l = 2*i+1, r = 2*i+2;
        if (l < t.size() && t[l] != "null") q.push(l);
        if (r < t.size() && t[r] != "null") q.push(r);
    }
}

/* =========================
   SEARCH
   ========================= */
bool dfsSearch(int i, const vector<string>& t, int target,
               vector<Step>& s, int& c) {
    if (i >= t.size() || t[i] == "null") return false;

    s.push_back({"visit", i, c++, t});
    if (stoi(t[i]) == target) {
        s.push_back({"found", i, c++, t});
        return true;
    }

    return dfsSearch(2*i+1, t, target, s, c) ||
           dfsSearch(2*i+2, t, target, s, c);
}

/* =========================
   JSON OUTPUT
   ========================= */
void printJSON(const vector<Step>& steps) {
    cout << "{\n  \"steps\": [\n";
    for (size_t k = 0; k < steps.size(); k++) {
        auto& s = steps[k];
        cout << "    {\n";
        cout << "      \"op\": \"" << s.op << "\",\n";
        cout << "      \"i\": " << s.i << ",\n";
        cout << "      \"j\": " << s.j << ",\n";
        cout << "      \"tree\": [";
        for (size_t i = 0; i < s.tree.size(); i++) {
            if (s.tree[i] == "null") cout << "null";
            else cout << "\"" << s.tree[i] << "\"";
            if (i + 1 < s.tree.size()) cout << ", ";
        }
        cout << "]\n    }";
        if (k + 1 < steps.size()) cout << ",";
        cout << "\n";
    }
    cout << "  ]\n}\n";
}

/* =========================
   MAIN
   ========================= */
int main() {
    string input, line;
    while (getline(cin, line)) input += line;

    string op = parseString(input, "operation");
    vector<Step> steps;
    vector<string> tree;
    int c = 0;

    if (op == "build") {
        string type = parseString(input, "build_type");
        vector<string> values = parseValues(input);

        if (type == "levelorder") {
            tree = values;
        } else if (type == "bst") {
            tree.clear();
            for (auto& v : values) {
                if (v == "null") continue;
                bstInsert(tree, stoi(v), 0);
            }
        }

        steps.push_back({"build", -1, -1, tree});
    }

    else if (op == "traversal") {
        string algo = parseString(input, "algorithm");
        tree = parseValues(input);  // backend passes current tree as values

        if (algo == "inorder") inorder(0, tree, steps, c);
        else if (algo == "preorder") preorder(0, tree, steps, c);
        else if (algo == "postorder") postorder(0, tree, steps, c);
        else if (algo == "levelorder") levelorder(tree, steps);
    }

    else if (op == "search") {
        int target = parseInt(input, "target");
        tree = parseValues(input);

        if (!dfsSearch(0, tree, target, steps, c))
            steps.push_back({"not_found", -1, -1, tree});
    }

    printJSON(steps);
    return 0;
}
