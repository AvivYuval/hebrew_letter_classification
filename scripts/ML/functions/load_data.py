import numpy as np
import sklearn.model_selection as ms
import cv2
import os
from functions.augment_img import *

def load_data(P):
    IMAGE_CHANNELS = 1
    x = []
    y = []
    # print(P["dataset_path"])
    dataset_path = P["paths"]["dataset_path"]
    for i in os.listdir(dataset_path):
        class_path = dataset_path + "/" + i
        # print(class_path)
        for j in os.listdir(class_path):
            # print(j)
            if os.path.isfile(os.path.join(class_path, j)):
                image_path = class_path + "/" + j
                img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
                # print(img.shape)
                img = cv2.resize(img,(P["img_width_height"],P["img_width_height"]))
                # img = img[...,3]
                x.append(img)
                y.append(int(i))
    x = np.array(x)
    y = np.array(y)
    
    # print(x.shape)
    # print(y.shape)
    
    Ni = len(y)
    for i in range(Ni):
        x = np.append(x, augment_img(x[i], P), axis=0)
        y = np.append(y, np.ones(P["augmentation"]["num"]) * y[i])
        # print(Ni)
    
    print(x.shape)
    print(y.shape)
    
    x_train, x_test, y_train, y_test = ms.train_test_split(x, y, shuffle = True)
    
    x_train_with_chanels = x_train.reshape(x_train.shape[0], P["img_width_height"], P["img_width_height"], IMAGE_CHANNELS)

    x_test_with_chanels = x_test.reshape(x_test.shape[0], P["img_width_height"], P["img_width_height"], IMAGE_CHANNELS)

    x_train_normalized = x_train_with_chanels / 255
    x_test_normalized = x_test_with_chanels / 255

    return x_train_normalized, x_test_normalized, y_train, y_test