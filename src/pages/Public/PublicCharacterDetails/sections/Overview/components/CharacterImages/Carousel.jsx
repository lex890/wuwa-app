import { useState } from "react"

function Carousel({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) return null

  return (
    <>
      <div className="carousel">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-item ${
              index === activeIndex ? 'active' : ''
            }`}
          >
            <img src={image} alt="" />
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${
              index === activeIndex ? 'active' : ''
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </>
  )
}
export default Carousel