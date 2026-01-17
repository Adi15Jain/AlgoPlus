#include <iostream>
#include <vector>
#include <string>
#include <cctype>

using namespace std;

/* =========================
   STEP STRUCT (LOCKED)
   ========================= */
struct Step {
    string op;        
    int i;
    int j;
    vector<int> array;
};

/* =========================
   PARSE ARRAY FROM INPUT
   ========================= */
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

/* =========================
   PARSE ALGORITHM NAME
   ========================= */
string parseAlgorithm(const string& input) {
    string key = "\"algorithm\"";
    size_t pos = input.find(key);
    if (pos == string::npos) return "bubble";

    pos = input.find(":", pos);
    pos = input.find("\"", pos) + 1;
    size_t end = input.find("\"", pos);

    string algo = input.substr(pos, end - pos);

    // normalize common names
    if (algo == "bubble_sort") return "bubble";
    if (algo == "selection_sort") return "selection";
    if (algo == "insertion_sort") return "insertion";
    if (algo == "merge_sort") return "merge";
    if (algo == "heap_sort") return "heap";
    if (algo == "quick_sort") return "quick";

    return algo;
}

/* =========================
   BUBBLE SORT
   ========================= */
vector<Step> bubbleSort(vector<int>& arr) {
    vector<Step> steps;
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            steps.push_back({"compare", j, j + 1, arr});
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                steps.push_back({"swap", j, j + 1, arr});
            }
        }
    }
    return steps;
}

/* =========================
   SELECTION SORT
   ========================= */
vector<Step> selectionSort(vector<int>& arr) {
    vector<Step> steps;
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;

        for (int j = i + 1; j < n; j++) {
            steps.push_back({"compare", minIdx, j, arr});
            if (arr[j] < arr[minIdx]) minIdx = j;
        }

        if (minIdx != i) {
            swap(arr[i], arr[minIdx]);
            steps.push_back({"swap", i, minIdx, arr});
        }
    }
    return steps;
}

/* =========================
   INSERTION SORT
   ========================= */
vector<Step> insertionSort(vector<int>& arr) {
    vector<Step> steps;
    int n = arr.size();

    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        while (j >= 0 && arr[j] > key) {
            steps.push_back({"compare", j, j + 1, arr});
            arr[j + 1] = arr[j];
            steps.push_back({"overwrite", j + 1, j + 1, arr});
            j--;
        }

        arr[j + 1] = key;
        steps.push_back({"overwrite", j + 1, j + 1, arr});
    }
    return steps;
}

/* =========================
   MERGE SORT
   ========================= */
void merge(
    vector<int>& arr,
    int l,
    int m,
    int r,
    vector<Step>& steps
) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);

    int i = 0, j = 0, k = l;

    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) {
            arr[k] = left[i++];
        } else {
            arr[k] = right[j++];
        }
        steps.push_back({"overwrite", k, k, arr});
        k++;
    }

    while (i < left.size()) {
        arr[k] = left[i++];
        steps.push_back({"overwrite", k, k, arr});
        k++;
    }

    while (j < right.size()) {
        arr[k] = right[j++];
        steps.push_back({"overwrite", k, k, arr});
        k++;
    }
}

void mergeSortHelper(
    vector<int>& arr,
    int l,
    int r,
    vector<Step>& steps
) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSortHelper(arr, l, m, steps);
    mergeSortHelper(arr, m + 1, r, steps);
    merge(arr, l, m, r, steps);
}

vector<Step> mergeSort(vector<int>& arr) {
    vector<Step> steps;
    mergeSortHelper(arr, 0, arr.size() - 1, steps);
    return steps;
}

/* =========================
   HEAP SORT
   ========================= */
void heapify(
    vector<int>& arr,
    int n,
    int i,
    vector<Step>& steps
) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;

    if (l < n) {
        steps.push_back({"compare", largest, l, arr});
        if (arr[l] > arr[largest]) largest = l;
    }

    if (r < n) {
        steps.push_back({"compare", largest, r, arr});
        if (arr[r] > arr[largest]) largest = r;
    }

    if (largest != i) {
        swap(arr[i], arr[largest]);
        steps.push_back({"swap", i, largest, arr});
        heapify(arr, n, largest, steps);
    }
}

vector<Step> heapSort(vector<int>& arr) {
    vector<Step> steps;
    int n = arr.size();

    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i, steps);
    }

    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        steps.push_back({"swap", 0, i, arr});
        heapify(arr, i, 0, steps);
    }
    return steps;
}

/* =========================
   QUICK SORT
   ========================= */
int partition(
    vector<int>& arr,
    int low,
    int high,
    vector<Step>& steps
) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        steps.push_back({"compare", j, high, arr});
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
            steps.push_back({"swap", i, j, arr});
        }
    }

    swap(arr[i + 1], arr[high]);
    steps.push_back({"swap", i + 1, high, arr});
    return i + 1;
}

void quickSortHelper(
    vector<int>& arr,
    int low,
    int high,
    vector<Step>& steps
) {
    if (low < high) {
        int pi = partition(arr, low, high, steps);
        quickSortHelper(arr, low, pi - 1, steps);
        quickSortHelper(arr, pi + 1, high, steps);
    }
}

vector<Step> quickSort(vector<int>& arr) {
    vector<Step> steps;
    quickSortHelper(arr, 0, arr.size() - 1, steps);
    return steps;
}

/* =========================
   SORTING DISPATCHER
   ========================= */
vector<Step> runSorting(const string& algo, vector<int>& arr) {
    if (algo == "bubble") return bubbleSort(arr);
    if (algo == "selection") return selectionSort(arr);
    if (algo == "insertion") return insertionSort(arr);
    if (algo == "merge") return mergeSort(arr);
    if (algo == "heap") return heapSort(arr);
    if (algo == "quick") return quickSort(arr);

    return bubbleSort(arr); // fallback
}

/* =========================
   JSON OUTPUT
   ========================= */
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

/* =========================
   MAIN
   ========================= */
int main() {
    string input, line;
    while (getline(cin, line)) input += line;

    string algorithm = parseAlgorithm(input);
    vector<int> arr = parseArray(input);

    vector<Step> steps = runSorting(algorithm, arr);
    printJSON(steps, arr);

    return 0;
}
