/* Programs from the updated Deep Learning Lab manual (U23AL511).
   Code is kept short and clean: comments stripped, formatting fixed,
   sample output preserved. */

export const EXPERIMENTS = [
  /* ---------------- Deep Learning Lab · Python ---------------- */
  {
    id: 1,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: 'AI, ML and Deep Learning',
    tag: 'Study and compare AI, ML and DL with real-world examples',
    file: 'ai_vs_ml_dl.py',
    aim: 'Study and compare the concepts of Artificial Intelligence, Machine Learning and Deep Learning with suitable real-world examples.',
    algorithm: ['Define each term in one line.', 'Compare scope, learning method and an example.', 'Print the comparison table.'],
    code: `comparison = {
    "AI": "Any technique that mimics human intelligence",
    "ML": "Learns patterns from data without explicit rules",
    "DL": "Uses multi-layer neural networks to learn features",
}

for name, meaning in comparison.items():
    print(f"{name:3} -> {meaning}")
`,
    output: `AI  -> Any technique that mimics human intelligence
ML  -> Learns patterns from data without explicit rules
DL  -> Uses multi-layer neural networks to learn features`
  },
  {
    id: 2,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: 'Deep Learning Applications',
    tag: 'Explore real-world applications across domains',
    file: 'dl_applications.py',
    aim: 'Explore and present various real-world applications of Deep Learning in different domains.',
    algorithm: ['List major application domains.', 'Add one example for each domain.', 'Print the applications.'],
    code: `applications = {
    "Healthcare": "Tumour detection in MRI scans",
    "Agriculture": "Crop disease detection from leaf images",
    "Education": "Automatic essay scoring",
    "Finance": "Fraud transaction detection",
    "Autonomous Vehicles": "Lane and pedestrian detection",
}

for domain, example in applications.items():
    print(f"{domain:20} : {example}")
`,
    output: `Healthcare           : Tumour detection in MRI scans
Agriculture          : Crop disease detection from leaf images
Education            : Automatic essay scoring
Finance              : Fraud transaction detection
Autonomous Vehicles  : Lane and pedestrian detection`
  },
  {
    id: 3,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: 'Artificial Neuron',
    tag: 'Weighted sum + sigmoid activation',
    file: 'artificial_neuron.py',
    aim: 'Design and explain the structure and working of an artificial neuron.',
    algorithm: ['Read inputs, weights and bias.', 'Compute the weighted sum.', 'Apply sigmoid activation and display the output.'],
    code: `import numpy as np

x = np.array([0.6, 0.9, 0.2])
w = np.array([0.4, -0.7, 0.5])
bias = 0.1

z = np.dot(x, w) + bias
out = 1 / (1 + np.exp(-z))

print("Inputs :", x)
print("Weights:", w)
print("Weighted sum  :", round(float(z), 4))
print("Neuron output :", round(float(out), 4))
`,
    output: `Inputs : [0.6 0.9 0.2]
Weights: [ 0.4 -0.7  0.5]
Weighted sum  : -0.19
Neuron output : 0.4526`
  },
  {
    id: 4,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: 'Simple Artificial Neural Network',
    tag: 'Input, hidden and output layers',
    file: 'simple_ann.py',
    aim: 'Construct a simple Artificial Neural Network (ANN) and identify its input, hidden and output layers.',
    algorithm: ['Feed two input values.', 'Compute the hidden layer with ReLU.', 'Compute and display the output layer value.'],
    code: `X = [0.8, 0.3]

W_hidden = [[0.2, 0.7],
            [0.6, -0.4]]
W_out = [0.5, -0.9]

hidden = [max(0, sum(x * w for x, w in zip(X, col)))
          for col in zip(*W_hidden)]
output = sum(h * w for h, w in zip(hidden, W_out))

print("Input layer  :", X)
print("Hidden layer :", [round(v, 2) for v in hidden])
print("Output layer :", round(output, 2))
`,
    output: `Input layer  : [0.8, 0.3]
Hidden layer : [0.34, 0.44]
Output layer : -0.23`
  },
  {
    id: 5,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: 'Data Pre-processing',
    tag: 'Features, labels and missing values',
    file: 'preprocessing.py',
    aim: 'Perform basic data pre-processing on a given dataset by identifying features, labels and handling missing values.',
    algorithm: ['Find missing values in a column.', 'Replace them with the column mean.', 'Separate features and labels, then display.'],
    code: `data = [
    {"age": 22, "marks": 80},
    {"age": None, "marks": 90},
    {"age": 26, "marks": 70},
]

ages = [r["age"] for r in data if r["age"] is not None]
mean_age = sum(ages) / len(ages)

for row in data:
    if row["age"] is None:
        row["age"] = round(mean_age, 1)

features = [[r["age"], r["marks"]] for r in data]
labels = ["pass" if r["marks"] >= 50 else "fail" for r in data]

print("Filled ages :", [r["age"] for r in data])
print("Features    :", features)
print("Labels      :", labels)
`,
    output: `Filled ages : [22, 24.0, 26]
Features    : [[22, 80], [24.0, 90], [26, 70]]
Labels      : ['pass', 'pass', 'pass']`
  },
  {
    id: 6,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: 'Train and Test Split',
    tag: '70/20 split with significance',
    file: 'train_test_split.py',
    aim: 'Split a given dataset into training and testing datasets and explain their significance in Deep Learning.',
    algorithm: ['Choose the split ratio.', 'Divide features and labels into train/test sets.', 'Print the size and contents of each set.'],
    code: `X = [[i] for i in range(1, 11)]
y = [i * 2 for i in range(1, 11)]

split = int(0.7 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

print("Training size :", len(X_train))
print("Training data :", X_train)
print("Testing size  :", len(X_test))
print("Testing data  :", X_test)
print("Train labels  :", y_train)
print("Test labels   :", y_test)
`,
    output: `Training size : 7
Training data : [[1], [2], [3], [4], [5], [6], [7]]
Testing size  : 3
Testing data  : [[8], [9], [10]]
Train labels  : [2, 4, 6, 8, 10, 12, 14]
Test labels   : [16, 18, 20]`
  },
  {
    id: 7,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: 'Simple DL Prediction Model',
    tag: 'Perceptron classifier on a sample dataset',
    file: 'predictor.py',
    aim: 'Develop a simple Deep Learning model for prediction or classification using a sample dataset.',
    algorithm: ['Define a small labelled dataset.', 'Compute the score for each sample.', 'Threshold the score to predict a class.'],
    code: `X = [[1, 2], [2, 1], [4, 5], [5, 4]]
y = [0, 0, 1, 1]

w = [0.4, 0.5]
bias = -2.0

for features, actual in zip(X, y):
    score = sum(f * wi for f, wi in zip(features, w)) + bias
    predicted = 1 if score >= 0 else 0
    print(features, "->", predicted, "(actual", actual, ")")
`,
    output: `[1, 2] -> 0 (actual 0)
[2, 1] -> 0 (actual 0)
[4, 5] -> 1 (actual 1)
[5, 4] -> 1 (actual 1)`
  },
  {
    id: 8,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: 'Model Evaluation',
    tag: 'Accuracy and confusion matrix',
    file: 'evaluate.py',
    aim: 'Evaluate the performance of a Deep Learning model using appropriate evaluation metrics such as accuracy and confusion matrix.',
    algorithm: ['Compare actual and predicted labels.', 'Count TP, TN, FP and FN.', 'Print the confusion matrix and accuracy.'],
    code: `actual    = [0, 1, 1, 0, 1, 0]
predicted = [0, 1, 0, 0, 1, 1]

tp = sum(a == 1 and p == 1 for a, p in zip(actual, predicted))
tn = sum(a == 0 and p == 0 for a, p in zip(actual, predicted))
fp = sum(a == 0 and p == 1 for a, p in zip(actual, predicted))
fn = sum(a == 1 and p == 0 for a, p in zip(actual, predicted))

print("Confusion matrix")
print("  TN", tn, "  FP", fp)
print("  FN", fn, "  TP", tp)
print("Accuracy:", round((tp + tn) / len(actual) * 100, 2), "%")
`,
    output: `Confusion matrix
  TN 2   FP 1
  FN 1   TP 2
Accuracy: 66.67 %`
  },
  {
    id: 9,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: 'Generative and Responsible AI',
    tag: 'Ethical issues in Deep Learning',
    file: 'responsible_ai.py',
    aim: 'Study the concepts of Generative AI, responsible AI and ethical issues in Deep Learning with suitable examples.',
    algorithm: ['List the pillars of responsible AI.', 'Add a short explanation for each.', 'Display the checklist.'],
    code: `checklist = [
    "Fairness       - check bias across groups",
    "Privacy        - protect personal data",
    "Transparency   - explain model decisions",
    "Safety         - test before real-world use",
    "Accountability - keep a human responsible",
]

print("Responsible AI checklist")
for item in checklist:
    print("-", item)
`,
    output: `Responsible AI checklist
- Fairness       - check bias across groups
- Privacy        - protect personal data
- Transparency   - explain model decisions
- Safety         - test before real-world use
- Accountability - keep a human responsible`
  },
  {
    id: 10,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: 'Mini Case Study — Healthcare',
    tag: 'Deep Learning in one real domain',
    file: 'case_study.py',
    aim: 'Develop a mini case study demonstrating the application of Deep Learning in any one domain such as Healthcare, Agriculture, Education, Finance or Autonomous Vehicles.',
    algorithm: ['Pick a domain and a small dataset.', 'Build a simple risk rule as a stand-in for the model.', 'Display the result for each record.'],
    code: `patients = [
    {"age": 45, "glucose": 120},
    {"age": 62, "glucose": 180},
    {"age": 33, "glucose": 95},
]

for p in patients:
    score = (p["age"] >= 50) + (p["glucose"] >= 140)
    risk = "high risk" if score >= 1 else "low risk"
    print(p["age"], p["glucose"], "->", risk)
`,
    output: `45 120 -> low risk
62 180 -> high risk
33 95 -> low risk`
  },
];

export const COURSES = ['All programs', 'Deep Learning Lab'];
