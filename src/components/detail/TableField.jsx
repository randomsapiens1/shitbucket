"use client";
import { useState } from "react";

export default function TableField({ value, onUpdate }) {
  // value is expected to be { headers: [], rows: [[]] }
  const data = value || { headers: ["Item", "Cost"], rows: [["", ""]] };
  
  const updateData = (newData) => {
    onUpdate(newData);
  };

  const setHeader = (idx, val) => {
    const next = { ...data, headers: [...data.headers] };
    next.headers[idx] = val;
    updateData(next);
  };

  const setCell = (rowIdx, colIdx, val) => {
    const next = { ...data, rows: data.rows.map((r, ri) => ri === rowIdx ? r.map((c, ci) => ci === colIdx ? val : c) : r) };
    updateData(next);
  };

  const addRow = () => {
    const next = { ...data, rows: [...data.rows, Array(data.headers.length).fill("")] };
    updateData(next);
  };

  const addCol = () => {
    const next = {
      headers: [...data.headers, `Col ${data.headers.length + 1}`],
      rows: data.rows.map(r => [...r, ""])
    };
    updateData(next);
  };

  const removeRow = (idx) => {
    if (data.rows.length <= 1) return;
    const next = { ...data, rows: data.rows.filter((_, i) => i !== idx) };
    updateData(next);
  };

  const removeCol = (idx) => {
    if (data.headers.length <= 1) return;
    const next = {
      headers: data.headers.filter((_, i) => i !== idx),
      rows: data.rows.map(r => r.filter((_, i) => i !== idx))
    };
    updateData(next);
  };

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {data.headers.map((h, i) => (
              <th key={i} className="p-1 min-w-[80px]">
                <div className="flex flex-col gap-1">
                  <input
                    className="w-full bg-black text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded outline-none text-center"
                    value={h}
                    onChange={(e) => setHeader(i, e.target.value)}
                  />
                  <button onClick={() => removeCol(i)} className="text-[10px] text-black/20 hover:text-red-500 font-bold">del col</button>
                </div>
              </th>
            ))}
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="p-1">
                  <input
                    className="w-full bg-[#FFF8EE] border-2 border-black/10 focus:border-black rounded-lg px-2 py-1.5 text-xs font-bold text-black outline-none transition"
                    value={cell}
                    onChange={(e) => setCell(ri, ci, e.target.value)}
                  />
                </td>
              ))}
              <td className="p-1">
                <button onClick={() => removeRow(ri)} className="text-black/20 hover:text-red-500 font-bold text-lg leading-none">×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 mt-2">
        <button
          onClick={addRow}
          className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all"
        >
          + row
        </button>
        <button
          onClick={addCol}
          className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all"
        >
          + col
        </button>
      </div>
    </div>
  );
}
