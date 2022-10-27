import * as tfjs from "@tensorflow/tfjs";

const Preprocess = (img) => {
		let tensor = tfjs.browser.fromPixels(img);
		const resized = tfjs.image.resizeBilinear(tensor, [50, 50],false, true).toFloat();
		const offset = tfjs.scalar(255.0);
		const normalized = tfjs.scalar(1.0).sub(resized.div(offset));
		const batched = normalized.expandDims(0).min(3,true);
		
		return batched;
	  }
 
export default Preprocess;