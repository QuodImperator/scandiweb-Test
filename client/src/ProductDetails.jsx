import React from 'react';
import { Query } from '@apollo/client/react/components';
import { GET_PRODUCT } from './queries';
import { CartConsumer } from './CartContext';
import { WithRouter } from './WithRouter';

class ProductDetailsContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: {},
      selectedImageIndex: 0,
      isHoveringImage: false
    };
  }

  handleAttributeChange = (attributeId, itemId) => {
    this.setState(prevState => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeId]: itemId
      }
    }));
  };

  handleThumbnailClick = (index) => {
    this.setState({ selectedImageIndex: index });
  };

  handlePrevImage = () => {
    this.setState(prevState => ({
      selectedImageIndex: (prevState.selectedImageIndex - 1 + this.props.product.gallery.length) % this.props.product.gallery.length
    }));
  };

  handleNextImage = () => {
    this.setState(prevState => ({
      selectedImageIndex: (prevState.selectedImageIndex + 1) % this.props.product.gallery.length
    }));
  };

  handleImageHover = (isHovering) => {
    this.setState({ isHoveringImage: isHovering });
  }

  render() {
    const { product, addToCart } = this.props;
    const { selectedImageIndex } = this.state;

    return (
      <div className="product-details">
        <div className="product-gallery">
          <div className="thumbnails">
            {product.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                className={`thumbnail ${selectedImageIndex === index ? 'selected' : ''}`}
                onClick={() => this.handleThumbnailClick(index)}
              />
            ))}
          </div>
          <div className="main-image">
            <img src={product.gallery[selectedImageIndex]} alt={product.name} />
            <button className="image-scroll-button left" onClick={this.handlePrevImage}>&lt;</button>
            <button className="image-scroll-button right" onClick={this.handleNextImage}>&gt;</button>
          </div>
        </div>
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <h2 className="product-brand">{product.brand}</h2>

          {product.attributes.map(attribute => (
            <div key={attribute.id} className="product-attribute">
              <h3>{attribute.name}:</h3>
              <div className="attribute-options">
                {attribute.items.map(item => (
                  <button
                    key={item.id}
                    className={`attribute-option ${this.state.selectedAttributes[attribute.id] === item.id ? 'selected' : ''}`}
                    onClick={() => this.handleAttributeChange(attribute.id, item.id)}
                    style={attribute.type === 'swatch' ? { backgroundColor: item.value } : {}}
                  >
                    {attribute.type === 'swatch' ? '' : item.displayValue}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="product-price">
            <h3>PRICE:</h3>
            {product.prices.map((price, index) => (
              <p key={index}>{price.currency.symbol}{price.amount.toFixed(2)}</p>
            ))}
          </div>

          <button
            className="add-to-cart"
            disabled={!product.inStock}
            onClick={() => addToCart(product, this.state.selectedAttributes)}
          >
            {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>

          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>
    );
  }
}

class ProductDetails extends React.Component {
  render() {
    const { id } = this.props.router.params;

    return (
      <Query query={GET_PRODUCT} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return <div className="loading">Loading...</div>;
          if (error) return <div className="error">Error: {error.message}</div>;

          const product = data.product;
          if (!product) return <div className="error">Product not found</div>;

          return (
            <CartConsumer>
              {({ addToCart }) => (
                <ProductDetailsContent product={product} addToCart={addToCart} />
              )}
            </CartConsumer>
          );
        }}
      </Query>
    );
  }
}

export default WithRouter(ProductDetails);