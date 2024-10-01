import React from 'react';
import blouse1 from './assets/test_blouse1.jpg'
import blouse2 from './assets/test_blouse2.jpg'
import buy_icon from './assets/circle_icon.png'

const products = [
    { id: 1, name: 'Running Short', price: 50.00, image: blouse1, inStock: true, category: 'clothes' },
    { id: 2, name: 'Running Short', price: 50.00, image: blouse1, inStock: true, category: 'clothes' },
    { id: 3, name: 'Running Short', price: 50.00, image: blouse1, inStock: false, category: 'clothes' },
    { id: 4, name: 'Running Short', price: 50.00, image: blouse1, inStock: true, category: 'clothes' },
    { id: 5, name: 'Running Short', price: 50.00, image: blouse1, inStock: true, category: 'clothes' },
    { id: 6, name: 'Running Short', price: 50.00, image: blouse1, inStock: true, category: 'clothes' },
    { id: 7, name: 'Smart Watch', price: 50.00, image: blouse2, inStock: true, category: 'tech' },
    { id: 8, name: 'Wireless Earbuds', price: 50.00, image: blouse2, inStock: true, category: 'tech' },
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
                        <img src={buy_icon} alt="Add to cart" className="cart-icon" />
                    </button>
                )}
            </div>
        );
    }
}

class ProductGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: 'all'
        };
    }

    componentDidMount() {
        if (this.props.onCategoryChange) {
            this.props.onCategoryChange(this.handleCategoryChange);
        }
    }

    handleCategoryChange = (category) => {
        this.setState({ selectedCategory: category });
    }

    render() {
        const { selectedCategory } = this.state;
        const filteredProducts = selectedCategory === 'all' 
            ? products 
            : products.filter(product => product.category === selectedCategory);

        return (
            <div className="product-container">
                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        );
    }
}

export default ProductGrid;