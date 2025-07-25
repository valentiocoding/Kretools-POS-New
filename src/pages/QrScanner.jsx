import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export default function QrScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanInterval = useRef(null);
  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState("");
  const lastScanned = useRef("");

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // pakai kamera belakang jika memungkinkan
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        scanInterval.current = setInterval(scanFrame, 500); // scan setiap 0.5 detik
      } catch (err) {
        console.error("Camera error", err);
        setError("❌ Tidak bisa akses kamera");
      }
    };

    startCamera();

    return () => {
      if (scanInterval.current) {
        clearInterval(scanInterval.current);
      }
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const scanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code && code.data !== lastScanned.current) {
      setScanResult(code.data);
      lastScanned.current = code.data;
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">QR Scanner</h1>
      {error && (
        <div className="text-red-500 font-semibold">
          {error}
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md rounded-md border"
      />
      <canvas ref={canvasRef} className="hidden" />

      {scanResult && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md shadow-md max-w-md w-full break-words">
          <strong>Hasil Scan:</strong>
          <div>{scanResult}</div>
        </div>
      )}
    </div>
  );
}
