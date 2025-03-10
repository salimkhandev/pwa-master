import React, { useRef, useState } from "react";

const Camera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    // Start Camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    // Capture Image
    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL("image/png"));
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-xl font-bold mb-4">PWA Camera App 📸</h1>

            {/* Video Preview */}
            <video ref={videoRef} autoPlay playsInline className="border rounded-lg w-full max-w-md" />

            {/* Capture Button */}
            <button onClick={capturePhoto} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                Capture Photo
            </button>

            {/* Captured Image */}
            {capturedImage && <img src={capturedImage} alt="Captured" className="mt-4 border rounded-lg" />}

            {/* Start Camera Button */}
            <button onClick={startCamera} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
                Start Camera
            </button>

            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default Camera;
