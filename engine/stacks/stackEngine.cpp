#include <iostream>
#include <vector>
#include <string>
#include <cctype>

using namespace std;

/* =========================
   STEP STRUCT
   ========================= */
struct Step {
    string op;        // push, pop, peek, error
    int i;            // top index
    int j;            // value involved
    vector<int> array;
};

/* =========================
   PARSE OPERATION
   ========================= */
string parseOperation(const string& input) {
    string key = "\"operation\"";
    size_t pos = input.find(key);
    if (pos == string::npos) return "";

    pos = input.find(":", pos);
    pos = input.find("\"", pos) + 1;
    size_t end = input.find("\"", pos);

    return input.substr(pos, end - pos);
}

/* =========================
   PARSE VALUE (for push)
   ========================= */
int parseValue(const string& input) {
    string key = "\"value\"";
    size_t pos = input.find(key);
    if (pos == string::npos) return 0;

    pos = input.find(":", pos);
    size_t end = input.find_first_of(",}", pos);
    string val = input.substr(pos + 1, end - pos - 1);

    return stoi(val);
}

vector<int> parseStack(const string& input) {
    vector<int> stack;

    size_t pos = input.find("\"stack\"");
    if (pos == string::npos) return stack;

    pos = input.find("[", pos);
    size_t end = input.find("]", pos);

    string content = input.substr(pos + 1, end - pos - 1);

    int num = 0;
    bool inNumber = false;

    for (char c : content) {
        if (isdigit(c) || c == '-') {
            num = num * 10 + (c - '0');
            inNumber = true;
        } else if (inNumber) {
            stack.push_back(num);
            num = 0;
            inNumber = false;
        }
    }
    if (inNumber) stack.push_back(num);

    return stack;
}


/* =========================
   JSON OUTPUT
   ========================= */
void printJSON(const vector<Step>& steps) {
    cout << "{\n  \"steps\": [\n";

    for (size_t k = 0; k < steps.size(); k++) {
        const Step& s = steps[k];
        cout << "    {\n";
        cout << "      \"op\": \"" << s.op << "\",\n";
        cout << "      \"i\": " << s.i << ",\n";
        cout << "      \"j\": " << s.j << ",\n";
        cout << "      \"array\": [";

        for (size_t i = 0; i < s.array.size(); i++) {
            cout << s.array[i];
            if (i != s.array.size() - 1) cout << ", ";
        }
        cout << "]\n    }";

        if (k != steps.size() - 1) cout << ",";
        cout << "\n";
    }

    cout << "  ]\n}\n";
}

/* =========================
   MAIN
   ========================= */
int main() {
    string input, line;
    while (getline(cin, line)) {
        input += line;
    }

    // Parse incoming stack from backend
    vector<int> stack = parseStack(input);

    vector<Step> steps;

    string operation = parseOperation(input);

    if (operation == "push") {
        int value = parseValue(input);
        stack.push_back(value);

        steps.push_back({
            "push",
            (int)stack.size() - 1,
            value,
            stack
        });
    }
    else if (operation == "pop") {
        if (stack.empty()) {
            steps.push_back({"error", -1, -1, stack});
        } else {
            int value = stack.back();
            stack.pop_back();

            steps.push_back({
                "pop",
                (int)stack.size() - 1,
                value,
                stack
            });
        }
    }
    else if (operation == "peek") {
        if (stack.empty()) {
            steps.push_back({"error", -1, -1, stack});
        } else {
            steps.push_back({
                "peek",
                (int)stack.size() - 1,
                stack.back(),
                stack
            });
        }
    }
    else {
        steps.push_back({"error", -1, -1, stack});
    }

    printJSON(steps);
    return 0;
}
