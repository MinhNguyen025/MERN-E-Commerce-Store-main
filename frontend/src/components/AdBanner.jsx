import React from "react";

import AdImage1 from "../images/commercial_1.jpg";
import AdImage2 from "../images/commercial_2.jpg";
import AdImage3 from "../images/commercial_3.jpg";
import AdImage4 from "../images/commercial_4.jpg";
import AdImage5 from "../images/commercial_5.jpg";
import AdImage6 from "../images/commercial_6.jpg";
const AdBanner = () => {
    const images = [AdImage1, AdImage2, AdImage3, AdImage4, AdImage5, AdImage6];
  
    return (
      <div className="overflow-hidden w-full h-40 bg-gray-200 mt-4 mb-8">
        <div className="flex animate-scroll">
          {/* Lặp lại mảng ảnh hai lần để tạo hiệu ứng trượt liên tục */}
          {[...images, ...images].map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Quảng cáo ${index + 1}`}
              className="w-1/6 h-40 object-cover"
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default AdBanner;