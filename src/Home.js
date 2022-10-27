import { useState, useEffect, useRef } from "react";
// import React from "react";
import BlogList from "./blogList";
import useFetch from "./useFetch";
import * as tfjs from "@tensorflow/tfjs";
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import CanvasDraw from "react-canvas-draw";
import Preprocess from "./Preprocess";
import AddPoints from "./AddPoints";
import ExportData from "./Components/ExportData";

const Canvas = CanvasDraw;

const Home = () => {
  const [canvasData, setCanvasData] = useState(null);
  const [model, setModel] = useState(null);
  const [barYData, setBarYData] = useState([0,0]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const LoadModel = async () => {
      var model0 = undefined;
      model0 = await tfjs.loadLayersModel('https://raw.githubusercontent.com/AvivYuval/hebrew_letter_classification/main/files/pretrained_models/model.json');
      setModel(model0);
    }
    LoadModel();
  }, []);

  const predict = async () => {
    let canvas = canvasData.canvas.drawing;
    // let context = canvas.getContext("2d")

    var [ImageData, lines] = AddPoints(canvasData.lines, canvas.width, canvas.height);

    var img_tf = Preprocess(ImageData);
    
    setData([...data, {coordinates: lines, class: 0}]);
    console.log(data);

    var result = await model.predict(img_tf);
    const result_arr = Array.from(result.dataSync());

    setBarYData(result_arr);

    // var dataURL = document.getElementById("hidden_canvas").toDataURL();
		// document.getElementById('img_dataset').innerHTML += "<img id='img' src="+dataURL+">";
  }


  const canvas_params = {
    color: "#000",
    width: 200,
    height: 200,
    brushRadius: 4,
    lazyRadius: 0
  };

  const barData = {
    labels: ['A', 'B'],
    datasets: [
      {
        label: 'Rainfall',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: barYData
      }
    ]
  };
  
  const barOptions = {
    title: {
      display: true,
      text: 'Average Rainfall per month',
      fontSize: 20
    },
    legend: {
      display: true,
      position: 'right'
    },
    maintainAspectRatio: false
  };
  
  /*
  [
    { imageData: img, pathData: [[], [], []] },
    { imageData: img, pathData: [[], [], []] },
    { imageData: img, pathData: [[], [], []] }
  ]


  addSample () => {
    setData();
  }



  
      <Button onclick={addSample()}></Button>

      <Samples data={data}/>



      { error && <div>{ error }</div>}
      { isPending && <div>loading...</div> }
      {blogs && <BlogList blogs={blogs} title="All Blogs!" />}
  */
  
  
  // const { data: blogs, isPending, error} = useFetch('http://localhost:8000/blogs');
  const chartRef = useRef();
  /*
  const onClick = (event) => {
    console.log(getDatasetAtEvent(chartRef.current, event));
  }
  */
//       <canvas id="hidden_canvas" width="200" height="200"></canvas>

  return (
    <div className="home">
      
      <div className="main_wrapper">
        <div className="canvas_wrapper">
          <Canvas
            ref={canvasDraw => setCanvasData(canvasDraw)}
            className="canvas"
            loadTimeOffset={50}
            brushColor={canvas_params.color}
            canvasWidth={canvas_params.width}
            canvasHeight={canvas_params.height}
            brushRadius={canvas_params.brushRadius}
            lazyRadius={canvas_params.lazyRadius}
          />

          <button onClick={predict}>Predict</button>
          <button onClick={(e) => ExportData(data)}>Download</button>
        </div>
        
        <div className="bar_wrapper">
          <Bar className="barChart" ref={chartRef} data={barData} options={barOptions}/>
        </div>
      </div>


      <div id="img_dataset"></div>
    </div>
  );
}
 
export default Home;