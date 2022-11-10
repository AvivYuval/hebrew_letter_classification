import tensorflow as tf

def load_model(P):
    model = tf.keras.models.Sequential()

    model.add(tf.keras.layers.Convolution2D(
        input_shape=(P["img_width_height"], P["img_width_height"], 1),
        kernel_size=3,
        filters=8,
        strides=1,
        activation=tf.keras.activations.relu,
        kernel_initializer=tf.keras.initializers.VarianceScaling()
    ))

    model.add(tf.keras.layers.MaxPooling2D(
        pool_size=(2, 2),
        strides=(2, 2)
    ))

    for m in range(3):
        model.add(tf.keras.layers.Convolution2D(
            kernel_size=3,
            filters=16,
            strides=1,
            activation=tf.keras.activations.relu,
            kernel_initializer=tf.keras.initializers.VarianceScaling()
        ))

        model.add(tf.keras.layers.MaxPooling2D(
            pool_size=(2, 2),
            strides=(2, 2)
        ))

    model.add(tf.keras.layers.Flatten())

    model.add(tf.keras.layers.Dense(
        units=128,
        activation=tf.keras.activations.relu
    ));

    model.add(tf.keras.layers.Dropout(0.2))

    model.add(tf.keras.layers.Dense(units=P["class_num"], activation=tf.keras.activations.softmax, kernel_initializer=tf.keras.initializers.VarianceScaling()
    ))
    return model
