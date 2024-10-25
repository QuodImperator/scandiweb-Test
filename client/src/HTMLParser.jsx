import React from 'react';

class HTMLParser extends React.Component {
  parseHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    return this.renderNode(doc.body);
  }

  renderNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    const children = Array.from(node.childNodes).map((child, index) => 
      React.createElement(React.Fragment, { key: index }, this.renderNode(child))
    );

    switch (node.nodeName.toLowerCase()) {
      case 'body':
        return children;
      case 'p':
        return React.createElement('p', { key: node.textContent }, children);
      case 'h1':
        return React.createElement('h1', { key: node.textContent }, children);
      case 'h2':
        return React.createElement('h2', { key: node.textContent }, children);
      case 'h3':
        return React.createElement('h3', { key: node.textContent }, children);
      case 'ul':
        return React.createElement('ul', { key: node.textContent }, children);
      case 'li':
        return React.createElement('li', { key: node.textContent }, children);
      case 'span':
        return React.createElement('span', { key: node.textContent }, children);
      case 'strong':
        return React.createElement('strong', { key: node.textContent }, children);
      case 'em':
        return React.createElement('em', { key: node.textContent }, children);
      case 'br':
        return React.createElement('br', { key: Math.random() });
      default:
        return children;
    }
  }

  render() {
    const { html } = this.props;
    return <div>{this.parseHTML(html)}</div>;
  }
}

export default HTMLParser;