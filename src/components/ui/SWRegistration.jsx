"use client";
import { useEffect } from "react";

export default function SWRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker
          .register("/sw.js")
          .then(function (reg) {
            console.log("SW registered:", reg.scope);
          })
          .catch(function (err) {
            console.log("SW registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
