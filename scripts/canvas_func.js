async function start(){
	model = await tf.loadModel('.\files\pretrained_models.json');

	// var status = document.getElementById('status')

	// status.innerHTML = 'Model Loaded'

	// document.getElementById('status').innerHTML = 'Model Loaded';


	// img = document.getElementById('list').firstElementChild.firstElementChild;
	// model.predict(tf.zeros([null,50,50,3]))

	// load the class names
	// await loadDict()
}

function preprocess(img){
	//convert the image data to a tensor 
	let tensor = tf.browser.fromPixels(img);
	//resize to 50 X 50
	const resized = tf.image.resizeBilinear(tensor, [50, 50]).toFloat();
	// Normalize the image 
	const offset = tf.scalar(255.0);
	const normalized = tf.scalar(1.0).sub(resized.div(offset));
	//We add a dimension to get a batch shape 
	const batched = normalized.expandDims(0);
	return batched;
}

function canvas_func() {
	
	// const model = await tf.loadLayersModel('../files/pretrained_models/model.json');
	// const model = await loadGraphModel('../files/pretrained_models/model.json');
	
	var canvas;
	var context;
	const w = 200;
	const h = 200;
	const c = 4;
	const arr = new Uint8ClampedArray(w*h*c);
	var N = 0;
	var C = [];
	var isDrawing;

	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

	context.strokeStyle = "black";
	context.lineWidth = 5;
	
	canvas.addEventListener("mousedown", function(e) { startDrawing(e); } );
	canvas.addEventListener("mousemove", function(e) { draw(e); } );
	
	addEventListener("mouseup", function() {
		isDrawing = false;
	});

	document.getElementById("reset_button").addEventListener("click", function() {
		C = [];
	});
	document.getElementById("submit_button").addEventListener("click", async function() {
		var I;
		
		for (let i = 0; i < arr.length; i+=4) {
			arr[i] = 0;
			arr[i + 1] = 0;
			arr[i + 2] = 0;
			arr[i + 3] = 255;
		}
		
		for (let o=0; o<C.length; o++) {
		
			// Round all coordinates
			for (let i=0; i<C[o].x.length; i++) {
				C[o].x[i] = Math.round(C[o].x[i]);
				C[o].y[i] = Math.round(C[o].y[i]);
			}
			
			let X_avrg;
			let Y_avrg;
			
			// Make the coordinates arrays denser
			for (let j = 0; j <= 10; j++) {
				let X_arr = [];
				let Y_arr = [];
				let n = C[o].x.length;
				
				for (let i=0; i<n-1; i++) {
					X_avrg = Math.round((C[o].x[i] + C[o].x[i+1])/2);
					Y_avrg = Math.round((C[o].y[i] + C[o].y[i+1])/2);
					
					X_arr.push(Math.round(C[o].x[i]));
					Y_arr.push(Math.round(C[o].y[i]));
					
					if(C[o].x[i] != X_avrg || C[o].y[i] != Y_avrg) {
						X_arr.push(X_avrg);
						Y_arr.push(Y_avrg);
					}
				}
				
				// Add the last coordinate
				X_arr.push(C[o].x[n-1]);
				Y_arr.push(C[o].y[n-1]);
				
				// Update the original coordinates
				C[o].x = X_arr;
				C[o].y = Y_arr;
			}
			
			n = C[o].x.length;
			
			for (let i = 0; i < n; i++) {
				I = (C[o].x[i] + C[o].y[i]*w) * c;
				arr[I] = 255;    // R value
				arr[I + 1] = 255;  // G value
				arr[I + 2] = 255;    // B value
				arr[I + 3] = 255;  // A value
			}
		}
		
		// Initialize a new ImageData object
		let imageData = new ImageData(arr, w);
		document.getElementById("hidden_canvas").getContext('2d').putImageData(imageData, 0, 0);
		var dataURL = document.getElementById("hidden_canvas").toDataURL();
		document.getElementById('img_dataset').innerHTML += "<img id='img' src="+dataURL+">";
		const img_tf = preprocess(imageData);
		start();
		console.log(model.predict(img_tf));
		
		
		
		// console.log(C);
		
		
		// Load a pretrained cnn model
		// import * as tf from '@tensorflow/tfjs';
		// const model = await tf.loadLayersModel('../files/pretrained_models/model.json');
		// const model = await loadGraphModel('../files/pretrained_models/model.json');
	});
	
	function startDrawing(e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		isDrawing = true;
		context.beginPath();
		context.moveTo(x, y);
		
		C.push({x: [], y: []});
		N = C.length; // Number of line objects.
		
		context.beginPath();
		context.arc(x, y, 0.3, 0, 2 * Math.PI);
		context.fill();
		context.stroke();
		C[N-1].x.push(x);
		C[N-1].y.push(y);
		
		document.getElementById("x_draw").innerHTML = "drawn x:" + x;
		document.getElementById("y_draw").innerHTML = "drawn y:" + y;
	}

	function draw(e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		document.getElementById("x_mouse").innerHTML = "mouse x:" + x;
		document.getElementById("y_mouse").innerHTML = "mouse y:" + y;
		if (isDrawing == true) {  
			context.lineTo(x, y);
			context.lineCap = "round";
			context.stroke();

			C[N-1].x.push(x);
			C[N-1].y.push(y);

			document.getElementById("x_draw").innerHTML = "drawn x:" + x;
			document.getElementById("y_draw").innerHTML = "drawn y:" + y;
		}
	}
}