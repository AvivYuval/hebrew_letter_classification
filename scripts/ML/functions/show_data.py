import matplotlib.pyplot as plt
import math

def show_data(x, y):
	numbers_to_display = 16
	num_cells = math.ceil(math.sqrt(numbers_to_display))
	plt.figure(figsize=(10,10))
	for i in range(numbers_to_display):
		plt.subplot(num_cells, num_cells, i+1)
		plt.xticks([])
		plt.yticks([])
		plt.grid(False)
		plt.imshow(x[i], cmap=plt.cm.binary)
		plt.xlabel(y[i])

	plt.show()