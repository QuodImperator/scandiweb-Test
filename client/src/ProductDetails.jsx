import React, { useState } from 'react';
import { Query } from '@apollo/client/react/components';
import { gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      category {
        name
      }
      prices {
        amount
        currency {
          symbol
        }
      }
      brand
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }
    }
  }
`;

const ProductDetailsContent = ({ product }) => {
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const handleAttributeChange = (attributeId, itemId) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeId]: itemId
    }));
  };

  const images = product.gallery.map(image => ({
    original: image,
    thumbnail: image
  }));

  return (
    <div className="product-details">
      <div className="product-gallery" data-testid="product-gallery">
        <ImageGallery 
          items={images}
          showPlayButton={false}
          showFullscreenButton={false}
        />
      </div>
      <div className="product-info">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-brand">Brand: {product.brand}</p>
        <p className="product-category">Category: {product.category.name}</p>
        
        {product.attributes.map(attribute => (
          <div key={attribute.id} className="product-attribute">
            <h3>{attribute.name}</h3>
            <div className="attribute-options">
              {attribute.items.map(item => (
                <button
                  key={item.id}
                  className={`attribute-option ${selectedAttributes[attribute.id] === item.id ? 'selected' : ''}`}
                  onClick={() => handleAttributeChange(attribute.id, item.id)}
                  style={attribute.type === 'swatch' ? { backgroundColor: item.value } : {}}
                >
                  {attribute.type === 'swatch' ? '' : item.displayValue}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="product-price">
          <h3>Price:</h3>
          {product.prices.map((price, index) => (
            <p key={index}>{price.currency.symbol}{price.amount.toFixed(2)}</p>
          ))}
        </div>
        
        <p className="product-stock">
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </p>
        
        <button
          className="add-to-cart"
          disabled={!product.inStock}
          onClick={() => console.log('Add to cart:', product.id, selectedAttributes)}
          data-testid="add-to-cart"
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
        
        <div 
          className="product-description" 
          data-testid="product-description"
          dangerouslySetInnerHTML={{ __html: product.description }} 
        />
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  
  return (
    <Query query={GET_PRODUCT} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading) return <div className="loading">Loading...</div>;
        if (error) return <div className="error">Error: {error.message}</div>;

        const product = data.product;
        if (!product) return <div className="error">Product not found</div>;

        return <ProductDetailsContent product={product} />;
      }}
    </Query>
  );
};

export default ProductDetails;