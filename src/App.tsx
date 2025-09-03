import './App.css';
import { useState, useEffect } from 'react';
import LogButton from './components/LogButton';
import TheCanvas from './components/LeCanvas';

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
  //useEffect to log the count whenever it changes
  useEffect(() => {console.log(`Count is now: ${count}`)} , [count]); //runs when 'count' changes
  return (
      <div style={{
        textAlign: "center",
        marginTop: "40px",
      }}> 

      <h1>The beginning of a legendary journey</h1>
      <audio id='player' controls style={{ width: '100%'}} />
      <input
        type='file'
        accept='audio/*' //what
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          const el = document.getElementById('player') as HTMLAudioElement | null;
          if (el) el.src = url;
        }}
      />
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