/* <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js"> </script> 
<script src="https://requirejs.org/docs/release/2.3.5/minified/require.js"></script>*/

async function start() {
	// var model = await tf.loadLayersModel('//C:/Users/AvivYuval/Documents/projects/hebrew_letter_classification/files/pretrained_models/model.json');
	// model = await tf.loadLayersModel('..\files\pretrained_models\model.json');
	// var model = await tf.loadLayersModel('localstorage://C:/Users/AvivYuval/Documents/projects/hebrew_letter_classification/files/pretrained_models/model.json');
	var model = undefined;
	model = await tf.loadLayersModel('https://raw.githubusercontent.com/AvivYuval/hebrew_letter_classification/main/files/pretrained_models/model.json');
	// var model = await tf.Model('https://github.com/AvivYuval/hebrew_letter_classification/tree/main/files/pretrained_models/model.json');
	// console.log(1)


	// return model;
	
	// var status = document.getElementById('status')

	// status.innerHTML = 'Model Loaded'

	// document.getElementById('status').innerHTML = 'Model Loaded';
	
	// img = document.getElementById('list').firstElementChild.firstElementChild;
	// model.predict(img_tf)
	// console.log(2)

	// load the class names
	// await loadDict()
	
	return model;
}
// start();

function preprocess(img) {
	let tensor = tf.browser.fromPixels(img); // Convert the image data to a tensor.
	
	// const resized = tf.image.resizeBilinear(tensor, [50, 50]).toFloat(); // Resize to 50 X 50.
	const resized = tf.image.resizeBilinear(tensor, [50, 50],false, true).toFloat(); // Resize to 50 X 50.
	// const resized = tf.image.resizeBilinear(tensor, [50, 50],true).toFloat(); // Resize to 50 X 50.
	
	// Normalize the image
	const offset = tf.scalar(255.0);
	const normalized = tf.scalar(1.0).sub(resized.div(offset));
	
	const batched = normalized.expandDims(0).min(3,true); // Add a dimension to get a batch shape [n,w,h,1].
	
	return batched; 
}

function canvas_func() {
	
	var canvas;
	var context;
	var ctx;
	const w = 200;
	const h = 200;
	const c = 4;
	const arr = new Uint8ClampedArray(w*h*c);
	var N = 0;
	var C = [];
	var isDrawing;
	
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	ctx = document.getElementById('chart').getContext('2d');
	
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
			arr[i] = 255;
			arr[i + 1] = 255;
			arr[i + 2] = 255;
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
				arr[I] = 0;    // R value
				arr[I + 1] = 0;  // G value
				arr[I + 2] = 0;    // B value
				arr[I + 3] = 255;  // A value
			}
		}
		
		// Initialize a new ImageData object
		let imageData = new ImageData(arr, w);
		document.getElementById("hidden_canvas").getContext('2d').putImageData(imageData, 0, 0);
		
		var dataURL = document.getElementById("hidden_canvas").toDataURL();
		document.getElementById('img_dataset').innerHTML += "<img id='img' src="+dataURL+">";
		
		var img_tf = preprocess(imageData);
		
		const model = await start();
		
		// const result = await model.predict(img_tf).dataSync();
		const result = await model.predict(img_tf);
		// const result = model.predict(img_tf).argMax([-1]);
		
		const result_arr = Array.from(result.dataSync());
		// const result_arr = Array.from(result.round().dataSync());
		
		// console.log(result);
		// console.log(result.round().print());
		console.log(result_arr);
		// console.log(result_arr.indexOf(Math.max(...result_arr)));

		var labels = [];
		for (let i=0; i<result_arr.length; i++) {
			labels.push(i)
		}
		const myChart = new Chart(ctx, {
			type: 'bar',
			// defaults:{global:{tooltips:{caretSize:3}}},
			data: {
				labels: labels,
				yAxisID: 'y',
				datasets: [{
					data: result_arr,
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
					],
					borderWidth: 1
				}]
			},
			options: {
				legend: {
				  display: false
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
							max: 1
						}
					}]
				}
			}
		});
		document.getElementById('img_dataset').innerHTML += result_arr.indexOf(Math.max(...result_arr));
		});
	document.getElementById('send_button').addEventListener("click",  function() {
		var email_adress = 'mailto:avivyuval2004@gmail.com'+'?subject= Add_To_Dataset &body= Your%20contribution%20is%20appreciated';
		console.log(email_adress);
		window.open(email_adress);
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