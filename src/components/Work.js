import React from 'react'
import bulb from '../images/bulb.jpg'

const Work = ({ active, timeout, close }) => (
    <article id="work" className={`${active ? 'active' : ''} ${timeout ? 'timeout' : ''}`} style={{display:'none'}}>
        <h2 className="major">Work</h2>
        <span className="image main"><img src={bulb} alt="" /></span>
        <p>
            Matt has experience in a wide variety of technologies but specializes 
            in JVM and Real Time Data technologies such as Kafka.
        </p>

        <h3>Technologies</h3>
        <ul>
            <li>JVM (Java/Groovy/Kotlin)</li>
            <li>Spock</li>
            <li>Spring Boot</li>
            <li>React</li>
            <li>Jest</li>
            <li>AWS</li>
            <li>Kafka</li>
        </ul>
        {/* <p></p> */}
        {close}
    </article>
)

Work.propTypes = {}

export default Work
