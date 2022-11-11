import imgaug as ia
import imgaug.augmenters as iaa
import numpy as np
from scipy.ndimage import binary_dilation
import skimage.morphology as ski
import random
import cv2

def augment_img(img, P):
    x = np.empty((P["augmentation"]["num"], P["img_width_height"], P["img_width_height"]))
    
    for i in range(P["augmentation"]["num"]):
        x[i] = img
        
        x[i] = cv2.dilate(x[i], ski.disk(random.randint(1, P["augmentation"]["conv2d_kernel_size"])))
        
        # x[i] = iaa.Affine(rotate=(P["augmentation"]["rotation"])).augment_image(x[i])
        # x[i] = iaa.AdditiveGaussianNoise(scale=255*P["augmentation"]["noise_std"]).augment_image(x[i].astype(np.uint8))
        # x[i] = iaa.ElasticTransformation(alpha=P["augmentation"]["elastic_alpha"], sigma=P["augmentation"]["elastic_sigma"]).augment_image(x[i])

    # print(kernel)
    return x