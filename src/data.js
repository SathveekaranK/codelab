/* Programs from the updated Deep Learning Lab manual (U23AL511).
   Each experiment has a full step-by-step algorithm and a complete
   numpy implementation; the output is the recorded result. */

export const EXPERIMENTS = [
  {
    id: 1,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: "AI, ML and Deep Learning",
    tag: "Same XOR task solved by rules, ML and DL",
    file: "ai_vs_ml_dl.py",
    aim: "Study and compare the concepts of Artificial Intelligence, Machine Learning and Deep Learning with suitable real-world examples.",
    algorithm: [
      "Create the XOR dataset: four input pairs, each labelled 0 or 1.",
      "Implement the AI solution as an explicit human-written rule (x1 != x2).",
      "Implement the ML solution as logistic regression trained with gradient descent.",
      "Show that one linear boundary cannot separate XOR, so ML accuracy stays at 50%.",
      "Implement the DL solution as a 2-4-1 network with sigmoid activations.",
      "Train the network using forward propagation, backpropagation and gradient descent.",
      "Evaluate all three methods on the same data and print the comparison.",
      "Explain why learned hidden features make DL stronger for non-linear problems.",
    ],
    code: `import numpy as np

# Same XOR task solved by AI, ML and DL.
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([[0], [1], [1], [0]], dtype=float)


def accuracy(prediction, target):
    return float(np.mean(prediction == target)) * 100


def sigmoid(z):
    return 1 / (1 + np.exp(-z))


# 1. AI: explicit human-written rules.
ai_pred = np.array([[1 if x1 != x2 else 0] for x1, x2 in X], dtype=float)

# 2. ML: logistic regression, which can only learn a linear boundary.
rng = np.random.default_rng(1)
w = rng.normal(0, 0.1, (2, 1))
b = 0.0
for _ in range(2000):
    p = sigmoid(X @ w + b)
    w -= 0.5 * (X.T @ (p - y)) / len(X)
    b -= 0.5 * np.mean(p - y)
ml_pred = (sigmoid(X @ w + b) > 0.5).astype(float)

# 3. DL: a 2-4-1 network trained with backpropagation.
rng = np.random.default_rng(3)
W1 = rng.normal(0, 0.5, (2, 4))
b1 = np.zeros((1, 4))
W2 = rng.normal(0, 0.5, (4, 1))
b2 = np.zeros((1, 1))

for _ in range(6000):
    h = sigmoid(X @ W1 + b1)
    p = sigmoid(h @ W2 + b2)
    d2 = (p - y) / len(X)
    dW2 = h.T @ d2
    db2 = d2.sum(axis=0, keepdims=True)
    d1 = (d2 @ W2.T) * h * (1 - h)
    dW1 = X.T @ d1
    db1 = d1.sum(axis=0, keepdims=True)
    W1 -= 0.5 * dW1
    b1 -= 0.5 * db1
    W2 -= 0.5 * dW2
    b2 -= 0.5 * db2

dl_pred = (sigmoid(sigmoid(X @ W1 + b1) @ W2 + b2) > 0.5).astype(float)

print("Same XOR task solved in three ways")
print("----------------------------------")
print(f"{'Paradigm':10} {'Method':40} {'Accuracy':>8}")
print(f"{'AI':10} {'Hand-coded rule: x1 != x2':40} {accuracy(ai_pred, y):7.1f}%")
print(f"{'ML':10} {'Logistic regression (linear model)':40} {accuracy(ml_pred, y):7.1f}%")
print(f"{'DL':10} {'2-4-1 neural network + backprop':40} {accuracy(dl_pred, y):7.1f}%")
print()
print("Observation:")
print("- AI encodes human knowledge directly and needs no training data.")
print("- ML learns from data, but one linear boundary cannot separate XOR.")
print("- DL learns hidden features and therefore solves XOR correctly.")`,
    output: `Same XOR task solved in three ways
----------------------------------
Paradigm   Method                                   Accuracy
AI         Hand-coded rule: x1 != x2                  100.0%
ML         Logistic regression (linear model)          50.0%
DL         2-4-1 neural network + backprop            100.0%

Observation:
- AI encodes human knowledge directly and needs no training data.
- ML learns from data, but one linear boundary cannot separate XOR.
- DL learns hidden features and therefore solves XOR correctly.`
  },
  {
    id: 2,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: "Deep Learning Applications",
    tag: "Domain report with model selection and ranking",
    file: "dl_applications.py",
    aim: "Explore and present various real-world applications of Deep Learning in different domains.",
    algorithm: [
      "List the major domains where Deep Learning is used.",
      "For each domain, record the task, input data, suitable model and output.",
      "Explain why a DL model is suitable for that type of data.",
      "Print the application report in a readable form.",
      "Define a rule that recommends an architecture from the input type.",
      "Test the rule on image, sequence, text and tabular scenarios.",
      "Score each domain on adoption, data availability and impact.",
      "Rank the domains by their average score and print the result.",
    ],
    code: `import numpy as np

applications = [
    ("Healthcare", "Tumour detection in MRI", "2D/3D images",
     "CNN", "Learns edges, texture and tumour shape",
     "Normal or suspicious scan"),
    ("Agriculture", "Crop disease detection", "Leaf images",
     "CNN", "Recognises colour and spot patterns",
     "Healthy or diseased leaf"),
    ("Education", "Automatic essay scoring", "Text",
     "Transformer", "Captures grammar and meaning",
     "Score and feedback"),
    ("Finance", "Fraud transaction detection", "Transaction sequences",
     "RNN / LSTM", "Learns unusual sequences over time",
     "Fraud or genuine"),
    ("Autonomous vehicles", "Lane and pedestrian detection", "Camera images",
     "CNN + Transformer", "Detects objects in real time",
     "Steer, brake or continue"),
]

print("Real-world Deep Learning applications")
print("=" * 78)
for domain, task, data, model, why, output in applications:
    print(f"Domain     : {domain}")
    print(f"Task       : {task}")
    print(f"Input data : {data}")
    print(f"Model      : {model}")
    print(f"Why DL     : {why}")
    print(f"Output     : {output}")
    print("-" * 78)

print()
print("Choosing a model from the input type")
print("------------------------------------")
scenarios = [
    ("image", "classify a medical scan"),
    ("sequence", "forecast hourly energy demand"),
    ("text", "summarise a news article"),
    ("tabular", "predict loan default"),
]
for data_type, task in scenarios:
    if data_type == "image":
        model = "CNN or Vision Transformer"
    elif data_type in ("sequence", "text"):
        model = "RNN / LSTM or Transformer"
    else:
        model = "MLP or TabNet"
    print(f"{data_type:9} -> {model:30} ({task})")

print()
print("Domain maturity ranking")
print("-----------------------")
scores = np.array([
    [9, 8, 9],
    [7, 7, 8],
    [6, 8, 7],
    [8, 9, 8],
    [7, 6, 7],
], dtype=float)
rank = scores.mean(axis=1)
for i in np.argsort(-rank):
    print(f"{applications[i][0]:22} score = {rank[i]:.2f}")`,
    output: `Real-world Deep Learning applications
==============================================================================
Domain     : Healthcare
Task       : Tumour detection in MRI
Input data : 2D/3D images
Model      : CNN
Why DL     : Learns edges, texture and tumour shape
Output     : Normal or suspicious scan
------------------------------------------------------------------------------
Domain     : Agriculture
Task       : Crop disease detection
Input data : Leaf images
Model      : CNN
Why DL     : Recognises colour and spot patterns
Output     : Healthy or diseased leaf
------------------------------------------------------------------------------
Domain     : Education
Task       : Automatic essay scoring
Input data : Text
Model      : Transformer
Why DL     : Captures grammar and meaning
Output     : Score and feedback
------------------------------------------------------------------------------
Domain     : Finance
Task       : Fraud transaction detection
Input data : Transaction sequences
Model      : RNN / LSTM
Why DL     : Learns unusual sequences over time
Output     : Fraud or genuine
------------------------------------------------------------------------------
Domain     : Autonomous vehicles
Task       : Lane and pedestrian detection
Input data : Camera images
Model      : CNN + Transformer
Why DL     : Detects objects in real time
Output     : Steer, brake or continue
------------------------------------------------------------------------------

Choosing a model from the input type
------------------------------------
image     -> CNN or Vision Transformer      (classify a medical scan)
sequence  -> RNN / LSTM or Transformer      (forecast hourly energy demand)
text      -> RNN / LSTM or Transformer      (summarise a news article)
tabular   -> MLP or TabNet                  (predict loan default)

Domain maturity ranking
-----------------------
Healthcare             score = 8.67
Finance                score = 8.33
Agriculture            score = 7.33
Education              score = 7.00
Autonomous vehicles    score = 6.67`
  },
  {
    id: 3,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: "Artificial Neuron",
    tag: "Weighted sum, activation and perceptron learning",
    file: "artificial_neuron.py",
    aim: "Design and explain the structure and working of an artificial neuron.",
    algorithm: [
      "Define the AND gate truth table as inputs X and targets y.",
      "Initialise the weights with small random values and set the bias to zero.",
      "For each sample, compute the weighted sum z = w1*x1 + w2*x2 + b.",
      "Convert z into a prediction using the step function.",
      "Compute the error as target minus prediction.",
      "Update each weight and the bias with the perceptron learning rule.",
      "Repeat the epochs until the number of errors becomes zero.",
      "Apply the sigmoid function to the final weighted sum to show the activation.",
      "Print the truth table and verify 100% accuracy.",
    ],
    code: `import numpy as np


def sigmoid(z):
    return 1 / (1 + np.exp(-z))


X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([0, 0, 0, 1], dtype=float)

rng = np.random.default_rng(4)
w = rng.normal(0, 0.1, 2)
b = 0.0
lr = 0.05

print("Training one artificial neuron on the AND gate")
print("Epoch  Weight-1  Weight-2    Bias   Errors")
for epoch in range(1, 21):
    errors = 0
    for xi, target in zip(X, y):
        z = float(xi @ w + b)
        pred = 1.0 if z >= 0 else 0.0
        error = target - pred
        w += lr * error * xi
        b += lr * error
        errors += int(error != 0)
    if epoch in (1, 2, 5, 10, 20):
        print(f"{epoch:5d} {w[0]:9.3f} {w[1]:9.3f} {b:7.3f} {errors:8d}")

print()
print("Final neuron parameters")
print("Weight 1 =", round(float(w[0]), 3))
print("Weight 2 =", round(float(w[1]), 3))
print("Bias     =", round(float(b), 3))
print()
x = np.array([1.0, 1.0])
z = float(x @ w + b)
a = float(sigmoid(z))
print("Step-by-step working for input [1, 1]")
print("Weighted sum z = w1*x1 + w2*x2 + b =", round(z, 3))
print("Activation a   = sigmoid(z)        =", round(a, 3))
print()
print("Truth table")
print("x1  x2      z   sigmoid  prediction  target")
correct = 0
for xi, target in zip(X, y):
    z = float(xi @ w + b)
    a = float(sigmoid(z))
    pred = int(z >= 0)
    correct += int(pred == target)
    print(f"{int(xi[0])}   {int(xi[1])}  {z:6.3f}  {a:7.3f}  {pred:10d}  {int(target):6d}")
print()
print(f"Accuracy = {correct / len(X) * 100:.1f}%")`,
    output: `Training one artificial neuron on the AND gate
Epoch  Weight-1  Weight-2    Bias   Errors
    1    -0.015     0.033   0.000        2
    2     0.035     0.083   0.000        2
    5     0.085     0.033  -0.100        0
   10     0.085     0.033  -0.100        0
   20     0.085     0.033  -0.100        0

Final neuron parameters
Weight 1 = 0.085
Weight 2 = 0.033
Bias     = -0.1

Step-by-step working for input [1, 1]
Weighted sum z = w1*x1 + w2*x2 + b = 0.017
Activation a   = sigmoid(z)        = 0.504

Truth table
x1  x2      z   sigmoid  prediction  target
0   0  -0.100    0.475           0       0
0   1  -0.067    0.483           0       0
1   0  -0.015    0.496           0       0
1   1   0.017    0.504           1       1

Accuracy = 100.0%`
  },
  {
    id: 4,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: "Simple Artificial Neural Network",
    tag: "Layer sizes, parameters and forward propagation",
    file: "simple_ann.py",
    aim: "Construct a simple Artificial Neural Network (ANN) and identify its input, hidden and output layers.",
    algorithm: [
      "Define a 3-input sample and identify the input layer.",
      "Choose 4 neurons for the hidden layer with ReLU activation.",
      "Choose 2 output neurons with softmax activation.",
      "Initialise the two weight matrices and bias vectors.",
      "Compute the hidden pre-activation as X @ W1 + b1.",
      "Apply ReLU to obtain the hidden activations.",
      "Compute the output logits as hidden @ W2 + b2.",
      "Apply softmax to convert the logits into class probabilities.",
      "Print layer sizes, parameter counts and the forward pass for each sample.",
    ],
    code: `import numpy as np


def relu(z):
    return np.maximum(0, z)


def softmax(z):
    e = np.exp(z - z.max(axis=1, keepdims=True))
    return e / e.sum(axis=1, keepdims=True)


X = np.array([[0.5, 0.2, 0.9], [0.1, 0.8, 0.4]], dtype=float)
rng = np.random.default_rng(55)
W1 = rng.normal(0, 0.5, (3, 4))
b1 = np.zeros((1, 4))
W2 = rng.normal(0, 0.5, (4, 2))
b2 = np.zeros((1, 2))

print("ANN architecture")
print("Layer   Neurons  Activation  Parameters")
print("Input         3        -             0")
print("Hidden        4      ReLU            16")
print("Output        2   Softmax            10")
print("Total trainable parameters: 26")
print()
print("Forward propagation")
print("--------------------")
for i, sample in enumerate(X, start=1):
    hidden_raw = sample @ W1 + b1
    hidden = relu(hidden_raw)
    output_raw = hidden @ W2 + b2
    probs = softmax(output_raw)
    predicted = int(np.argmax(probs))
    print(f"Sample {i}: {sample}")
    print("  Input layer      :", sample)
    print("  Hidden pre-act.  :", np.round(hidden_raw, 3))
    print("  Hidden (ReLU)    :", np.round(hidden, 3))
    print("  Output logits    :", np.round(output_raw, 3))
    print("  Output softmax   :", np.round(probs, 3))
    print("  Predicted class  :", predicted)
    print()
print("Each arrow is a matrix multiplication followed by an activation.")
print("The input layer receives features; hidden layers learn new features;")
print("the output layer converts those features into class probabilities.")`,
    output: `ANN architecture
Layer   Neurons  Activation  Parameters
Input         3        -             0
Hidden        4      ReLU            16
Output        2   Softmax            10
Total trainable parameters: 26

Forward propagation
--------------------
Sample 1: [0.5 0.2 0.9]
  Input layer      : [0.5 0.2 0.9]
  Hidden pre-act.  : [[0.451 0.116 0.275 0.979]]
  Hidden (ReLU)    : [[0.451 0.116 0.275 0.979]]
  Output logits    : [[-0.484  0.382]]
  Output softmax   : [[0.296 0.704]]
  Predicted class  : 1

Sample 2: [0.1 0.8 0.4]
  Input layer      : [0.1 0.8 0.4]
  Hidden pre-act.  : [[-0.293  0.252  0.674 -0.069]]
  Hidden (ReLU)    : [[0.    0.252 0.674 0.   ]]
  Output logits    : [[ 0.433 -0.167]]
  Output softmax   : [[0.646 0.354]]
  Predicted class  : 0

Each arrow is a matrix multiplication followed by an activation.
The input layer receives features; hidden layers learn new features;
the output layer converts those features into class probabilities.`
  },
  {
    id: 5,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: "Data Pre-processing",
    tag: "Missing values, one-hot encoding and scaling",
    file: "preprocessing.py",
    aim: "Perform basic data pre-processing on a given dataset by identifying features, labels and handling missing values.",
    algorithm: [
      "Load the raw dataset with age, marks, city and the pass/fail label.",
      "Count the missing values in every feature column.",
      "Replace missing age and marks with their column means.",
      "Encode the city column as one-hot vectors.",
      "Separate the feature matrix X from the label vector y.",
      "Standardise the numeric features using mean and standard deviation.",
      "Concatenate the scaled numeric features with the one-hot city columns.",
      "Print the final feature matrix and its shape.",
      "Explain why missing values and different scales must be handled before training.",
    ],
    code: `import numpy as np

np.set_printoptions(precision=2, suppress=True)

# Columns: age, marks, city (0 = urban, 1 = semi-urban, 2 = rural).
X_raw = np.array([
    [22, 80, 0],
    [np.nan, 90, 2],
    [26, np.nan, 0],
    [24, 60, 1],
    [np.nan, 45, 2],
    [30, 75, 1],
    [28, np.nan, 0],
    [35, 88, 2],
], dtype=float)
y = np.array([1, 1, 1, 0, 0, 1, 0, 1])

print("Raw feature matrix")
print(X_raw)
print()
print("Missing values per column")
print("age   :", int(np.isnan(X_raw[:, 0]).sum()))
print("marks :", int(np.isnan(X_raw[:, 1]).sum()))
print("city  :", int(np.isnan(X_raw[:, 2]).sum()))
print()

for col, name in ((0, "age"), (1, "marks")):
    mean = np.nanmean(X_raw[:, col])
    X_raw[np.isnan(X_raw[:, col]), col] = mean
    print(f"Filled missing {name} with column mean {mean:.2f}")

city = X_raw[:, 2].astype(int)
one_hot = np.eye(3)[city]
numeric = X_raw[:, :2]
mean = numeric.mean(axis=0)
std = numeric.std(axis=0)
scaled = (numeric - mean) / std
X = np.hstack([scaled, one_hot])

print()
print("Scaled numeric features (age, marks)")
print(scaled)
print()
print("One-hot encoded city")
print(one_hot)
print()
print("Final features (age, marks, city one-hot)")
print(X)
print("Feature shape:", X.shape)
print("Labels       :", y)
print()
print("Features are the inputs; labels are the answers to predict.")
print("Missing values and different scales would otherwise mislead the model.")`,
    output: `Raw feature matrix
[[22. 80.  0.]
 [nan 90.  2.]
 [26. nan  0.]
 [24. 60.  1.]
 [nan 45.  2.]
 [30. 75.  1.]
 [28. nan  0.]
 [35. 88.  2.]]

Missing values per column
age   : 2
marks : 2
city  : 0

Filled missing age with column mean 27.50
Filled missing marks with column mean 73.00

Scaled numeric features (age, marks)
[[-1.5   0.51]
 [ 0.    1.23]
 [-0.41  0.  ]
 [-0.95 -0.94]
 [ 0.   -2.03]
 [ 0.68  0.15]
 [ 0.14  0.  ]
 [ 2.05  1.09]]

One-hot encoded city
[[1. 0. 0.]
 [0. 0. 1.]
 [1. 0. 0.]
 [0. 1. 0.]
 [0. 0. 1.]
 [0. 1. 0.]
 [1. 0. 0.]
 [0. 0. 1.]]

Final features (age, marks, city one-hot)
[[-1.5   0.51  1.    0.    0.  ]
 [ 0.    1.23  0.    0.    1.  ]
 [-0.41  0.    1.    0.    0.  ]
 [-0.95 -0.94  0.    1.    0.  ]
 [ 0.   -2.03  0.    0.    1.  ]
 [ 0.68  0.15  0.    1.    0.  ]
 [ 0.14  0.    1.    0.    0.  ]
 [ 2.05  1.09  0.    0.    1.  ]]
Feature shape: (8, 5)
Labels       : [1 1 1 0 0 1 0 1]

Features are the inputs; labels are the answers to predict.
Missing values and different scales would otherwise mislead the model.`
  },
  {
    id: 6,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: "Train, Validation and Test Split",
    tag: "60/20/20 split without data leakage",
    file: "train_test_split.py",
    aim: "Split a given dataset into training and testing datasets and explain their significance in Deep Learning.",
    algorithm: [
      "Generate a dataset with three features and a binary label.",
      "Shuffle the samples so that classes are not grouped together.",
      "Split the data into 60% training, 20% validation and 20% test.",
      "Compute the mean and standard deviation from the training set only.",
      "Apply the same scaling to validation and test data to avoid data leakage.",
      "Check the class balance in each split.",
      "Print the split sizes, scaling statistics and sample rows.",
      "Explain the role of training, validation and test data.",
    ],
    code: `import numpy as np

np.set_printoptions(precision=2, suppress=True)

rng = np.random.default_rng(42)
n = 20
X = rng.normal(size=(n, 3))
y = (X[:, 0] + 0.5 * X[:, 1] > 0).astype(int)

order = rng.permutation(n)
X, y = X[order], y[order]

n_train = int(0.60 * n)
n_val = int(0.20 * n)
X_train, y_train = X[:n_train], y[:n_train]
X_val, y_val = X[n_train:n_train + n_val], y[n_train:n_train + n_val]
X_test, y_test = X[n_train + n_val:], y[n_train + n_val:]

mean = X_train.mean(axis=0)
std = X_train.std(axis=0)
X_train = (X_train - mean) / std
X_val = (X_val - mean) / std
X_test = (X_test - mean) / std

print("Dataset size :", n)
print("Training set :", len(X_train), "samples (60%)")
print("Validation   :", len(X_val), "samples (20%)")
print("Test set     :", len(X_test), "samples (20%)")
print()
print("Class balance")
for name, labels in (("train", y_train), ("validation", y_val), ("test", y_test)):
    print(f"{name:11}: class 0 = {int((labels == 0).sum())}, class 1 = {int((labels == 1).sum())}")
print()
print("Scaling statistics learned from the training set only")
print("mean =", np.round(mean, 3))
print("std  =", np.round(std, 3))
print()
print("First two training rows after scaling")
print(np.round(X_train[:2], 3))
print("First two test rows after scaling")
print(np.round(X_test[:2], 3))
print()
print("Why the split matters")
print("- Training data updates the weights.")
print("- Validation data tunes hyperparameters and detects overfitting.")
print("- Test data is used once for an unbiased final score.")`,
    output: `Dataset size : 20
Training set : 12 samples (60%)
Validation   : 4 samples (20%)
Test set     : 4 samples (20%)

Class balance
train      : class 0 = 7, class 1 = 5
validation : class 0 = 2, class 1 = 2
test       : class 0 = 3, class 1 = 1

Scaling statistics learned from the training set only
mean = [ 0.13 -0.12 -0.04]
std  = [0.55 0.82 0.63]

First two training rows after scaling
[[-1.45  0.43  0.25]
 [ 0.33 -1.12  1.26]]
First two test rows after scaling
[[ 0.92 -1.63 -0.45]
 [-1.47  1.64 -0.18]]

Why the split matters
- Training data updates the weights.
- Validation data tunes hyperparameters and detects overfitting.
- Test data is used once for an unbiased final score.`
  },
  {
    id: 7,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: "Simple DL Prediction Model",
    tag: "2-8-1 network trained with backpropagation",
    file: "predictor.py",
    aim: "Develop a simple Deep Learning model for prediction or classification using a sample dataset.",
    algorithm: [
      "Generate a non-linear two-class dataset using two concentric circles.",
      "Shuffle the samples and standardise the input features.",
      "Split the data into 80% training and 20% testing.",
      "Define a 2-8-1 network with eight ReLU hidden neurons and one sigmoid output.",
      "Initialise the weights using He initialisation and set the biases to zero.",
      "Perform forward propagation to obtain the predicted probability.",
      "Compute the binary cross-entropy loss.",
      "Backpropagate the error and update all weights and biases with gradient descent.",
      "Repeat for 2000 epochs and print the loss at regular intervals.",
      "Evaluate the trained model on the test set and print sample predictions.",
    ],
    code: `import numpy as np


def sigmoid(z):
    return 1 / (1 + np.exp(-z))


def relu(z):
    return np.maximum(0, z)


# Two concentric circles: a non-linear classification problem.
rng = np.random.default_rng(0)
n = 100
theta = rng.uniform(0, 2 * np.pi, n)
inner = np.c_[0.5 * np.cos(theta), 0.5 * np.sin(theta)] + rng.normal(0, 0.08, (n, 2))
outer = np.c_[1.2 * np.cos(theta), 1.2 * np.sin(theta)] + rng.normal(0, 0.08, (n, 2))
X = np.vstack([inner, outer])
y = np.r_[np.zeros(n), np.ones(n)].reshape(-1, 1)

shuffle = rng.permutation(2 * n)
X, y = X[shuffle], y[shuffle]
mean = X.mean(axis=0)
std = X.std(axis=0)
X = (X - mean) / std

split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# 2 input -> 8 hidden (ReLU) -> 1 output (sigmoid).
rng = np.random.default_rng(5)
W1 = rng.normal(0, np.sqrt(2 / 2), (2, 8))
b1 = np.zeros((1, 8))
W2 = rng.normal(0, np.sqrt(2 / 8), (8, 1))
b2 = np.zeros((1, 1))
lr = 0.1

print("Training a 2-8-1 neural network")
print("Epoch   Loss")
for epoch in range(2001):
    hidden = relu(X_train @ W1 + b1)
    prob = sigmoid(hidden @ W2 + b2)
    loss = -np.mean(y_train * np.log(prob + 1e-9) + (1 - y_train) * np.log(1 - prob + 1e-9))

    d2 = (prob - y_train) / len(X_train)
    dW2 = hidden.T @ d2
    db2 = d2.sum(axis=0, keepdims=True)
    d1 = (d2 @ W2.T) * (hidden > 0)
    dW1 = X_train.T @ d1
    db1 = d1.sum(axis=0, keepdims=True)

    W1 -= lr * dW1
    b1 -= lr * db1
    W2 -= lr * dW2
    b2 -= lr * db2

    if epoch % 400 == 0:
        print(f"{epoch:5d}  {loss:.4f}")

test_prob = sigmoid(relu(X_test @ W1 + b1) @ W2 + b2)
test_pred = (test_prob > 0.5).astype(int)
accuracy = float(np.mean(test_pred == y_test)) * 100

print()
print(f"Test accuracy: {accuracy:.1f}%")
print()
print("Sample predictions")
print("Point  Probability  Predicted  Actual")
for i in range(5):
    print(f"{i + 1:5d} {test_prob[i, 0]:12.3f} {int(test_pred[i, 0]):10d} {int(y_test[i, 0]):7d}")`,
    output: `Training a 2-8-1 neural network
Epoch   Loss
    0  1.0388
  400  0.1379
  800  0.0437
 1200  0.0235
 1600  0.0156
 2000  0.0115

Test accuracy: 100.0%

Sample predictions
Point  Probability  Predicted  Actual
    1        0.003          0       0
    2        0.006          0       0
    3        0.997          1       1
    4        0.992          1       1
    5        0.001          0       0`
  },
  {
    id: 8,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: "Model Evaluation",
    tag: "Confusion matrix, precision, recall, F1 and AUC",
    file: "evaluate.py",
    aim: "Evaluate the performance of a Deep Learning model using appropriate evaluation metrics such as accuracy and confusion matrix.",
    algorithm: [
      "Generate a binary dataset with an imbalanced class distribution.",
      "Shuffle the data and scale the features using training statistics.",
      "Train a logistic regression classifier with gradient descent.",
      "Convert predicted probabilities into class labels using a 0.5 threshold.",
      "Count true positives, true negatives, false positives and false negatives.",
      "Build the confusion matrix from those counts.",
      "Compute accuracy, precision, recall, specificity and F1-score.",
      "Sort the scores and compute the ROC curve and AUC.",
      "Print the metrics and explain why accuracy alone can be misleading.",
    ],
    code: `import numpy as np


def sigmoid(z):
    return 1 / (1 + np.exp(-z))


rng = np.random.default_rng(11)
class_0 = rng.normal([2, 2], 1.0, (140, 2))
class_1 = rng.normal([4, 4], 1.0, (60, 2))
X = np.vstack([class_0, class_1])
y = np.r_[np.zeros(140), np.ones(60)]

order = rng.permutation(len(X))
X, y = X[order], y[order]
mean = X[:160].mean(axis=0)
std = X[:160].std(axis=0)
X = (X - mean) / std

X_train, y_train = X[:160], y[:160]
X_test, y_test = X[160:], y[160:]

w = np.zeros((2, 1))
b = 0.0
for _ in range(3000):
    p = sigmoid(X_train @ w + b).ravel()
    w -= 0.1 * (X_train.T @ (p - y_train)).reshape(2, 1) / len(X_train)
    b -= 0.1 * np.mean(p - y_train)

scores = sigmoid(X_test @ w + b).ravel()
pred = (scores >= 0.5).astype(int)

tp = int(np.sum((pred == 1) & (y_test == 1)))
tn = int(np.sum((pred == 0) & (y_test == 0)))
fp = int(np.sum((pred == 1) & (y_test == 0)))
fn = int(np.sum((pred == 0) & (y_test == 1)))

accuracy = (tp + tn) / len(y_test)
precision = tp / (tp + fp) if tp + fp else 0.0
recall = tp / (tp + fn) if tp + fn else 0.0
specificity = tn / (tn + fp) if tn + fp else 0.0
f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0

order = np.argsort(-scores)
sorted_y = y_test[order]
tpr = np.r_[0, np.cumsum(sorted_y) / np.sum(sorted_y), 1]
fpr = np.r_[0, np.cumsum(1 - sorted_y) / np.sum(1 - sorted_y), 1]
auc = np.sum((fpr[1:] - fpr[:-1]) * (tpr[1:] + tpr[:-1]) / 2)

print("Confusion matrix")
print("                   Predicted 0  Predicted 1")
print(f"Actual 0 (negative) {tn:11d} {fp:12d}")
print(f"Actual 1 (positive) {fn:11d} {tp:12d}")
print()
print("Metrics")
print(f"Accuracy    : {accuracy * 100:.2f}%")
print(f"Precision   : {precision:.3f}")
print(f"Recall      : {recall:.3f}")
print(f"Specificity : {specificity:.3f}")
print(f"F1-score    : {f1:.3f}")
print(f"ROC AUC     : {auc:.3f}")
print()
print("Accuracy alone can hide errors when classes are imbalanced;")
print("precision, recall and the confusion matrix show the full picture.")`,
    output: `Confusion matrix
                   Predicted 0  Predicted 1
Actual 0 (negative)          28            1
Actual 1 (positive)           1           10

Metrics
Accuracy    : 95.00%
Precision   : 0.909
Recall      : 0.909
Specificity : 0.966
F1-score    : 0.909
ROC AUC     : 0.997

Accuracy alone can hide errors when classes are imbalanced;
precision, recall and the confusion matrix show the full picture.`
  },
  {
    id: 9,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: "Generative and Responsible AI",
    tag: "Text generation plus a fairness audit",
    file: "responsible_ai.py",
    aim: "Study the concepts of Generative AI, responsible AI and ethical issues in Deep Learning with suitable examples.",
    algorithm: [
      "Prepare a small text corpus and split it into word tokens.",
      "Build a trigram table that counts each word given the previous two words.",
      "Add smoothing so that unseen word sequences remain possible.",
      "Normalise each row into a probability distribution.",
      "Generate new text by sampling the next word from the learned distribution.",
      "Repeat until the requested number of words is produced.",
      "Define two groups and compute their selection rates in a hiring example.",
      "Compute the disparate impact ratio and flag possible bias below 0.80.",
      "Print the responsible AI checklist and explain each principle.",
    ],
    code: `import numpy as np

text = (
    "deep learning learns patterns from data . "
    "deep models learn features from data . "
    "responsible ai protects people and builds trust . "
    "generative models create new samples from learned patterns . "
)
tokens = text.split()
vocab = sorted(set(tokens))
index = {word: i for i, word in enumerate(vocab)}
size = len(vocab)

trigram = np.ones((size, size, size)) * 0.01
for first, second, third in zip(tokens[:-2], tokens[1:-1], tokens[2:]):
    trigram[index[first], index[second], index[third]] += 1

rng = np.random.default_rng(2)
first, second = index["deep"], index["learning"]
generated = ["deep", "learning"]
for _ in range(14):
    probabilities = trigram[first, second] / trigram[first, second].sum()
    third = int(rng.choice(size, p=probabilities))
    generated.append(vocab[third])
    first, second = second, third

print("Part A - Generative AI (word-level language model)")
print("Generated text sample:")
print(" ".join(generated))
print()

print("Part B - Fairness audit of a hiring model")
groups = {"Group A": (48, 100), "Group B": (30, 100)}
rates = {}
for group, (selected, total) in groups.items():
    rates[group] = selected / total
    print(f"{group}: {selected}/{total} selected = {rates[group] * 100:.0f}%")

impact = min(rates.values()) / max(rates.values())
print(f"Disparate impact ratio = {impact:.3f}")
if impact < 0.8:
    print("Result: possible bias, because the ratio is below 0.80.")
else:
    print("Result: selection rates are within the accepted range.")

print()
print("Part C - Responsible AI checklist")
checklist = [
    "Fairness       - test outcomes across groups",
    "Privacy        - minimise and protect personal data",
    "Transparency   - explain how decisions are made",
    "Safety         - validate before real-world release",
    "Accountability - keep a human owner for the system",
]
for item in checklist:
    print("-", item)`,
    output: `Part A - Generative AI (word-level language model)
Generated text sample:
deep learning learns patterns from data . responsible ai deep deep models learn features from data

Part B - Fairness audit of a hiring model
Group A: 48/100 selected = 48%
Group B: 30/100 selected = 30%
Disparate impact ratio = 0.625
Result: possible bias, because the ratio is below 0.80.

Part C - Responsible AI checklist
- Fairness       - test outcomes across groups
- Privacy        - minimise and protect personal data
- Transparency   - explain how decisions are made
- Safety         - validate before real-world release
- Accountability - keep a human owner for the system`
  },
  {
    id: 10,
    lang: 'python',
    course: 'Deep Learning Lab',
    title: "Mini Case Study — Healthcare",
    tag: "Diabetes risk prediction with an ANN",
    file: "case_study.py",
    aim: "Develop a mini case study demonstrating the application of Deep Learning in any one domain such as Healthcare, Agriculture, Education, Finance or Autonomous Vehicles.",
    algorithm: [
      "Collect a small patient dataset with age, glucose, BMI, blood pressure and risk label.",
      "Shuffle the records and separate the four features from the label.",
      "Split the data into training and test sets.",
      "Standardise the features using training-set mean and standard deviation.",
      "Define a 4-6-1 network with ReLU hidden units and a sigmoid output.",
      "Train the network with binary cross-entropy and backpropagation.",
      "Print the loss at regular epochs to show convergence.",
      "Evaluate the model on the test patients and report accuracy.",
      "Predict the risk for three new patients and convert each probability into a decision.",
      "State that the model is for teaching only and not a medical device.",
    ],
    code: `import numpy as np

np.set_printoptions(precision=2, suppress=True)

# age, glucose, BMI, blood pressure, high-risk label
data = np.array([
    [25, 88, 22.0, 70, 0],
    [30, 95, 24.5, 72, 0],
    [34, 105, 26.0, 75, 0],
    [38, 110, 27.5, 78, 0],
    [41, 118, 29.0, 80, 0],
    [45, 125, 30.5, 82, 0],
    [48, 140, 32.0, 85, 1],
    [52, 150, 34.0, 88, 1],
    [55, 160, 35.5, 90, 1],
    [58, 170, 37.0, 92, 1],
    [61, 180, 38.5, 95, 1],
    [64, 190, 40.0, 98, 1],
], dtype=float)

rng = np.random.default_rng(2)
order = rng.permutation(len(data))
data = data[order]
X = data[:, :4]
y = data[:, 4].reshape(-1, 1)

mean = X[:8].mean(axis=0)
std = X[:8].std(axis=0)
X = (X - mean) / std
X_train, y_train = X[:8], y[:8]
X_test, y_test = X[8:], y[8:]


def sigmoid(z):
    return 1 / (1 + np.exp(-z))


def relu(z):
    return np.maximum(0, z)


rng = np.random.default_rng(6)
W1 = rng.normal(0, np.sqrt(2 / 4), (4, 6))
b1 = np.zeros((1, 6))
W2 = rng.normal(0, np.sqrt(2 / 6), (6, 1))
b2 = np.zeros((1, 1))
lr = 0.05

print("Healthcare case study: diabetes risk prediction")
print("Training a 4-6-1 neural network")
print("Epoch   Loss")
for epoch in range(3001):
    hidden = relu(X_train @ W1 + b1)
    prob = sigmoid(hidden @ W2 + b2)
    loss = -np.mean(y_train * np.log(prob + 1e-9) + (1 - y_train) * np.log(1 - prob + 1e-9))

    d2 = (prob - y_train) / len(X_train)
    dW2 = hidden.T @ d2
    db2 = d2.sum(axis=0, keepdims=True)
    d1 = (d2 @ W2.T) * (hidden > 0)
    dW1 = X_train.T @ d1
    db1 = d1.sum(axis=0, keepdims=True)

    W1 -= lr * dW1
    b1 -= lr * db1
    W2 -= lr * dW2
    b2 -= lr * db2

    if epoch % 600 == 0:
        print(f"{epoch:5d}  {loss:.4f}")

test_prob = sigmoid(relu(X_test @ W1 + b1) @ W2 + b2).ravel()
test_pred = (test_prob >= 0.5).astype(int)
accuracy = float(np.mean(test_pred == y_test.ravel())) * 100

print()
print(f"Test accuracy: {accuracy:.1f}%")
print("Test patients")
print("Patient  Risk score  Predicted  Actual")
for i in range(len(y_test)):
    print(f"{i + 1:7d} {test_prob[i]:11.3f} {int(test_pred[i]):10d} {int(y_test[i, 0]):7d}")

new_patients = np.array([
    [50, 145, 33.0, 86],
    [35, 100, 25.0, 74],
    [60, 175, 38.0, 94],
], dtype=float)
new_scaled = (new_patients - mean) / std
new_prob = sigmoid(relu(new_scaled @ W1 + b1) @ W2 + b2).ravel()

print()
print("Risk for new patients")
print("Age  Glucose   BMI   BP    Risk   Decision")
for row, risk in zip(new_patients, new_prob):
    decision = "high risk" if risk >= 0.5 else "low risk"
    print(f"{int(row[0]):3d} {int(row[1]):8d} {row[2]:5.1f} {int(row[3]):4d} {risk:6.3f}   {decision}")
print()
print("This is a teaching model, not a medical device.")`,
    output: `Healthcare case study: diabetes risk prediction
Training a 4-6-1 neural network
Epoch   Loss
    0  1.7213
  600  0.0311
 1200  0.0137
 1800  0.0079
 2400  0.0054
 3000  0.0039

Test accuracy: 100.0%
Test patients
Patient  Risk score  Predicted  Actual
      1       0.000          0       0
      2       0.000          0       0
      3       1.000          1       1
      4       0.000          0       0

Risk for new patients
Age  Glucose   BMI   BP    Risk   Decision
 50      145  33.0   86  0.999   high risk
 35      100  25.0   74  0.000   low risk
 60      175  38.0   94  1.000   high risk

This is a teaching model, not a medical device.`
  },
];

export const COURSES = ['All programs', 'Deep Learning Lab'];
