import React from 'react';
import { Query } from '@apollo/client/react/components';
import { gql } from '@apollo/client';
import buy_icon from './assets/circle_icon.png';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
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
        const price = product.prices[0]; // Assuming the first price is the default

        return (
            <div className="product-card">
                <img src={product.gallery[0]} alt={product.name} className="product-image" />
                {!product.inStock && (
                    <div className="out-of-stock-overlay">
                        <span className="out-of-stock">OUT OF STOCK</span>
                    </div>
                )}
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{price.currency.symbol}{price.amount.toFixed(2)}</p>
                {product.inStock && (
                    <button className="add-to-cart">
                        <img src={buy_icon} alt="Add to cart" className="cart-icon" />
                    </button>
                )}
            </div>
        );
    }
}

class ProductGrid extends React.Component {
    render() {
        return (
            <Query query={GET_PRODUCTS}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
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