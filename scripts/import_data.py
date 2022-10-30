import json
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import convolve2d
import pathlib
from PIL import Image
import os
# import cv2

class_num = 4
dataset_path = r'../resources/hebrew_letter_class'
f = open('../resources/webData/ABCD_num=~20_2022_10_30.json')
# returns JSON object as 
# a dictionary
data = json.load(f)
# print(data)
img_num = len(data)
# Closing file
f.close()
height = 500
weight = 500
channel = 3
img_numpy = np.zeros((height, weight, channel), dtype=np.uint8)
c = np.zeros([img_num, 200,200])
img = np.zeros([img_num,1])
kernel = np.ones([5,5])
file_count = np.zeros(class_num)

for folder in pathlib.Path(dataset_path).iterdir():
    for file in os.listdir(folder):
        if os.path.isfile(os.path.join(folder, file)):
            file_count[int(folder.name)] += 1
print(file_count)

for i in range(len(data)): # For each sample.
    for j in range(len(data[i]['coordinates'])): # For each line.
        for k in range(len(data[i]['coordinates'][j]['points'])): # For each point.
             c[i][data[i]['coordinates'][j]['points'][k]['y']][data[i]['coordinates'][j]['points'][k]['x']] = 255
#    img = cv2.cvtColor(c[i].astype('uint8'), cv2.COLOR_GRAY2BGR)
    c[i] = convolve2d(c[i].astype(int), kernel.astype(int), mode='same').astype(int)
    img = Image.fromarray(c[i]).convert("L")
    # img.show()
    print(file_count[data[i]['class']])
    image_filename = dataset_path + "/" + str(data[i]['class']) + "/" + str(int(file_count[data[i]['class']])) + ".png"
    img.save(image_filename)
    file_count[data[i]['class']] += 1


plt.figure(figsize=(10,10))
for i in range(len(data)): # For each sample.
    plt.subplot(img_num, img_num, i+1)
    plt.imshow(c[i], cmap=plt.cm.binary)
    plt.xticks([])
    plt.yticks([])
    plt.xlabel(data[i]['class'])