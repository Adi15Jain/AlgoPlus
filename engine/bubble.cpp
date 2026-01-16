#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <cctype>

using namespace std;

struct Step {
    string op;
    int i;
    int j;
    vector<int> array;
};

/* -------- Utility: parse array from JSON-like input -------- */
vector<int> parseArray(const string& input) {
    vector<int> arr;
    int num = 0;
    bool inNumber = false;

    for (char c : input) {
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

/* -------- Bubble Sort with Step Recording -------- */
vector<Step> bubbleSort(vector<int>& arr) {
    vector<Step> steps;
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {

            // compare
            steps.push_back({"compare", j, j + 1, arr});

            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                steps.push_back({"swap", j, j + 1, arr});
            }
        }
    }
    return steps;
}

/* -------- JSON Output -------- */
void printJSON(const vector<Step>& steps, const vector<int>& result) {
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

    cout << "  ],\n  \"result\": [";
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i != result.size() - 1) cout << ", ";
    }
    cout << "]\n}\n";
}

/* -------- Main -------- */
int main() {
    string input, line;
    while (getline(cin, line)) input += line;

    vector<int> arr = parseArray(input);
    vector<int> original = arr;

    vector<Step> steps = bubbleSort(arr);
    printJSON(steps, arr);

    return 0;
}
