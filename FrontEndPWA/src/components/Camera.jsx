import React, { useEffect, useRef, useState } from "react";

const Camera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [facingMode, setFacingMode] = useState('environment'); // 'environment' for back, 'user' for front
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

    // Check if device is mobile and has multiple cameras
    useEffect(() => {
        // Check if mobile device
        const checkMobile = () => {
            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsMobile(isMobileDevice);
        };

        // Check for multiple cameras
        const checkCameras = async () => {
            if (!navigator.mediaDevices?.enumerateDevices) {
                return;
            }

            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setHasMultipleCameras(videoDevices.length > 1);
            } catch (err) {
                console.error('Error checking cameras:', err);
            }
        };

        checkMobile();
        checkCameras();
    }, []);

    // Stop camera function
    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsCameraOn(false);
        }
    };

    // Switch camera function
    const switchCamera = async () => {
        stopCamera();
        setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
        await startCamera(prevMode => prevMode === 'user' ? 'environment' : 'user');
    };

    // Start Camera
    const startCamera = async (requestedFacingMode = facingMode) => {
        setIsLoading(true);
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: requestedFacingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            videoRef.current.srcObject = stream;
            setIsCameraOn(true);
        } catch (error) {
            setError("Unable to access camera. Please make sure you've granted permission.");
            console.error("Error accessing camera:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Capture Image
    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        
        // Flip the image horizontally if using front camera
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL("image/png"));
    };

    return (
        <div className="min-h-screen bg-gray-100 pt-16 px-4">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                        <span className="mr-2">Camera</span>
                        <span className="text-3xl">📸</span>
                    </h1>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Camera Selection for Mobile */}
                    {isMobile && hasMultipleCameras && (
                        <div className="mb-4 flex justify-center">
                            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                                <button
                                    onClick={() => {
                                        setFacingMode('environment');
                                        if (isCameraOn) {
                                            switchCamera();
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                        facingMode === 'environment'
                                            ? 'bg-white shadow text-indigo-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Back Camera
                                </button>
                                <button
                                    onClick={() => {
                                        setFacingMode('user');
                                        if (isCameraOn) {
                                            switchCamera();
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                        facingMode === 'user'
                                            ? 'bg-white shadow text-indigo-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Front Camera
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Camera Preview Container */}
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className={`w-full h-full object-cover ${
                                isCameraOn ? 'opacity-100' : 'opacity-0'
                            } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                        />
                        
                        {!isCameraOn && !isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                                <span>Camera is off</span>
                            </div>
                        )}

                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                            </div>
                        )}
                    </div>

                    {/* Camera Controls */}
                    <div className="mt-4 flex justify-center space-x-4">
                        <button
                            onClick={isCameraOn ? stopCamera : () => startCamera()}
                            className={`px-6 py-2 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                                isCameraOn 
                                    ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white' 
                                    : 'bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white'
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Starting...' : isCameraOn ? 'Stop Camera' : 'Start Camera'}
            </button>

                        {isCameraOn && (
                            <button
                                onClick={capturePhoto}
                                className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-all"
                            >
                                Capture
                            </button>
                        )}
                    </div>

                    {/* Captured Image Preview */}
                    {capturedImage && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Captured Photo</h3>
                            <div className="relative rounded-lg overflow-hidden">
                                <img 
                                    src={capturedImage} 
                                    alt="Captured" 
                                    className={`w-full rounded-lg shadow-sm ${
                                        facingMode === 'user' ? 'scale-x-[-1]' : ''
                                    }`}
                                />
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={() => setCapturedImage(null)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.download = 'captured-photo.png';
                                    link.href = capturedImage;
                                    link.click();
                                }}
                                className="mt-3 w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 font-medium transition-all"
                            >
                                Download Photo
            </button>
                        </div>
                    )}
                </div>

            <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </div>
    );
};

export default Camera;
