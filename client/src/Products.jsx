import React from 'react';
import blouse1 from './assets/test_blouse1.jpg'
import blouse2 from './assets/test_blouse2.jpg'

const products = [
    { id: 1, name: 'Running Short', price: 50.00, image: blouse1, inStock: true },
    { id: 2, name: 'Running Short', price: 50.00, image: blouse1, inStock: true },
    { id: 3, name: 'Running Short', price: 50.00, image: blouse1, inStock: false },
    { id: 4, name: 'Running Short', price: 50.00, image: blouse1, inStock: true },
    { id: 5, name: 'Running Short', price: 50.00, image: blouse1, inStock: true },
    { id: 6, name: 'Running Short', price: 50.00, image: blouse1, inStock: true },
];

class ProductCard extends React.Component {
    render() {
        const { product } = this.props;
        return (
            <div className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                {!product.inStock && (
                    <div className="out-of-stock-overlay">
                        <span className="out-of-stock">OUT OF STOCK</span>
                    </div>
                )}
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                {product.inStock && (
                    <button className="add-to-cart">
                        <span className="cart-icon">+</span>
                    </button>
                )}
            </div>
        );
    }
}

class ProductGrid extends React.Component {
    render() {
        return (
            <div className="product-container">
                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        );
    }
}

export default ProductGrid;