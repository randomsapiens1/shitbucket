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

            // Check for updates
            reg.addEventListener("updatefound", () => {
              const newWorker = reg.installing;
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New version available, force reload
                  window.location.reload();
                }
              });
            });
          })
          .catch(function (err) {
            console.log("SW registration failed:", err);
          });
      });

      // Handle controller change (e.g. skipWaiting)
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    }
  }, []);


  return null;
}
