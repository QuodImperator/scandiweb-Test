import React from 'react';
import logo from './assets/a-logo.png';
import cart from './assets/EmptyCart.png';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'all',
    };
  }

  handleClick = (tab) => {
    this.setState({ activeTab: tab });
    if (this.props.onCategoryChange) {
      this.props.onCategoryChange(tab);
    }
  };

  render() {
    const { activeTab } = this.state;

    return (
      <div>
        <ul>
          <li>
            <a
              href="#"
              className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => this.handleClick('all')}
            >
              ALL
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`nav-link ${activeTab === 'clothes' ? 'active' : ''}`}
              onClick={() => this.handleClick('clothes')}
            >
              CLOTHES
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`nav-link ${activeTab === 'tech' ? 'active' : ''}`}
              onClick={() => this.handleClick('tech')}
            >
              TECH
            </a>
          </li>
          <li>
            <img src={logo} alt="Logo" className="logo" />
          </li>
          <li>
            <a href="#" className="cart-link">
              <img src={cart} alt="Cart" className="cart" />
            </a>
          </li>
        </ul>

        <div className="category-display">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </div>
      </div>
    );
  }
}

export default Header;