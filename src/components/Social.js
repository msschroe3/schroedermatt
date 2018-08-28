import React from 'react'
import { OutboundLink } from 'react-ga'

const Social = () => (
    <ul className="icons">
        <li>
            <OutboundLink className="icon fa-envelope" eventLabel="Email" to="mailto:matt.schroeder@objectpartners.com">
                <span className="label">Email</span>
            </OutboundLink>
        </li>
        <li>
            <OutboundLink className="icon fa-linkedin" eventLabel="LinkedIn" to="https://linkedin.com/in/matthewschroeder3" target="_blank">
                <span className="label">LinkedIn</span>
            </OutboundLink>
        </li>
        <li>
            <OutboundLink className="icon fa-github" eventLabel="GitHub" to="https://github.com/msschroe3" target="_blank">
                <span className="label">GitHub</span>
            </OutboundLink>
        </li>
    </ul>
)

export default Social
