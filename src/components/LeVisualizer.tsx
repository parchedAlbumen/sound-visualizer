import React, { useState, useEffect, useRef } from "react";

export default function Visualizer() {
    //the stuff we are going to use to manipulate and stuff
    const audRef = useRef<HTMLAudioElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    //file url name thing
    const [url, setUrl] = useState<string>("");

    const ctxRef = useRef<AudioContext | null>(null); //the motherboard
    const analyserRef = useRef<AnalyserNode | null>(null); //where we get the data 
    const srcRef = useRef<MediaElementAudioSourceNode | null>(null); //where the source of data come from
    const rafRef = useRef<number | null>(null); //handle the updates

    const onPick: React.ChangeEventHandler<HTMLInputElement> = (theEvent) => {
        const f = theEvent.target.files?.[0]; //grab the first file (? used to check null)
        if (!f) return; 
        if (url) URL.revokeObjectURL(url); //clear up memory 
        const next = URL.createObjectURL(f); //create a new object url
        setUrl(next);
    };

    useEffect(() => {
        //elements  (now they both shortcuts to access the element tags lol)
        const audioElement = audRef.current; //reference to the <audio>
        const canvasElement = canvasRef.current; //reference to the <canvas> xdxd
        if (!audioElement || !canvasElement) return; //if they null, then return;

        canvasElement.width = 600;
        canvasElement.height = 200;
        const g = canvasElement.getContext("2d"); //for drawing in the canvas
        if (!g) return; 

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext; //grab audio context for old and new versions of browsers
        const ctx = new AudioCtx();
        const analyzer = ctx.createAnalyser(); 
        analyzer.fftSize = 2048; //i think the bin count is half of the fftSize

        //connecting the pieces together basically
        const src = ctx.createMediaElementSource(audioElement); // audio information from <audio> tag
        src.connect(analyzer); //connect the audio information to the analyzer
        analyzer.connect(ctx.destination); //analyzer to speakers

        //basically initializing the node references
        ctxRef.current = ctx; //my current motherboard becomes ctx here
        analyserRef.current = analyzer;
        srcRef.current = src;

        // const freqData = new Uint8Array(analyzer.frequencyBinCount); //special array that holds 8 bits numbers 
        const timeData = new Uint8Array(analyzer.fftSize); //special array that holds byte numbers (0 - 255)
        const freqData = new Uint8Array(analyzer.frequencyBinCount); //returns an array of bincount size that only accepts values from 0 to 255
        //for the size of the circles, we are gonna use loudness, so we want RMS loudness from timeData 
        let smooth = 0; //to avoid radius jittery bs
        
        const draw = () => { //we gonna call this so it constantly updates and stuff
            //the setups
            analyzer.getByteTimeDomainData(timeData); //returns 
            analyzer.getByteFrequencyData(freqData);

            console.log(freqData.length); //1024 in size,,, maybe divide each bins by 64 

            const arr = new Array(64); 

            let sum = 0; 
            for (let i = 0; i < timeData.length; i++) { 
                const v = (timeData[i] - 128)/128 //makes it so that value is between -1 to 1 
                sum += v * v;  //square to get rid of negatives and emphasize on peaks
            }
            const rms = Math.sqrt(sum/timeData.length); //literally "root mean square"
            smooth = smooth * 0.8 + rms * 0.2; //create a more stable radius 
     
            const radius = 20 + smooth * 120; //radius is dependant on the loudness so:

            //the start of actual drawing
            g.clearRect(0,0,canvasElement.width, canvasElement.height);
            const centerY = canvasElement.height / 2;
            const centerX = canvasElement.width / 2;

            //circles need to start path lol
            g.strokeStyle = "red"
            g.beginPath()
            g.moveTo(centerX+radius, centerY);
            g.arc(centerX, centerY, radius, 0, Math.PI * 2);
            g.stroke();

            //tf?
            rafRef.current = requestAnimationFrame(draw); //recall draw so that it keeps updating per animation frame
        };
        //end of useEffect()

        //commands for music controls
        const onPlay = async () => {
            if (ctx.state == "suspended") await ctx.resume(); //if there's no file exisiting, then wait
            if (rafRef.current == null) {
                rafRef.current = requestAnimationFrame(draw); //if the button is clicked, start updating again.
            }
        };

        const onStop = () => { //why is this not on async, is it because we are not checking for any state of some sort?
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            g.clearRect(0, 0, canvasElement.width, canvasElement.height);
        };
        
        audioElement.addEventListener("play", onPlay);
        audioElement.addEventListener("stop", onStop);
        audioElement.addEventListener("pause", onStop);

        return () => {
            onStop();
            audioElement.removeEventListener("play", onPlay);
            audioElement.removeEventListener("stop", onStop);
            audioElement.removeEventListener("pause", onStop); //clean ups basically
            try {src.disconnect(); } catch {}
            try {analyzer.disconnect(); } catch {}
            ctx.close();
        }
    },[]); //why no dependancy?

    return (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: 12 }}>
            <input type="file" accept="audio/*" onChange={onPick} />
            <audio ref={audRef} src={url} controls style={{ width: "100%", marginTop: 8 }} />
            <canvas ref={canvasRef} style={{ display: "block", marginTop: 8, border: "1px solid #333" }} />
        </div>
    )
} 
