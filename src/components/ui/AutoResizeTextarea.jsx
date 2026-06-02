"use client";
import { useLayoutEffect, useRef } from "react";

export default function AutoResizeTextarea({ value, onChange, className, style, ...props }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (textarea) {
      // Preserve selection for some browsers that lose it on height change
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;

      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;

      textarea.setSelectionRange(selectionStart, selectionEnd);
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      className={className}
      value={value}
      onChange={onChange}
      style={{ 
        resize: "none", 
        overflow: "hidden",
        display: "block",
        ...style 
      }}
      {...props}
    />
  );
}
