import datetime

def parameters():
    P = {
        "class_num": 4, # Number of classes.
        "img_width_height": 100, # Image width/height [px].
        "learning_rate": 0.0005, # Model learning rate.
        "batch_size": 8, # Model batch size.
        "epochs": 1, # 20 Model number of epocs.
        "paths": {
            "dataset_path": '../../resources/hebrew_letter_class', # Dataset Path.
            "models_path": '../../resources/models/',
            "log_dir": '../../resources/training_log/',
        },
        "augmentation": {
            "num": 10,
            "rotation": (-30, 30), # 2D rotation [deg].
            "conv2d_kernel_size": 7,
            "noise_std": 0.2, # 0.4
            "elastic_alpha": 10.0, # 20
            "elastic_sigma": 1.5, # 3
        }
    }
    P["augmentation"]["conv2d_kernel_size"] = int(7*P["img_width_height"]/200)
    return P