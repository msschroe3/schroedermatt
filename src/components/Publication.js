import React from 'react'

const Publication = ({ title, date, href, summary }) => (
    <div className="publication">
        <a href={href} target="_blank"><h3>{title}</h3></a>
        <h4>{date}</h4>
        <p>{summary}</p>
    </div>
)

Publication.propTypes = {
    title: React.PropTypes.string,
    href: React.PropTypes.string,
    summary: React.PropTypes.string
}

export default Publication
