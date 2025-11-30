import { useEffect, useState } from "react";
import RobotLogo from "./RobotLogo";
import "./Preloader.css";

/**
 * Preloader component that displays a loading animation with progress bar.
 * Shows animated robot logo and loading progress percentage.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onComplete - Callback function called when loading completes
 */
export default function Preloader({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [showText, setShowText] = useState(true);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        if (onComplete) onComplete();
                    }, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="preloader">
            <div className="preloader-content">
                <div className="preloader-robot">
                    <RobotLogo 
                        animated={true} 
                        size="medium" 
                        showText={false}
                        autoPlay={true}
                    />
                </div>
                {showText && (
                    <div className="preloader-text">
                        <div className="loading-text">Loading...</div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="progress-percent">{progress}%</div>
                    </div>
                )}
            </div>
        </div>
    );
}

