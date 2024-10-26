import React from 'react';

class ImageCarousel extends React.Component {
  state = {
    activeIndex: 0,
    isHovered: false
  };

  handlePrevious = (e) => {
    e.stopPropagation();
    this.setState(prevState => ({
      activeIndex: prevState.activeIndex === 0 
        ? this.props.images.length - 1 
        : prevState.activeIndex - 1
    }));
  };

  handleNext = (e) => {
    e.stopPropagation();
    this.setState(prevState => ({
      activeIndex: prevState.activeIndex === this.props.images.length - 1 
        ? 0 
        : prevState.activeIndex + 1
    }));
  };

  handleThumbnailClick = (index) => {
    this.setState({ activeIndex: index });
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  render() {
    const { images, productName } = this.props;
    const { activeIndex, isHovered } = this.state;

    return (
      <div className="product-gallery">
        {/* Thumbnails */}
        <div className="thumbnails">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className={`thumbnail ${activeIndex === index ? 'selected' : ''}`}
              onClick={() => this.handleThumbnailClick(index)}
              data-testid={`product-thumbnail-${index}`}
            />
          ))}
        </div>

        {/* Main Image */}
        <div 
          className="main-image"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <img 
            src={images[activeIndex]} 
            alt={`${productName} main view`}
            data-testid="product-main-image"
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={this.handlePrevious}
                className={`image-scroll-button left ${isHovered ? 'visible' : ''}`}
                aria-label="Previous image"
                data-testid="previous-image-button"
              >
                &lt;
              </button>
              <button
                onClick={this.handleNext}
                className={`image-scroll-button right ${isHovered ? 'visible' : ''}`}
                aria-label="Next image"
                data-testid="next-image-button"
              >
                &gt;
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="image-counter">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ImageCarousel;