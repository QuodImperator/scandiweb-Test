import React from 'react';
import './index.css';
import Header from './Header.jsx';
import ProductGrid from './Products.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: 'all'
    };
  }

  handleCategoryChange = (categoryId) => {
    this.setState({ selectedCategory: categoryId });
  }

  render() {
    return (
      <div>
        <Header onCategoryChange={this.handleCategoryChange} />
        <ProductGrid categoryId={this.state.selectedCategory} />
      </div>
    );
  }
}

export default App;