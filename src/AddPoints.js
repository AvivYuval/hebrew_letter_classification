const AddPoints = (lines, w, h) => {
	const c = 4;
	const arr = new Uint8ClampedArray(w*h*c);
	const Ni = 10;

	// console.log(lines);

	for (let i = 0; i < arr.length; i+=4) {
		arr[i] = 255;
		arr[i + 1] = 255;
		arr[i + 2] = 255;
		arr[i + 3] = 255;
	}
	// Loop over each line object
	for (let o=0; o<lines.length; o++) {
	
		// Round all coordinates
		for (let i=0; i<lines[o].points.length; i++) {
			lines[o].points[i].x = Math.round(lines[o].points[i].x);
			lines[o].points[i].y = Math.round(lines[o].points[i].y);
		}
		
		let X_avrg;
		let Y_avrg;
		
		// Make the coordinates arrays denser
		for (let j = 0; j <= Ni; j++) {
			let points = [];
			let X_arr = [];
			let Y_arr = [];
			let n = lines[o].points.length;
			
			for (let i=0; i<n-1; i++) {
				X_avrg = Math.round((lines[o].points[i].x + lines[o].points[i+1].x) / 2);
				Y_avrg = Math.round((lines[o].points[i].y + lines[o].points[i+1].y) / 2);
				
				points.push({x: lines[o].points[i].x, y: lines[o].points[i].y});
				// X_arr.push(Math.round(lines[o].points[i].x));
				// Y_arr.push(Math.round(lines[o].points[i].y));
				
				if (lines[o].points[i].x != X_avrg || lines[o].points[i].y != Y_avrg) {
					points.push({x: X_avrg, y: Y_avrg});
					// X_arr.push(X_avrg);
					// Y_arr.push(Y_avrg);
				}
			}
			
			// Add the last coordinate
			points.push({x: lines[o].points[n-1].x, y: lines[o].points[n-1].y});
			// X_arr.push(lines[o].points[n-1].x);
			// Y_arr.push(lines[o].points[n-1].y);
			
			// Update the original coordinates
			lines[o].points = points;
			// C[o].x = X_arr;
			// C[o].y = Y_arr;
		}
		
		let n = lines[o].points.length;
		
		for (let i = 0; i < n; i++) {
			let I = (lines[o].points[i].x + lines[o].points[i].y*w) * c;
			arr[I] = 0;    // R value
			arr[I + 1] = 0;  // G value
			arr[I + 2] = 0;    // B value
			arr[I + 3] = 255;  // A value
		}
	}
	return [new ImageData(arr, w), lines];
}
 
export default AddPoints;