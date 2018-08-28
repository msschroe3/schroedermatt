import React from 'react'
import Publication from './Publication'

export default function PublicationList({ allMarkdownRemark }) {
  if (allMarkdownRemark.edges) {
    return (
      <span className="publications">
        <h2 className="major">Publications</h2>
        {allMarkdownRemark
            .edges
            .filter(post => post.node.frontmatter.title.length > 0)
            .map(({ node: post }) => {
            return (
                <Publication
                    key={post.frontmatter.date}
                    title={post.frontmatter.title}
                    href={post.frontmatter.href}
                    date={post.frontmatter.date}
                    summary={post.frontmatter.summary} />
            );
            })}
      </span>
    );
  }

}