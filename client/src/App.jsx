import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header';
import ProductGrid from './ProductGrid';
import ProductDetails from './ProductDetails';
import { CartProvider } from './CartContext';

class App extends React.Component {
  state = {
    selectedCategory: 'all',
    isLoading: true,
    error: null
  };

  componentDidMount() {
    console.log('App mounted');
    this.handleCategoryChange('all');
    this.setState({ isLoading: false });
  }

  componentDidCatch(error, info) {
    console.error('App error:', error);
    console.error('Error info:', info);
    this.setState({ error: error });
  }

  handleCategoryChange = (categoryId) => {
    console.log('Category changed to:', categoryId);
    this.setState({ selectedCategory: categoryId });
  };

  render() {
    if (this.state.isLoading) {
      return <div style={{ padding: '20px' }}>Loading...</div>;
    }

    if (this.state.error) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          Error: {this.state.error.toString()}
        </div>
      );
    }

    return (
      <CartProvider>
        <Router>
          <div className="App">
            <Header onCategoryChange={this.handleCategoryChange} />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/all" replace />} />
                <Route path="/public/build" element={<Navigate to="/all" replace />} />
                <Route path="/public/build/*" element={<Navigate to="/all" replace />} />
                <Route path="/all" element={<ProductGrid categoryId="all" />} />
                <Route path="/clothes" element={<ProductGrid categoryId="2" />} />
                <Route path="/tech" element={<ProductGrid categoryId="3" />} />
                <Route path="/product/:id" element={<ProductDetails />} />
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    );
  }
}

export default App;