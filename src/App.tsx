import './App.css';
import { useState, useEffect } from 'react';
import LogButton from './components/LogButton';

type aProp = {name: string}; //create a blueprint with a variable with type string

type buttonProp = {
  label: string;
  onClick: () => void;  
};

function Greeting({name}: aProp) {
  return <h2>Hello, {name}!</h2>
}

function LeButton({ label, onClick }: buttonProp) {
  return <button onClick={onClick}>{label}</button>
}

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  //useEffect to log the count whenever it changes
  useEffect(() => {console.log(`Count is now: ${count}`)} , [count]); //runs when 'count' changes
  const fruits = ["apple", "banana", "cherry"];
  const listItems = fruits.map((f, i) => <li key={i}>{f}</li>)
  return (
    <div style={{
      textAlign: "center",
      marginTop: "40px",
      }}> 

      <ul>
        {listItems}
      </ul>
      {/*double {} because it expects an object*/}
      <h1>Hello React + Typescript!</h1>
      <Greeting name="James Charles" />
      <Greeting name="Kobe Bryan" />

      {isLightMode ? <p>Light Mode</p> : <p>Dark Mode</p>}
      <LogButton label="change mode" onClick={() => setIsLightMode(!isLightMode)} />

      {/* <h1>Form Example</h1>
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='       Type something...' 
      />
      <p>You typed: {text}</p> */}
      
      <h1>Le button example</h1>
      <p>Count: {count}</p>
      <LeButton label="+1" onClick={() => setCount(count + 1)} />
      <LeButton label="-1" onClick={() => setCount(count - 1)} />
    </div>
  );
}

export default App;