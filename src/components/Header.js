import React from 'react'

const Header = (props) => (
    <header id="header" style={props.timeout ? {display: 'none'} : {}}>
        <div className="logo">
            <a target="_blank" href="https://linkedin.com/in/matthewschroeder3">
                <span className="icon fa-linkedin" />
            </a>
        </div>
        <div className="content">
            <div className="inner">
                <h1>Matt Schroeder</h1>
                <p>Senior Software Consultant at <a href="https://objectpartners.com" target="_blank">Object Partners, Inc.</a></p>
                {/* <p>Specialty: JVM &amp; Real Time Data</p> */}
            </div>
        </div>
        <nav>
            <ul>
                <li><a href="javascript:;" onClick={() => {props.onOpenArticle('about')}}>About</a></li>
                <li><a href="javascript:;" onClick={() => {props.onOpenArticle('work')}}>Work</a></li>
                <li><a href="javascript:;" onClick={() => {props.onOpenArticle('contact')}}>Contact</a></li>
            </ul>
        </nav>
    </header>
)

Header.propTypes = {
    onOpenArticle: React.PropTypes.func,
    timeout: React.PropTypes.bool
}

export default Header
