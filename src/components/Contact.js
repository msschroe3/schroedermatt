import React from 'react'
import bulb from '../images/bulb.jpg'

const Contact = ({ active, timeout, close }) => (
    <article id="contact" className={`${active ? 'active' : ''} ${timeout ? 'timeout' : ''}`} style={{display:'none'}}>
        <h2 className="major">Contact</h2>
        <form name="contact" method="POST" action="/" netlify>
            <div className="field half first">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" />
            </div>
            <div className="field half">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" id="email" />
            </div>
            <div className="field">
                <label htmlFor="message">Message</label>
                <textarea name="message" id="message" rows="4"></textarea>
            </div>
            <ul className="actions">
                <li><input type="submit" value="Send Message" className="special" /></li>
                <li><input type="reset" value="Reset" /></li>
            </ul>
        </form>
        <ul className="icons">
            <li><a href="mailto:matt.schroeder@objectpartners.com" className="icon fa-envelope"><span className="label">Email</span></a></li>
            <li><a href="www.linkedin.com/in/matthewschroeder3" className="icon fa-linkedin"><span className="label">LinkedIn</span></a></li>
            <li><a href="https://github.com/msschroe3" className="icon fa-github"><span className="label">GitHub</span></a></li>
            <li><a href="https://twitter.com/MattSchroeder_" className="icon fa-twitter"><span className="label">Twitter</span></a></li>
        </ul>
        {close}
    </article>
)

Contact.propTypes = {}

export default Contact
