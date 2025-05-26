// // import logo from './logo.svg';
// // import './App.css';

// // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;

// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [length, setLength] = useState('');
//   const [width, setWidth] = useState('');
//   const [height, setHeight] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [cbm, setCbm] = useState(null);
//   const [suggestedContainer, setSuggestedContainer] = useState('');

//   const calculateCBM = async () => {
//     try {
//       const res = await axios.post('http://localhost:5000/api/calculate-cbm', {
//         length, width, height, quantity,
//       });

//       setCbm(res.data.cbm);
//       setSuggestedContainer(res.data.suggestedContainer);
//     } catch (err) {
//       alert('Error calculating CBM');
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Sea Freight Load Calculator</h1>
//       <input type="number" placeholder="Length (cm)" onChange={(e) => setLength(e.target.value)} />
//       <input type="number" placeholder="Width (cm)" onChange={(e) => setWidth(e.target.value)} />
//       <input type="number" placeholder="Height (cm)" onChange={(e) => setHeight(e.target.value)} />
//       <input type="number" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
//       <button onClick={calculateCBM}>Calculate</button>

//       {cbm && (
//         <div>
//           <p><strong>Total CBM:</strong> {cbm} m³</p>
//           <p><strong>Suggested Container:</strong> {suggestedContainer}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// React Frontend: Advanced Sea Freight Load Calculator with Items Table
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import ThreeDVisualizer from './ThreeDVisualizer';
function App() {
  const [container, setContainer] = useState({
    length: 5895,
    width: 2350,
    height: 2392,
    maxWeight: 28230,
  });
  const [items, setItems] = useState([
    { name: 'Box', length: 500, width: 500, height: 500, weight: 50, count: 100, color: 'blue' },
  ]);
  const [result, setResult] = useState(null);

  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { name: 'Box', length: 500, width: 500, height: 500, weight: 50, count: 1, color: 'blue' }]);
  };

  const calculate = async () => {
    const res = await axios.post('http://localhost:5000/api/calculate', {
      container,
      items,
    });
    setResult(res.data);
  };

  return (
    <div className="App">
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Sea Freight Load Calculator</h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {['length', 'width', 'height', 'maxWeight'].map((key) => (
          <input
            key={key}
            type="number"
            placeholder={`${key} (${key === 'maxWeight' ? 'kg' : 'mm'})`}
            value={container[key]}
            onChange={(e) => setContainer({ ...container, [key]: Number(e.target.value) })}
            className="p-2 rounded bg-gray-800 text-white w-full"
          />
        ))}
      </div>

      <table className="w-full mb-4">
        <thead>
          <tr className="bg-gray-700">
            <th>Name</th><th>Length</th><th>Width</th><th>Height</th><th>Weight</th><th>Count</th><th>Color</th><th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              {['name', 'length', 'width', 'height', 'weight', 'count'].map((field) => (
                <td key={field}><input type="text" value={item[field]} onChange={(e) => updateItem(index, field, field === 'name' ? e.target.value : Number(e.target.value))} className="p-1 w-full bg-gray-900 text-white" /></td>
              ))}
              <td>
                <select value={item.color} onChange={(e) => updateItem(index, 'color', e.target.value)} className="bg-gray-900 text-white">
                  <option value="blue">blue</option>
                  <option value="red">red</option>
                  <option value="green">green</option>
                  <option value="yellow">yellow</option>
                </select>
              </td>
              <td><button onClick={() => removeItem(index)} className="bg-red-600 px-2 rounded">x</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-4">
        <button onClick={addItem} className="bg-green-600 px-4 py-2 rounded">Add Item</button>
        <button onClick={calculate} className="bg-green-700 px-4 py-2 rounded">Visualize Container Load</button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2">Summary</h2>
          <p><strong>Container (L×W×H):</strong> {container.length} × {container.width} × {container.height} mm</p>
          <p><strong>Max Weight:</strong> {container.maxWeight} kg</p>
          <p><strong>Total Volume:</strong> {result.totalVolume.toFixed(2)} m³</p>
          <p><strong>Container Volume:</strong> {result.containerVolume.toFixed(2)} m³</p>
          <p><strong>Fits by Volume?</strong> {result.fitsByVolume ? '✅' : '❌'}</p>
          <p><strong>Total Weight:</strong> {result.totalWeight.toFixed(2)} kg</p>
          <p><strong>Fits by Weight?</strong> {result.fitsByWeight ? '✅' : '❌'}</p>
        </div>
      )}
    </div>
    <div className="mt-8">
      <h2 className="text-xl mb-4">3D Visualization</h2>
      {/* <ThreeDVisualizer container={container} items={items} /> */}
      {result && (
  <> 
    <div className="mt-6 p-4 bg-gray-800 rounded">
      {/* Summary content */}
    </div>

    <div className="mt-6">
      <ThreeDVisualizer container={container} items={items} />
    </div>
  </>
)}
    </div></div>
  );
}

export default App;

