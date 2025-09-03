import { createContext, useEffect, useRef } from "react";

function TheCanvas() {
    //just basically means can either be a canvas type or null 
    const canvasRef = useRef<HTMLCanvasElement | null>(null); //create a ref to hold the CANVAS DOM element 

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; //make sure it's not null and it's actually a canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let x = 0;
        let y = 2;
        function draw() {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            ctx.fillStyle = "purple";
            ctx.fillRect(x,50,50,50);
            x += y;
            if (x == canvas.width - 50) y = -2; //resets the count
            if (x == 0) y = 2;
            requestAnimationFrame(draw); //this loops this
        }
        draw();
    }, []);

    return  <canvas ref={canvasRef} width={400} height={400} style={{border: "1px solid black"}} />;
}

export default TheCanvas;