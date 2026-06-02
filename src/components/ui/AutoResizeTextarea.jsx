"use client";
import { useEffect, useRef } from "react";

export default function AutoResizeTextarea({ value, onChange, placeholder, className, rows = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{ resize: "none", overflow: "hidden" }}
    />
  );
}
