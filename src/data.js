/* Programs from the updated Deep Learning Lab manual (U23AL511).
   Each experiment has a full step-by-step algorithm and a complete
   Keras implementation; the output is the recorded result. */

export const EXPERIMENTS = [
  {
    id: 1,
    lang: "python",
    course: "Deep Learning Lab",
    title: "AI, ML and Deep Learning",
    tag: "Same XOR task solved by rules, ML and DL",
    file: "ai_vs_ml_dl.py",
    aim: "Study and compare the concepts of Artificial Intelligence, Machine Learning and Deep Learning with suitable real-world examples.",
    algorithm: [
      "Create the XOR dataset with four input pairs and their labels.",
      "Write the AI solution as an explicit human rule: x1 != x2.",
      "Build a single-neuron Keras model with a sigmoid output for ML.",
      "Compile it with Adam and binary cross-entropy, then train on XOR.",
      "Build a 2-4-1 Keras model with a ReLU hidden layer for DL.",
      "Train the DL model on the same data.",
      "Convert predicted probabilities into 0/1 labels using a 0.5 threshold.",
      "Compare the accuracy of all three methods and print the result.",
    ],
    code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

# Same XOR task solved by AI, ML and DL.
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([[0], [1], [1], [0]], dtype=float)

# 1. AI: explicit human-written rule.
ai_pred = np.array([[1 if x1 != x2 else 0] for x1, x2 in X], dtype=float)

# 2. ML: one sigmoid neuron can learn only a linear boundary.
keras.utils.set_random_seed(1)
ml = keras.Sequential([
    layers.Input((2,)),
    layers.Dense(1, activation="sigmoid"),
])
ml.compile(optimizer="adam", loss="binary_crossentropy")
ml.fit(X, y, epochs=300, verbose=0)
ml_pred = (ml.predict(X, verbose=0) > 0.5).astype(float)

# 3. DL: a hidden ReLU layer learns the non-linear XOR features.
keras.utils.set_random_seed(2)
dl = keras.Sequential([
    layers.Input((2,)),
    layers.Dense(4, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])
dl.compile(optimizer="adam", loss="binary_crossentropy")
dl.fit(X, y, epochs=2000, verbose=0)
dl_pred = (dl.predict(X, verbose=0) > 0.5).astype(float)


def accuracy(prediction):
    return float(np.mean(prediction == y)) * 100


print("Same XOR task solved in three ways")
print("----------------------------------")
print(f"{'Paradigm':10} {'Method':40} {'Accuracy':>8}")
print(f"{'AI':10} {'Hand-coded rule: x1 != x2':40} {accuracy(ai_pred):7.1f}%")
print(f"{'ML':10} {'Keras single neuron (linear model)':40} {accuracy(ml_pred):7.1f}%")
print(f"{'DL':10} {'Keras 2-4-1 network':40} {accuracy(dl_pred):7.1f}%")
print()
print("Observation:")
print("- AI encodes human knowledge directly and needs no training data.")
print("- ML learns from data, but one linear boundary cannot separate XOR.")
print("- DL learns hidden features and therefore solves XOR correctly.")`,
    output: `﻿Same XOR task solved in three ways
----------------------------------
Paradigm   Method                                   Accuracy
AI         Hand-coded rule: x1 != x2                  100.0%
ML         Keras single neuron (linear model)          50.0%
DL         Keras 2-4-1 network                        100.0%

Observation:
- AI encodes human knowledge directly and needs no training data.
- ML learns from data, but one linear boundary cannot separate XOR.
- DL learns hidden features and therefore solves XOR correctly.`
  },
  {
    id: 2,
    lang: "python",
    course: "Deep Learning Lab",
    title: "Deep Learning Applications",
    tag: "Domain report with model selection and ranking",
    file: "dl_applications.py",
    aim: "Explore and present various real-world applications of Deep Learning in different domains.",
    algorithm: [
      "List the major domains where Deep Learning is used.",
      "Record the task, input data, suitable model and output for each domain.",
      "Print the application report in a readable form.",
      "Map each input type to a suitable Keras architecture.",
      "Build a small Keras model for image, sequence, text and tabular data.",
      "Print the parameter count to compare model size.",
      "Score each domain on adoption, data availability and impact.",
      "Rank the domains by their average score and print the result.",
    ],
    code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

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
        model = keras.Sequential([
            layers.Input((32, 32, 3)),
            layers.Conv2D(8, 3, activation="relu"),
            layers.Flatten(),
            layers.Dense(10, activation="softmax"),
        ])
        name = "CNN"
    elif data_type == "sequence":
        model = keras.Sequential([
            layers.Input((24, 1)),
            layers.LSTM(8),
            layers.Dense(1),
        ])
        name = "LSTM"
    elif data_type == "text":
        model = keras.Sequential([
            layers.Input((24,)),
            layers.Embedding(1000, 8),
            layers.LSTM(8),
            layers.Dense(1, activation="sigmoid"),
        ])
        name = "Embedding + LSTM"
    else:
        model = keras.Sequential([
            layers.Input((8,)),
            layers.Dense(16, activation="relu"),
            layers.Dense(1, activation="sigmoid"),
        ])
        name = "MLP"
    print(f"{data_type:9} -> {name:20} {model.count_params():>7} parameters ({task})")

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
    output: `﻿Real-world Deep Learning applications
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
image     -> CNN                    72234 parameters (classify a medical scan)
sequence  -> LSTM                     329 parameters (forecast hourly energy demand)
text      -> Embedding + LSTM        8553 parameters (summarise a news article)
tabular   -> MLP                      161 parameters (predict loan default)

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
    lang: "python",
    course: "Deep Learning Lab",
    title: "Artificial Neuron",
    tag: "Weighted sum, activation and perceptron learning",
    file: "artificial_neuron.py",
    aim: "Design and explain the structure and working of an artificial neuron.",
    algorithm: [
      "Define the AND gate truth table as inputs X and targets y.",
      "Build a single Dense neuron with a sigmoid activation in Keras.",
      "Compile the neuron with SGD and binary cross-entropy.",
      "Train for 2000 epochs on the four samples.",
      "Read the learned weight and bias values from the layer.",
      "Compute the weighted sum z = w1*x1 + w2*x2 + b for input [1, 1].",
      "Apply sigmoid to show the activation value.",
      "Predict the probability for every row and threshold at 0.5.",
      "Print the truth table and verify 100% accuracy.",
    ],
    code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([[0], [0], [0], [1]], dtype=float)

# One neuron: weighted sum + sigmoid activation.
keras.utils.set_random_seed(4)
model = keras.Sequential([
    layers.Input((2,)),
    layers.Dense(1, activation="sigmoid"),
])
model.compile(
    optimizer=keras.optimizers.SGD(learning_rate=0.1),
    loss="binary_crossentropy",
)
history = model.fit(X, y, epochs=2000, verbose=0)

w, b = model.layers[0].get_weights()
print("Training one artificial neuron on the AND gate")
print("Epoch   Loss")
for epoch in (0, 400, 800, 1200, 1600, 2000):
    print(f"{epoch:5d}  {history.history['loss'][min(epoch, 1999)]:.4f}")

print()
print("Final neuron parameters")
print("Weight 1 =", round(float(w[0, 0]), 3))
print("Weight 2 =", round(float(w[1, 0]), 3))
print("Bias     =", round(float(b[0]), 3))

x = np.array([[1.0, 1.0]])
z = float((x @ w + b).item())
a = float(1 / (1 + np.exp(-z)))
print()
print("Step-by-step working for input [1, 1]")
print("Weighted sum z = w1*x1 + w2*x2 + b =", round(z, 3))
print("Activation a   = sigmoid(z)        =", round(a, 3))

probs = model.predict(X, verbose=0).ravel()
preds = (probs >= 0.5).astype(int)
print()
print("Truth table")
print("x1  x2  probability  prediction  target")
correct = 0
for xi, target, prob, pred in zip(X, y.ravel(), probs, preds):
    correct += int(pred == target)
    print(f"{int(xi[0])}   {int(xi[1])}  {prob:11.3f}  {pred:10d}  {int(target):6d}")
print()
print(f"Accuracy = {correct / len(X) * 100:.1f}%")`,
    output: `﻿Training one artificial neuron on the AND gate
Epoch   Loss
    0  0.7172
  400  0.2510
  800  0.1649
 1200  0.1228
 1600  0.0976
 2000  0.0808

Final neuron parameters
Weight 1 = 4.261
Weight 2 = 4.26
Bias     = -6.582

Step-by-step working for input [1, 1]
Weighted sum z = w1*x1 + w2*x2 + b = 1.939
Activation a   = sigmoid(z)        = 0.874

Truth table
x1  x2  probability  prediction  target
0   0        0.001           0       0
0   1        0.089           0       0
1   0        0.089           0       0
1   1        0.874           1       1

Accuracy = 100.0%`
  },
  {
    id: 4,
    lang: "python",
    course: "Deep Learning Lab",
    title: "Simple Artificial Neural Network",
    tag: "Layer sizes, parameters and forward propagation",
    file: "simple_ann.py",
    aim: "Construct a simple Artificial Neural Network (ANN) and identify its input, hidden and output layers.",
    algorithm: [
      "Define a 3-input sample and identify the input layer.",
      "Choose 4 hidden neurons with ReLU activation.",
      "Choose 2 output neurons with softmax activation.",
      "Build the network as a Keras Sequential model.",
      "Print each layer, its activation and its parameter count.",
      "Run a forward pass to obtain the hidden activations.",
      "Obtain the output class probabilities.",
      "Print the predicted class for each sample.",
    ],
    code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

X = np.array([[0.5, 0.2, 0.9], [0.1, 0.8, 0.4]], dtype=float)

keras.utils.set_random_seed(55)
model = keras.Sequential([
    layers.Input((3,), name="input"),
    layers.Dense(4, activation="relu", name="hidden"),
    layers.Dense(2, activation="softmax", name="output"),
])

print("ANN architecture")
print("Layer   Neurons  Activation  Parameters")
print("Input         3        -             0")
for layer in model.layers:
    print(f"{layer.name.capitalize():6} {layer.units:8d} {layer.activation.__name__:>11} {layer.count_params():12d}")
print("Total trainable parameters:", model.count_params())
print()
print("Forward propagation")
print("--------------------")
probs = model.predict(X, verbose=0)
for i, sample in enumerate(X, start=1):
    hidden = model.layers[0](sample.reshape(1, -1)).numpy()
    print(f"Sample {i}: {sample}")
    print("  Input layer      :", sample)
    print("  Hidden (ReLU)    :", np.round(hidden, 3).ravel())
    print("  Output softmax   :", np.round(probs[i - 1], 3))
    print("  Predicted class  :", int(np.argmax(probs[i - 1])))
    print()
print("The input layer receives features; the hidden layer learns new features;")
print("the output layer converts those features into class probabilities.")`,
    output: `﻿ANN architecture
Layer   Neurons  Activation  Parameters
Input         3        -             0
Hidden        4        relu           16
Output        2     softmax           10
Total trainable parameters: 26

Forward propagation
--------------------
Sample 1: [0.5 0.2 0.9]
  Input layer      : [0.5 0.2 0.9]
  Hidden (ReLU)    : [0.705 0.    0.    0.115]
  Output softmax   : [0.524 0.476]
  Predicted class  : 0

Sample 2: [0.1 0.8 0.4]
  Input layer      : [0.1 0.8 0.4]
  Hidden (ReLU)    : [0.261 0.362 0.    0.   ]
  Output softmax   : [0.549 0.451]
  Predicted class  : 0

The input layer receives features; the hidden layer learns new features;
the output layer converts those features into class probabilities.`
  },
  {
    id: 5,
    lang: "python",
    course: "Deep Learning Lab",
    title: "Data Pre-processing",
    tag: "Missing values, one-hot encoding and scaling",
    file: "preprocessing.py",
    aim: "Perform basic data pre-processing on a given dataset by identifying features, labels and handling missing values.",
    algorithm: [
      "Load the raw dataset with age, marks, city and the pass/fail label.",
      "Count the missing values in every feature column.",
      "Replace missing age and marks with their column means.",
      "Encode the city column with keras.utils.to_categorical.",
      "Create a Keras Normalization layer for the numeric features.",
      "Adapt the layer to learn the mean and variance from the data.",
      "Scale the numeric features with the adapted layer.",
      "Concatenate the scaled features with the one-hot city columns.",
      "Print the final feature matrix and its shape.",
    ],
    code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

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

# Keras helpers: one-hot encoding and a normalisation layer.
city = keras.utils.to_categorical(X_raw[:, 2].astype(int), num_classes=3)

normalizer = layers.Normalization(axis=-1)
normalizer.adapt(X_raw[:, :2])
scaled = normalizer(X_raw[:, :2]).numpy()
X = np.hstack([scaled, city])

print()
print("Scaled numeric features (age, marks)")
print(scaled)
print()
print("One-hot encoded city")
print(city)
print()
print("Final features (age, marks, city one-hot)")
print(X)
print("Feature shape:", X.shape)
print("Labels       :", y)
print()
print("Features are the inputs; labels are the answers to predict.")
print("Missing values and different scales would otherwise mislead the model.")`,
    output: `﻿Raw feature matrix
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
    lang: "python",
    course: "Deep Learning Lab",
    title: "Train, Validation and Test Split",
    tag: "60/20/20 split without data leakage",
    file: "train_test_split.py",
    aim: "Split a given dataset into training and testing datasets and explain their significance in Deep Learning.",
    algorithm: [
      "Generate a dataset with three features and a binary label.",
      "Shuffle the samples and wrap them in a TensorFlow dataset.",
      "Use keras.utils.split_dataset to take 60% for training.",
      "Split the remaining 40% equally into validation and test sets.",
      "Compute the mean and standard deviation from the training set only.",
      "Apply the same scaling to validation and test data to avoid data leakage.",
      "Check the class balance in each split.",
      "Print the split sizes, scaling statistics and sample rows.",
    ],
    code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
import tensorflow as tf
from tensorflow import keras

np.set_printoptions(precision=2, suppress=True)

rng = np.random.default_rng(42)
n = 20
X = rng.normal(size=(n, 3))
y = (X[:, 0] + 0.5 * X[:, 1] > 0).astype(int)

ds = tf.data.Dataset.from_tensor_slices((X, y)).shuffle(n, seed=42)
train_ds, rest_ds = keras.utils.split_dataset(ds, left_size=0.6, right_size=0.4)
val_ds, test_ds = keras.utils.split_dataset(rest_ds, left_size=0.5, right_size=0.5)


def to_arrays(dataset):
    rows = list(dataset.as_numpy_iterator())
    return np.array([row[0] for row in rows]), np.array([row[1] for row in rows])


X_train, y_train = to_arrays(train_ds)
X_val, y_val = to_arrays(val_ds)
X_test, y_test = to_arrays(test_ds)

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
    output: `﻿Dataset size : 20
Training set : 12 samples (60%)
Validation   : 4 samples (20%)
Test set     : 4 samples (20%)

Class balance
train      : class 0 = 8, class 1 = 4
validation : class 0 = 2, class 1 = 2
test       : class 0 = 2, class 1 = 2

Scaling statistics learned from the training set only
mean = [ 0.36 -0.38 -0.13]
std  = [0.86 0.86 0.66]

First two training rows after scaling
[[-1.42  0.87 -1.25]
 [ 0.37  0.52  0.63]]
First two test rows after scaling
[[-0.35  1.76  0.9 ]
 [ 0.6   0.39 -0.09]]

Why the split matters
- Training data updates the weights.
- Validation data tunes hyperparameters and detects overfitting.
- Test data is used once for an unbiased final score.`
  },
  {
    id: 7,
    lang: "python",
    course: "Deep Learning Lab",
    title: "Simple DL Prediction Model",
    tag: "2-8-1 network trained with backpropagation",
    file: "predictor.py",
    aim: "Develop a simple Deep Learning model for prediction or classification using a sample dataset.",
    algorithm: [
      "Import NumPy, Matplotlib and TensorFlow/Keras.",
      "Create a sample dataset of study hours and marks.",
      "Define a Sequential model with one ReLU hidden layer and one output neuron.",
      "Compile the model with the Adam optimizer and MSE loss.",
      "Train the model for 500 epochs on the dataset.",
      "Plot the training loss curve using Matplotlib.",
      "Give a new input of 7.5 study hours to the trained model.",
      "Predict and display the student's marks.",
    ],
    code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
import matplotlib.pyplot as plt
from tensorflow import keras
from tensorflow.keras import layers

# Sample dataset
hours = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], dtype=float)
marks = np.array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100], dtype=float)

# Create Deep Learning model
keras.utils.set_random_seed(0)
model = keras.Sequential([
    layers.Input((1,)),
    layers.Dense(10, activation="relu"),
    layers.Dense(1),
])

# Compile the model
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.05),
    loss="mse",
)

# Train the model
history = model.fit(
    hours,
    marks,
    epochs=500,
    verbose=0,
)

# Plot loss curve
plt.plot(history.history["loss"])
plt.title("Training Loss Curve")
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.show()

# Predict for new input
new_hours = np.array([[7.5]])
predicted = model.predict(new_hours, verbose=0)
print("Study Hours:", 7.5)
print("Predicted Marks:", round(float(predicted[0][0]), 1))`,
    output: `﻿Study Hours: 7.5
Predicted Marks: 75.0`
  },
  {
    id: 8,
    lang: "python",
    course: "Deep Learning Lab",
    title: "Model Evaluation",
    tag: "Confusion matrix, precision, recall, F1 and AUC",
    file: "evaluate.py",
    aim: "Evaluate the performance of a Deep Learning model using appropriate evaluation metrics such as accuracy and confusion matrix.",
    algorithm: [
      "Generate a binary dataset with an imbalanced class distribution.",
      "Shuffle the data and scale the features using training statistics.",
      "Build a Keras network with a ReLU hidden layer and a sigmoid output.",
      "Train the model with binary cross-entropy and Adam.",
      "Convert predicted probabilities into labels using a 0.5 threshold.",
      "Count true positives, true negatives, false positives and false negatives.",
      "Compute accuracy, precision, recall, specificity and F1-score.",
      "Sort the scores and compute the ROC curve and AUC.",
    ],
    code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

keras.utils.set_random_seed(11)
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

model = keras.Sequential([
    layers.Input((2,)),
    layers.Dense(8, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])
model.compile(optimizer="adam", loss="binary_crossentropy")
model.fit(X_train, y_train, epochs=200, verbose=0)

scores = model.predict(X_test, verbose=0).ravel()
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
    output: `﻿Confusion matrix
                   Predicted 0  Predicted 1
Actual 0 (negative)          28            1
Actual 1 (positive)           0           11

Metrics
Accuracy    : 97.50%
Precision   : 0.917
Recall      : 1.000
Specificity : 0.966
F1-score    : 0.957
ROC AUC     : 1.000

Accuracy alone can hide errors when classes are imbalanced;
precision, recall and the confusion matrix show the full picture.`
  },
  {
    id: 9,
    lang: "python",
    course: "Deep Learning Lab",
    title: "Generative and Responsible AI",
    tag: "Text generation plus a fairness audit",
    file: "responsible_ai.py",
    aim: "Study the concepts of Generative AI, responsible AI and ethical issues in Deep Learning with suitable examples.",
    algorithm: [
      "Prepare a small text corpus and split it into word tokens.",
      "Build a vocabulary and encode each word as a one-hot vector.",
      "Create training pairs from every two consecutive words.",
      "Build a Keras network with a ReLU hidden layer and a softmax output.",
      "Train the model to predict the next word.",
      "Generate new text by sampling the next word from the model.",
      "Define two groups and compute their hiring selection rates.",
      "Compute the disparate impact ratio and flag possible bias below 0.80.",
      "Print the responsible AI checklist.",
    ],
    code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

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

inputs = np.zeros((len(tokens) - 2, 2 * size), dtype=float)
targets = np.zeros(len(tokens) - 2, dtype=int)
for row, (first, second, third) in enumerate(zip(tokens[:-2], tokens[1:-1], tokens[2:])):
    inputs[row, index[first]] = 1
    inputs[row, size + index[second]] = 1
    targets[row] = index[third]
targets = keras.utils.to_categorical(targets, num_classes=size)

keras.utils.set_random_seed(2)
model = keras.Sequential([
    layers.Input((2 * size,)),
    layers.Dense(32, activation="relu"),
    layers.Dense(size, activation="softmax"),
])
model.compile(optimizer="adam", loss="categorical_crossentropy")
model.fit(inputs, targets, epochs=800, verbose=0)

rng = np.random.default_rng(2)
first, second = "deep", "learning"
generated = [first, second]
for _ in range(14):
    vector = np.zeros((1, 2 * size))
    vector[0, index[first]] = 1
    vector[0, size + index[second]] = 1
    probabilities = model.predict(vector, verbose=0)[0]
    third = int(rng.choice(size, p=probabilities / probabilities.sum()))
    generated.append(vocab[third])
    first, second = second, vocab[third]

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
    output: `﻿Part A - Generative AI (word-level language model)
Generated text sample:
deep learning learns patterns from data . responsible ai protects people and builds trust . generative

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
    lang: "python",
    course: "Deep Learning Lab",
    title: "Mini Case Study — Healthcare",
    tag: "Diabetes risk prediction with an ANN",
    file: "case_study.py",
    aim: "Develop a mini case study demonstrating the application of Deep Learning in any one domain such as Healthcare, Agriculture, Education, Finance or Autonomous Vehicles.",
    algorithm: [
      "Collect a small patient dataset with age, glucose, BMI, blood pressure and risk.",
      "Shuffle the records and separate the four features from the label.",
      "Split the data into training and test sets.",
      "Standardise the features using training-set mean and standard deviation.",
      "Build a 4-6-1 Keras network with ReLU hidden units and a sigmoid output.",
      "Compile with Adam and binary cross-entropy, then train the network.",
      "Print the loss at regular epochs to show convergence.",
      "Evaluate the model on the test patients and report accuracy.",
      "Predict the risk for three new patients and convert each probability into a decision.",
    ],
    code: `import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

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

keras.utils.set_random_seed(6)
model = keras.Sequential([
    layers.Input((4,)),
    layers.Dense(6, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])
model.compile(optimizer="adam", loss="binary_crossentropy")
history = model.fit(X_train, y_train, epochs=600, verbose=0)

print("Healthcare case study: diabetes risk prediction")
print("Training a 4-6-1 neural network")
print("Epoch   Loss")
for epoch in (0, 100, 200, 300, 400, 500, 600):
    print(f"{epoch:5d}  {history.history['loss'][min(epoch, 599)]:.4f}")

test_prob = model.predict(X_test, verbose=0).ravel()
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
new_prob = model.predict(new_scaled, verbose=0).ravel()

print()
print("Risk for new patients")
print("Age  Glucose   BMI   BP    Risk   Decision")
for row, risk in zip(new_patients, new_prob):
    decision = "high risk" if risk >= 0.5 else "low risk"
    print(f"{int(row[0]):3d} {int(row[1]):8d} {row[2]:5.1f} {int(row[3]):4d} {risk:6.3f}   {decision}")
print()
print("This is a teaching model, not a medical device.")`,
    output: `﻿Healthcare case study: diabetes risk prediction
Training a 4-6-1 neural network
Epoch   Loss
    0  0.5004
  100  0.3339
  200  0.2298
  300  0.1689
  400  0.1289
  500  0.1005
  600  0.0795

Test accuracy: 100.0%
Test patients
Patient  Risk score  Predicted  Actual
      1       0.030          0       0
      2       0.082          0       0
      3       0.967          1       1
      4       0.002          0       0

Risk for new patients
Age  Glucose   BMI   BP    Risk   Decision
 50      145  33.0   86  0.850   high risk
 35      100  25.0   74  0.006   low risk
 60      175  38.0   94  0.994   high risk

This is a teaching model, not a medical device.`
  }
];

export const COURSES = ["All programs", "Deep Learning Lab"];
