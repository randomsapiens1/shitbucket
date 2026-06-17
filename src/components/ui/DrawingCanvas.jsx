"use client";
import { useRef, useState, useEffect } from "react";

export default function DrawingCanvas({ initialData, onSave, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Set initial background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Load initial data if exists
    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        saveToHistory();
      };
      img.src = initialData;
    } else {
      saveToHistory();
    }

    // Set line styles
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, dataUrl];
    });
    setHistoryIndex(prev => prev + 1);
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    loadFromHistory(newIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    loadFromHistory(newIndex);
  };

  const loadFromHistory = (index) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
    img.src = history[index];
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? "#ffffff" : color;
    ctx.lineWidth = lineWidth;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveToHistory();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFF8EE] border-2 border-black rounded-3xl w-full max-w-lg overflow-hidden shadow-hard-lg">
        {/* Header */}
        <div className="bg-white border-b-2 border-black p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-extrabold uppercase tracking-tight text-sm">Sketch Pad</span>
            <div className="flex gap-1 border-l-2 border-black/10 pl-4">
              <button 
                onClick={undo} 
                disabled={historyIndex <= 0}
                className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-colors disabled:opacity-20"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v6h6" />
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                </svg>
              </button>
              <button 
                onClick={redo} 
                disabled={historyIndex >= history.length - 1}
                className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-colors disabled:opacity-20"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 7v6h-6" />
                  <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
                </svg>
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-black/30 hover:text-black font-bold text-xl">×</button>
        </div>

        {/* Canvas Area */}
        <div className="p-4">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ 
              cursor: isEraser 
                ? "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size: 24px'><text y='20'>🧽</text></svg>\") 0 20, auto"
                : "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size: 24px'><text y='20'>✏️</text></svg>\") 0 20, auto"
            }}
            className="w-full aspect-square bg-white border-2 border-black rounded-2xl touch-none shadow-inner"
          />
        </div>

        {/* Toolbar */}
        <div className="p-4 pt-0 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 p-1 bg-white border-2 border-black rounded-full shadow-hard-sm">
                {["#000000", "#FF6A00", "#0066FF", "#FF3300"].map(c => (
                  <button
                    key={c}
                    onClick={() => { setColor(c); setIsEraser(false); }}
                    className={`w-7 h-7 rounded-full border-2 border-black transition-all ${color === c && !isEraser ? "scale-105" : "opacity-30 hover:opacity-100"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <div className="w-px h-5 bg-black/10 self-center mx-0.5" />
                <button
                  onClick={() => setIsEraser(!isEraser)}
                  className={`w-7 h-7 rounded-full border-2 border-black flex items-center justify-center transition-all ${isEraser ? "bg-black text-white" : "bg-white text-black opacity-30 hover:opacity-100"}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                    <path d="M22 21H7" />
                    <path d="m5 11 9 9" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white border-2 border-black rounded-xl px-3 py-1.5 shadow-hard-sm">
              <span className="text-[9px] font-black uppercase text-black/30">Size</span>
              <input 
                type="range" min="1" max="30" 
                value={lineWidth} 
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="accent-black w-24 h-1.5"
              />
              <span className="text-[10px] font-black w-4">{lineWidth}</span>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleClear}
              className="flex-1 bg-white border-2 border-black rounded-xl py-3 font-extrabold text-[10px] uppercase tracking-[0.2em] shadow-hard-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:bg-red-50"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="flex-[2] bg-black text-white border-2 border-black rounded-xl py-3 font-extrabold text-[10px] uppercase tracking-[0.2em] shadow-hard-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:bg-[#FF6A00]"
            >
              Save Sketch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

