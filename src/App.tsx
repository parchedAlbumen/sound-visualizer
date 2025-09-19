import './App.css';
import { useState, useEffect, useRef } from 'react';
import visualizer from './components/LeVisualizer';
import Visualizer from './components/LeVisualizer';

type buttonProp = {
  label: string;
  onClick: () => void;  
};

function LeButton({ label, onClick }: buttonProp) {
  return <button onClick={onClick}>{label}</button>
}

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  //useEffect to log the count whenever it changes
  useEffect(() => {console.log(`Count is now: ${count}`)} , [count]); //runs when 'count' changes
  return (
      <div style={{
        textAlign: "center",
        marginTop: "40px",
      }}> 

      <h2>hello visualizer</h2>
      <Visualizer></Visualizer>

      {/* <h1>Form Example</h1>
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='       Type something...' 
      />
      <p>You typed: {text}</p>       */}

      {/* <h1>Le button example</h1>
      <p>Count: {count}</p>
      <LeButton label="+1" onClick={() => setCount(count + 1)} />
      <LeButton label="-1" onClick={() => setCount(count - 1)} /> */}
    </div>
  );
}

export default App;