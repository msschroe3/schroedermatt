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
            Matt is a technical leader in the areas of real-time data, service and API development, team collaboration, and the adoption of new technologies. 
            He also has experience in the front end and platform engineering spaces.
        </p>
        <p>    
            Matt's professional experience and Master's Degree in Software Engineering have created opportunities for him to make an immediate impact on companies ranging from startups to the largest in the world.
        </p>

        <h3>Specialties</h3>
        <ul>
            <li>Communication</li>
            <li>Cloud-native web services (AWS, GCP)</li>
            <li>Kafka and related data streaming technologies</li>
            <li>GraphQL and traditional databases</li>
            <li>User-friendly front ends</li>
            <li>Infrastructure as Code (Terraform)</li>
        </ul>

        <PublicationList allMarkdownRemark={allMarkdownRemark} />

        <div className="close" onClick={() => {onClose()}} />
    </article>
)

Work.propTypes = {}

export default Work