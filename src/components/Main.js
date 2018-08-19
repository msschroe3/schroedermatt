import React from 'react'
import Link from 'gatsby-link'
import pic02 from '../images/pic02.jpg'
import About from './About';
import Contact from './Contact';
import Work from './Work';

class Main extends React.Component {
  render() {
    return (
      <div id="main" style={this.props.timeout ? {display: 'flex'} : {display: 'none'}}>

        <About active={this.props.article === 'about'} timeout={this.props.timeout} onClose={this.props.onCloseArticle} />
        <Work active={this.props.article === 'work'} timeout={this.props.timeout} onClose={this.props.onCloseArticle} />
        <Contact active={this.props.article === 'contact'} timeout={this.props.timeout} onClose={this.props.onCloseArticle} />

      </div>
    )
  }
}

Main.propTypes = {
  route: React.PropTypes.object,
  article: React.PropTypes.string,
  articleTimeout: React.PropTypes.bool,
  onCloseArticle: React.PropTypes.func,
  timeout: React.PropTypes.bool
}

export default Main