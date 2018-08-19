import React from 'react'
import pic03 from '../images/my_face.png'

const About = ({ active, timeout, onClose }) => (
    <article id="about" className={`${active ? 'active' : ''} ${timeout ? 'timeout' : ''}`} style={{display:'none'}}>
        <h2 className="major">About</h2>
        <span className="avatar">
            <img src={pic03} alt="" />
        </span>
        <p>5+ years of professional experience and a Master's Degree in Software Engineering have become the foundation that enables me to lead teams to the best solution for every problem.   </p>
        
        <div className="close" onClick={() => {onClose()}} />
    </article>
)

About.propTypes = {}

export default About
