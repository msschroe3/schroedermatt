import React from 'react'
import opi from '../images/objectpartners.jpg'
import { Logo as ObjectPartnersLogo } from '@objectpartners/components';
import Publication from './Publication'
import PublicationList from './PublicationList';

const Work = ({ active, timeout, onClose, allMarkdownRemark }) => (
    <article id="work" className={`${active ? 'active' : ''} ${timeout ? 'timeout' : ''}`} style={{display:'none'}}>
        <h2 className="major">Work</h2>

        <ObjectPartnersLogo 
            bgImage={opi}
            bgDarken={0.5}
            style={{ height: 'auto', width: 'auto', marginBottom: '15px' }} />

        <p>
            As a consultant for Object Partners, Matt works alongside the top talent in 
            Minneapolis and Omaha to solve problems for businesses ranging from startups 
            to Fortune 5 companies.
        </p>

        <h3>Technologies</h3>
        <ul>
            <li>JVM development with Spring Boot</li>
            <li>Kafka and other real time data tools</li>
            <li>Scalable cloud applications (AWS, GCP, Azure)</li>
            <li>Spock testing framework</li>
            <li>React and a variety of front end frameworks</li>
        </ul>

        <PublicationList allMarkdownRemark={allMarkdownRemark} />

        <div className="close" onClick={() => {onClose()}} />
    </article>
)

Work.propTypes = {}

export default Work