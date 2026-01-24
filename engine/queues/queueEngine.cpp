#include <iostream>
#include <vector>
#include <string>
#include <cctype>

using namespace std;

/* =========================
   STEP STRUCT
   ========================= */
struct Step {
    string op;
    int i;
    int j;
    vector<int> array;
};

/* =========================
   PARSERS
   ========================= */
string parseOperation(const string& input) {
    size_t pos = input.find("\"operation\"");
    if (pos == string::npos) return "";

    pos = input.find(":", pos);
    pos = input.find("\"", pos) + 1;
    size_t end = input.find("\"", pos);

    return input.substr(pos, end - pos);
}

int parseValue(const string& input) {
    size_t pos = input.find("\"value\"");
    if (pos == string::npos) return 0;

    pos = input.find(":", pos);
    size_t end = input.find_first_of(",}", pos);
    return stoi(input.substr(pos + 1, end - pos - 1));
}

vector<int> parseQueue(const string& input) {
    vector<int> q;

    size_t pos = input.find("\"queue\"");
    if (pos == string::npos) return q;

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
            q.push_back(num);
            num = 0;
            inNumber = false;
        }
    }
    if (inNumber) q.push_back(num);

    return q;
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
    while (getline(cin, line)) input += line;

    vector<int> queue = parseQueue(input);
    vector<Step> steps;

    string operation = parseOperation(input);

    if (operation == "enqueue") {
        int value = parseValue(input);
        queue.push_back(value);

        steps.push_back({
            "enqueue",
            queue.empty() ? -1 : 0,
            value,
            queue
        });
    } else if (operation == "dequeue") {
        if (queue.empty()) {
            steps.push_back({"error", -1, -1, queue});
        } else {
            int value = queue.front();
            queue.erase(queue.begin());

            steps.push_back({
                "dequeue",
                queue.empty() ? -1 : 0,
                value,
                queue
            });
        }
    } else if (operation == "front") {
        if (queue.empty()) {
            steps.push_back({"error", -1, -1, queue});
        } else {
            steps.push_back({
                "front",
                0,
                queue.front(),
                queue
            });
        }
    } else {
        steps.push_back({"error", -1, -1, queue});
    }

    printJSON(steps);
    return 0;
}
