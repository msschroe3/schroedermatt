import React from 'react'

const Footer = ({ timeout }) => (
    <footer id="footer" style={timeout ? {display: 'none'} : {}}>
        <p className="copyright">&copy; Matt Schroeder MMXVIII. Built with: <a href="https://www.gatsbyjs.org/">Gatsby.js</a></p>
    </footer>
)

Footer.propTypes = {
    timeout: React.PropTypes.bool
}

export default Footer
