import React from 'react';
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
    }
  }
`;

class ProductDetailsContent extends React.Component {
  render() {
    const { product } = this.props;

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
          
          <div className="product-price">
            <h3>Price:</h3>
            <p>{product.prices[0].currency.symbol}{product.prices[0].amount.toFixed(2)}</p>
          </div>
          
          <p className="product-stock">
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </p>
          
          <button
            className="add-to-cart"
            disabled={!product.inStock}
            onClick={() => console.log('Add to cart:', product.id)}
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
  }
}

const ProductDetails = () => {
  const { id } = useParams();
  
  return (
    <Query query={GET_PRODUCT} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading) return <div className="loading">Loading...</div>;
        if (error) return <div className="error">Error: {error.message}</div>;

        const product = data.products[0]; // Assuming the query returns an array
        if (!product) return <div className="error">Product not found</div>;

        return <ProductDetailsContent product={product} />;
      }}
    </Query>
  );
};

export default ProductDetails;