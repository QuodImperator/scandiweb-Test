import React from 'react';
import { Query } from '@apollo/client/react/components';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { CartConsumer } from './CartContext';
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

class ProductCard extends React.Component {
    handleQuickAddToCart = (e, product, addToCart) => {
        e.preventDefault();
        if (!product.inStock) return;

        const defaultAttributes = product.attributes.reduce((acc, attr) => {
            if (attr.items.length > 0) {
                acc[attr.name] = attr.items[0].value;
            }
            return acc;
        }, {});

        addToCart(product, defaultAttributes);
    }

    render() {
        const { product } = this.props;
        const price = product.prices && product.prices.length > 0 ? product.prices[0] : null;

        return (
            <CartConsumer>
                {({ addToCart }) => (
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
                                    onClick={(e) => this.handleQuickAddToCart(e, product, addToCart)}
                                >
                                    <img src={buy_icon} alt="Add to cart" className="cart-icon" />
                                </button>
                            )}
                        </div>
                    </Link>
                )}
            </CartConsumer>
        );
    }
}

class ProductGrid extends React.Component {
    getCategoryName(categoryId) {
        switch(categoryId) {
            case 'all':
                return 'All';
            case '2':
                return 'Women';
            case '3':
                return 'Tech';
            default:
                return 'All';
        }
    }

    render() {
        const { categoryId } = this.props;

        return (
            <Query query={GET_PRODUCTS} variables={{ categoryId }}>
                {({ loading, error, data }) => {
                    if (loading) return <p></p>;
                    if (error) return <p>Error: {error.message}</p>;

                    const categoryName = this.getCategoryName(categoryId);

                    return (
                        <>
                            <div className="category-display">
                                <h1>{categoryName}</h1>
                            </div>
                            <div className="product-container">
                                <div className="product-grid">
                                    {data.products.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        </>
                    );
                }}
            </Query>
        );
    }
}

export default ProductGrid;