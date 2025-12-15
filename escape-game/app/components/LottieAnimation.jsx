"use client";

import Lottie from "lottie-react";
import { useRef } from "react";

export default function LottieAnimation({
    animationData,
    className = "",
}) {
    const lottieRef = useRef(null);

    const handleMouseEnter = () => {
        if (!lottieRef.current) return;

        lottieRef.current.stop();   // reset
        lottieRef.current.play();   // play depuis le début
    };

    const handleMouseLeave = () => {
        if (!lottieRef.current) return;

        lottieRef.current.stop();   // stop à la sortie du hover
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={className}
        >
            <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop={true}
                autoplay={false}
            />
        </div>
    );
}
