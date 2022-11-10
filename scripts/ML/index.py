# import sklearn.model_selection as ms
import matplotlib.pyplot as plt
import tensorflow as tf
import tensorflowjs as tfjs
import seaborn as sn
import pandas as pd
import numpy as np
import datetime
import platform
import math
import cv2
import os

from functions.load_data import *
from functions.load_model import *
from functions.parameters import *
from functions.evaluate_model import *
from functions.show_data import *

# print('Python version:', platform.python_version())
# print('Tensorflow version:', tf.__version__)
# print('Keras version:', tf.keras.__version__)

P = parameters()

np.random.seed(0)
tf.random.set_seed(0)

x_train, x_test, y_train, y_test = load_data(P)

show_data(x_train, y_train)

model = load_model(P)

# model.summary()
# tf.keras.utils.plot_model(model, show_shapes=True, show_layer_names=True)

adam_optimizer = tf.keras.optimizers.Adam(learning_rate = P["learning_rate"])

model.compile(optimizer=adam_optimizer, loss=tf.keras.losses.sparse_categorical_crossentropy, metrics=['accuracy'])

date_time = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")

tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir=P["paths"]["log_dir"] + date_time, histogram_freq=1)
training_history = model.fit(x_train, y_train, batch_size=P["batch_size"], epochs=P["epochs"], validation_data=(x_test, y_test), callbacks=[tensorboard_callback])

tfjs.converters.save_keras_model(model, P["paths"]["models_path"] + 'model_' + date_time) # Export model to json file.

'''
json_model = model.to_json()
with open(P["paths"]["models_path"] + 'model_' + date_time + '.json', 'w') as json_file:
    json_file.write(json_model)
model.save_weights(P["paths"]["models_path"] + 'model_' + date_time + '.h5')
'''

train_loss, train_accuracy = evaluate_model(model, x_train, y_train, x_test, y_test, training_history, P)