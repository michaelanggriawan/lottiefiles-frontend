import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { Data } from '@lottiefiles/dotlottie-react';
import { XIcon } from "@heroicons/react/solid";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  animationData: Data;
  title: string;
  author: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, animationData, title, author }) => {
  const [dotLottie, setDotLottie] = useState<any>(null);
  const [status, setStatus] = useState("idle");
  const [currentFrame, setCurrentFrame] = useState(0);

  const totalFrames = dotLottie?.isLoaded ? dotLottie.totalFrames : 0;
  const progress = dotLottie?.isLoaded ? (currentFrame / totalFrames) * 100 : 0;

  useEffect(() => {
    const onFrameChange = (event: any) => setCurrentFrame(event.currentFrame);
    const onPlay = () => setStatus("playing");
    const onPause = () => setStatus("paused");
    const onStop = () => setStatus("stopped");
    const onComplete = () => setStatus("completed");

    if (dotLottie) {
      dotLottie.addEventListener("frame", onFrameChange);
      dotLottie.addEventListener("play", onPlay);
      dotLottie.addEventListener("pause", onPause);
      dotLottie.addEventListener("stop", onStop);
      dotLottie.addEventListener("complete", onComplete);
    }

    return () => {
      if (dotLottie) {
        dotLottie.removeEventListener("frame", onFrameChange);
        dotLottie.removeEventListener("play", onPlay);
        dotLottie.removeEventListener("pause", onPause);
        dotLottie.removeEventListener("stop", onStop);
        dotLottie.removeEventListener("complete", onComplete);
      }
    };
  }, [dotLottie]);

  const playOrPause = () => {
    if (dotLottie) {
      if (status === "playing") {
        dotLottie.pause();
      } else {
        dotLottie.play();
      }
    }
  };

  const onSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFrame = (+event.target.value / 100) * totalFrames;
    dotLottie.setFrame(newFrame);
  };

  const onSeekStart = () => {
    if (status === "playing") {
      dotLottie.pause();
    }
  };

  const onSeekEnd = () => {
    if (status !== "playing") {
      dotLottie.play();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 relative max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          <XIcon className="w-5 h-5" />
        </button>
        <h2 className="text-gray-500 text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-500 mb-4">{author}</p>
        <DotLottieReact
          dotLottieRefCallback={setDotLottie}
          data={animationData}
          style={{ width: '100%', height: 'auto' }}
        />
        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={playOrPause}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-2"
          >
            {status === "playing" ? "Pause" : "Play"}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            step="0.01"
            value={progress}
            onChange={onSeek}
            onMouseDown={onSeekStart}
            onMouseUp={onSeekEnd}
            className="w-full"
          />
          <span className="mt-2">
            {Math.round(currentFrame)}/{totalFrames}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Modal;
