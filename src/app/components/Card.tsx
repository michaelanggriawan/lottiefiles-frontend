import React from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { Data } from '@lottiefiles/dotlottie-react';
import { DownloadIcon } from "@heroicons/react/solid";

type CardProps = {
  author: string;
  title: string;
  data: Data;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ author, title, data, onClick }) => {
  const handleDownload = (event: React.MouseEvent) => {
    event.stopPropagation();
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="cursor-pointer p-4 bg-white border rounded-lg shadow-md flex flex-col items-center relative" onClick={onClick}>
      <DotLottieReact
        data={data}
        loop
        autoplay
        style={{ width: 200, height: 200 }}
      />
      <div className="text-center mt-4">
        <p className="text-gray-500 font-semibold text-lg">{title}</p>
        <p className="text-gray-500">{author}</p>
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center justify-center"
        style={{ position: "relative", marginTop: "8px" }}
      >
        <DownloadIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Card;
