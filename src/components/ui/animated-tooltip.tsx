"use client";

import React from "react";

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
    scale?: number;
  }[];
}) => {
  return (
    <div className="flex items-center flex-wrap gap-y-2">
      {items.map((item, index) => (
        <div 
          className="group relative" 
          key={item.name}
          style={{ marginLeft: index > 0 ? '-8px' : '0' }}
        >
          <div className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-gray-100 bg-white">
            <img
              height={100}
              width={100}
              src={item.image}
              alt={item.name}
              style={{ transform: `scale(${item.scale || 1.5})` }}
              className="relative !m-0 h-full w-full object-cover object-center !p-0 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
