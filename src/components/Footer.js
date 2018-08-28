import React from 'react'
import Social from './Social'

const Footer = ({ timeout }) => (
    <footer id="footer" style={timeout ? {display: 'none'} : {}}>
        <Social />
        <p className="copyright">&copy; Matt Schroeder MMXVIII. Built with: <a href="https://www.gatsbyjs.org/">Gatsby.js</a></p>
    </footer>
)

Footer.propTypes = {
    timeout: React.PropTypes.bool
}

export default Footer
