import React from 'react';
import { Query } from '@apollo/client/react/components';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import buy_icon from './assets/circle_icon.png';

const GET_PRODUCTS = gql`
  query GetProducts($categoryId: String) {
    products(categoryId: $categoryId) {
      id
      name
      inStock
      gallery
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

class ProductCard extends React.Component {
    render() {
        const { product } = this.props;
        const price = product.prices && product.prices.length > 0 ? product.prices[0] : null;

        return (
            <Link to={`/product/${product.id}`} className="product-card-link">
                <div className="product-card">
                    <img src={product.gallery[0]} alt={product.name} className="product-image" />
                    {!product.inStock && (
                        <div className="out-of-stock-overlay">
                            <span className="out-of-stock">OUT OF STOCK</span>
                        </div>
                    )}
                    <h3 className="product-name">{product.name}</h3>
                    {price ? (
                        <p className="product-price">{price.currency.symbol}{price.amount.toFixed(2)}</p>
                    ) : (
                        <p className="product-price">Price not available</p>
                    )}
                    {product.inStock && (
                        <button 
                            className="add-to-cart"
                            onClick={(e) => {
                                e.preventDefault();
                                console.log('Add to cart:', product.id);
                            }}
                        >
                            <img src={buy_icon} alt="Add to cart" className="cart-icon" />
                        </button>
                    )}
                </div>
            </Link>
        );
    }
}

class ProductGrid extends React.Component {
    render() {
        const { categoryId } = this.props;

        return (
            <Query query={GET_PRODUCTS} variables={{ categoryId }}>
                {({ loading, error, data }) => {
                    if (loading) return <p></p>;
                    if (error) return <p>Error: {error.message}</p>;

                    return (
                        <div className="product-container">
                            <div className="product-grid">
                                {data.products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default ProductGrid;