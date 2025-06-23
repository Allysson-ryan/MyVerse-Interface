import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomCarousel = ({ children }) => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToItem = (index) => {
    const container = carouselRef.current;
    const items = container.querySelectorAll(".carousel-item");

    if (items[index]) {
      items[index].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  const handleScroll = (direction) => {
    const totalItems = React.Children.count(children);
    let newIndex = currentIndex;

    if (direction === "left" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === "right" && currentIndex < totalItems - 1) {
      newIndex = currentIndex + 1;
    }

    setCurrentIndex(newIndex);
    scrollToItem(newIndex);
  };

  return (
    <div className="relative w-full">
      {/* Botão esquerdo */}
      <button
        onClick={() => handleScroll("left")}
        className="absolute left-0 top-2/4 z-10 -translate-y-1/6 max-sm:w-[30px] max-sm:h-[30px] flex items-center justify-center border-1 border-black bg-white hover:bg-brandsoftgray hover:border-0 p-2 rounded-full"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Carrossel */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto overflow-y-visible scroll-smooth no-scrollbar px-10"
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} className="flex-shrink-0 carousel-item">
            {child}
          </div>
        ))}
      </div>

      {/* Botão direito */}
      <button
        onClick={() => handleScroll("right")}
        className="absolute right-0 top-2/4 z-10 -translate-y-1/6 max-sm:w-[30px] max-sm:h-[30px] flex items-center justify-center border-1 border-black bg-white hover:bg-brandsoftgray hover:border-0 p-2 rounded-full"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default CustomCarousel;
