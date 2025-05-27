import React from "react";

const AnimatedWaveBackground = () => {
  return (
    <>
      {/* Animated Wave Background - Fixed positioning behind content */}
      <div className="wave-container">
        {/* Bottom wave */}
        <svg
          className="wave-bottom"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
            className="wave-path-1"
          />
          <path
            d="M0,80 C300,140 600,-20 1200,80 L1200,120 L0,120 Z"
            className="wave-path-2"
          />
          <path
            d="M0,100 C200,160 400,40 800,100 C1000,140 1100,80 1200,100 L1200,120 L0,120 Z"
            className="wave-path-3"
          />
        </svg>

        {/* Side wave */}
        <svg
          className="wave-side"
          viewBox="0 0 120 800"
          preserveAspectRatio="none"
        >
          <path
            d="M60,0 C0,150 120,350 60,400 C0,450 120,650 60,800 L120,800 L120,0 Z"
            className="wave-path-side-1"
          />
          <path
            d="M40,0 C-20,200 140,400 40,600 C0,700 80,750 40,800 L120,800 L120,0 Z"
            className="wave-path-side-2"
          />
        </svg>

        {/* Corner connector */}
        <div className="wave-corner"></div>
      </div>

      <style jsx>{`
        .wave-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
          pointer-events: none;
        }

        /* Bottom Wave Styles */
        .wave-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 250px;
          transform: rotate(360deg);
        }

        .wave-path-1 {
          fill: rgba(34, 197, 94, 0.8);
          animation: wave-animation-1 8s ease-in-out infinite;
        }

        .wave-path-2 {
          fill: rgba(16, 185, 129, 0.6);
          animation: wave-animation-2 6s ease-in-out infinite reverse;
        }

        .wave-path-3 {
          fill: rgba(5, 150, 105, 0.4);
          animation: wave-animation-3 10s ease-in-out infinite;
        }

        /* Side Wave Styles */
        .wave-side {
          position: absolute;
          right: 0;
          top: 0;
          width: 150px;
          height: 100%;
        }

        .wave-path-side-1 {
          fill: rgba(34, 197, 94, 0.7);
          animation: wave-side-animation-1 7s ease-in-out infinite;
        }

        .wave-path-side-2 {
          fill: rgba(16, 185, 129, 0.5);
          animation: wave-side-animation-2 9s ease-in-out infinite reverse;
        }

        /* Corner connector */
        .wave-corner {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 150px;
          height: 150px;
          background: radial-gradient(
            circle at top left,
            rgba(34, 197, 94, 0.8) 0%,
            rgba(16, 185, 129, 0.6) 50%,
            transparent 70%
          );
          border-radius: 100% 0 0 0;
          animation: pulse 4s ease-in-out infinite;
        }

        /* Wave Animations */
        @keyframes wave-animation-1 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px);
          }
          50% {
            transform: translateX(-25px) translateY(-10px);
          }
        }

        @keyframes wave-animation-2 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px);
          }
          50% {
            transform: translateX(25px) translateY(-15px);
          }
        }

        @keyframes wave-animation-3 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px);
          }
          50% {
            transform: translateX(-20px) translateY(-8px);
          }
        }

        @keyframes wave-side-animation-1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes wave-side-animation-2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(15px) translateX(-8px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        /* Body override styles */
        body {
          background: #ffffff !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .wave-bottom {
            height: 100px;
          }

          .wave-side {
            width: 100px;
          }

          .wave-corner {
            width: 100px;
            height: 100px;
          }
        }

        @media (max-width: 480px) {
          .wave-bottom {
            height: 80px;
          }

          .wave-side {
            width: 80px;
          }

          .wave-corner {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedWaveBackground;