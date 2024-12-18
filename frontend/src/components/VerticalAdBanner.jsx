import React from "react";

import AdImage1 from "../images/commercial_1.jpg";
import AdImage2 from "../images/commercial_2.jpg";
import AdImage3 from "../images/commercial_3.jpg";
import AdImage4 from "../images/commercial_4.jpg";
import AdImage5 from "../images/commercial_5.jpg";
import AdImage6 from "../images/commercial_6.jpg";

const VerticalAdBanner = () => {
  const images = [AdImage1, AdImage2, AdImage3, AdImage4, AdImage5, AdImage6];

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-200 relative">
      <div className="flex flex-col animate-scroll-vertical">
        {/* Lặp lại mảng ảnh hai lần để tạo hiệu ứng cuộn liên tục */}
        {[...images, ...images, ...images].map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Quảng cáo ${index + 1}`}
            className="w-full h-120 object-cover"
          />
        ))}
      </div>
    </div>
  );
};

export default VerticalAdBanner;
