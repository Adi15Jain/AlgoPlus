#include <iostream>
#include <vector>
#include <string>
#include <cctype>
#include <climits>

using namespace std;

/* =========================
   STEP STRUCT (LOCKED)
   ========================= */
struct Step {
    string op;        // visit, found, not_found
    int i;            // current index / mid
    int j;            // auxiliary (low/high for binary)
    vector<int> array;
};

/* =========================
   PARSE ARRAY
   ========================= */
vector<int> parseArray(const string& input) {
    vector<int> arr;

    // locate "array"
    size_t pos = input.find("\"array\"");
    if (pos == string::npos) return arr;

    // locate '[' and ']'
    pos = input.find("[", pos);
    size_t end = input.find("]", pos);

    if (pos == string::npos || end == string::npos) return arr;

    string arrayContent = input.substr(pos + 1, end - pos - 1);

    int num = 0;
    bool inNumber = false;

    for (char c : arrayContent) {
        if (isdigit(c) || c == '-') {
            num = num * 10 + (c - '0');
            inNumber = true;
        } else if (inNumber) {
            arr.push_back(num);
            num = 0;
            inNumber = false;
        }
    }
    if (inNumber) arr.push_back(num);

    return arr;
}


/* =========================
   PARSE TARGET
   ========================= */
int parseTarget(const string& input) {
    string key = "\"target\"";
    size_t pos = input.find(key);
    if (pos == string::npos) return INT_MIN;

    pos = input.find(":", pos);
    size_t end = input.find_first_of(",}", pos);
    string value = input.substr(pos + 1, end - pos - 1);

    return stoi(value);
}

/* =========================
   PARSE ALGORITHM
   ========================= */
string parseAlgorithm(const string& input) {
    string key = "\"algorithm\"";
    size_t pos = input.find(key);
    if (pos == string::npos) return "linear";

    pos = input.find(":", pos);
    pos = input.find("\"", pos) + 1;
    size_t end = input.find("\"", pos);

    string algo = input.substr(pos, end - pos);

    if (algo == "linear_search") return "linear";
    if (algo == "binary_search") return "binary";

    return algo;
}

/* =========================
   LINEAR SEARCH
   ========================= */
vector<Step> linearSearch(const vector<int>& arr, int target) {
    vector<Step> steps;

    for (int i = 0; i < arr.size(); i++) {
        steps.push_back({"visit", i, -1, arr});

        if (arr[i] == target) {
            steps.push_back({"found", i, -1, arr});
            return steps;
        }
    }

    steps.push_back({"not_found", -1, -1, arr});
    return steps;
}

/* =========================
   BINARY SEARCH
   ========================= */
vector<Step> binarySearch(const vector<int>& arr, int target) {
    vector<Step> steps;

    int low = 0;
    int high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        // visit mid (store low & high in j for visualization if needed)
        steps.push_back({"visit", mid, high, arr});

        if (arr[mid] == target) {
            steps.push_back({"found", mid, high, arr});
            return steps;
        }

        if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    steps.push_back({"not_found", -1, -1, arr});
    return steps;
}

/* =========================
   SEARCH DISPATCHER
   ========================= */
vector<Step> runSearching(
    const string& algorithm,
    const vector<int>& arr,
    int target
) {
    if (algorithm == "linear") {
        return linearSearch(arr, target);
    }

    if (algorithm == "binary") {
        return binarySearch(arr, target);
    }

    return {};
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

    string algorithm = parseAlgorithm(input);
    vector<int> arr = parseArray(input);
    int target = parseTarget(input);

    vector<Step> steps = runSearching(algorithm, arr, target);
    printJSON(steps);

    return 0;
}
