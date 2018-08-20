import React from 'react'
import Social from './Social'

const Contact = ({ active, timeout, onClose }) => (
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
        <Social />

        <div className="close" onClick={() => {onClose()}} />
    </article>
)

Contact.propTypes = {}

export default Contact
