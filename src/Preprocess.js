import * as tfjs from "@tensorflow/tfjs";

const Preprocess = (img) => {
	let tensor = tfjs.browser.fromPixels(img);
	// console.log(tensor);

	const resized = tfjs.image.resizeBilinear(tensor, [100, 100],false, true).toFloat();
	// console.log(resized);
	const offset = tfjs.scalar(255.0);
	var normalized = tfjs.scalar(1.0).sub(resized.div(offset));
	// console.log(normalized);

	// let kernel = tfjs.tensor([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], [5,5,1])
	// normalized = tfjs.sub(1, tfjs.dilation2d(tfjs.sub(1, normalized), kernel, 1, 'same'));
	
	const batched = normalized.expandDims(0).min(3,true);
	
	var batched_3d = tensor.gather(0, 2);
	// var batched_3d = tensor.div(offset);
	// batched_3d = tfjs.dilation2d(batched_3d, kernel, 1, 'same');
	// batched_3d = batched_3d.gather(0, 2);

	// const batched_3d = tfjs.reshape(batched,[50,50]);
	// console.log(batched);
	// console.log(tfjs.reshape(batched,[1,50,50]));

	return [batched, batched_3d];
}

export default Preprocess;