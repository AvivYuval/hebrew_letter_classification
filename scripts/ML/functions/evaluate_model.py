import matplotlib.pyplot as plt
import numpy as np

def evaluate_model(model, x_train, y_train, x_test, y_test, training_history, P):
    fig, ax1 = plt.subplots()
 
    plt.xlabel('Epoch Number', fontsize = "x-large")
    plt.ylabel('Accuracy', fontsize = "x-large")
    ax1.plot(training_history.history['accuracy'], label='training Accuracy', c="blue")
    ax1.plot(training_history.history['val_accuracy'], label='test Accuracy', c="red")
    plt.xticks(np.arange(0, P["epochs"]), fontsize = "x-large")
    plt.yticks(fontsize = "x-large")
    ax1.legend()
    
    ax2 = ax1.twinx()
    plt.ylabel('Loss', fontsize = "x-large")
    ax2.plot(training_history.history['loss'], label='training Loss', ls='dashed', c="blue")
    ax2.plot(training_history.history['val_loss'], label='test Loss', ls='dashed', c="red")
    plt.yticks(fontsize = "x-large")
    ax2.legend()
    
    plt.show()
    
    train_loss, train_accuracy = model.evaluate(x_train, y_train)

    print('Training loss: ', train_loss)
    print('Training accuracy: ', train_accuracy)

    validation_loss, validation_accuracy = model.evaluate(x_test, y_test)
    print('Validation loss: ', validation_loss)
    print('Validation accuracy: ', validation_accuracy)

    return train_loss, train_accuracy