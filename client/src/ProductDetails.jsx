import React from 'react';
import { Query } from '@apollo/client/react/components';
import { GET_PRODUCT } from './queries';
import { CartConsumer } from './CartContext';
import { WithRouter } from './WithRouter';

class ProductDetailsContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: this.getInitialSelectedAttributes(),
      selectedImageIndex: 0,
      isHoveringImage: false
    };
  }

  getInitialSelectedAttributes() {
    const { product, cartItems } = this.props;
    const cartItem = cartItems.find(item => item.id === product.id);
    if (cartItem && cartItem.selectedAttributes) {
      return Object.keys(cartItem.selectedAttributes).reduce((acc, key) => {
        const attribute = product.attributes.find(attr => attr.name === key);
        if (attribute) {
          const item = attribute.items.find(item => item.value === cartItem.selectedAttributes[key]);
          if (item) {
            acc[attribute.id] = item.id;
          }
        }
        return acc;
      }, {});
    }
    return {};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cartItems !== this.props.cartItems || prevProps.product !== this.props.product) {
      this.setState({
        selectedAttributes: this.getInitialSelectedAttributes()
      });
    }
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

  areAllAttributesSelected = () => {
    const { product } = this.props;
    const { selectedAttributes } = this.state;
    return product.attributes.every(attribute => selectedAttributes.hasOwnProperty(attribute.id));
  }

  handleAddToCart = () => {
    const { product, addToCart } = this.props;
    const { selectedAttributes } = this.state;

    // Convert selectedAttributes to the format expected by the cart
    const cartAttributes = Object.keys(selectedAttributes).reduce((acc, attributeId) => {
      const attribute = product.attributes.find(attr => attr.id === attributeId);
      if (attribute) {
        const item = attribute.items.find(item => item.id === selectedAttributes[attributeId]);
        if (item) {
          acc[attribute.name] = item.value;
        }
      }
      return acc;
    }, {});

    addToCart(product, cartAttributes);
  }

  render() {
    const { product } = this.props;
    const { selectedImageIndex, selectedAttributes } = this.state;
    const isAddToCartDisabled = !product.inStock || !this.areAllAttributesSelected();

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
                    className={`attribute-option ${selectedAttributes[attribute.id] === item.id ? 'selected' : ''}`}
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
            disabled={isAddToCartDisabled}
            onClick={this.handleAddToCart}
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
          if (loading) return <div className="loading"></div>;
          if (error) return <div className="error">Error: {error.message}</div>;

          const product = data.product;
          if (!product) return <div className="error">Product not found</div>;

          return (
            <CartConsumer>
              {({ addToCart, cartItems }) => (
                <ProductDetailsContent product={product} addToCart={addToCart} cartItems={cartItems} />
              )}
            </CartConsumer>
          );
        }}
      </Query>
    );
  }
}

export default WithRouter(ProductDetails);