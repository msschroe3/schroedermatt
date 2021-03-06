module.exports = {
  siteMetadata: {
    title: "Matt Schroeder",
    author: "Matt Schroeder",
    description: "A portfolio for Matt Schroeder built with Gatsby.js.",
    analyticsTrackingId: "UA-124183956-1"
  },
  pathPrefix: '/',
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/blogs`,
        name: 'blogs',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          "gatsby-remark-copy-linked-files",
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    'gatsby-plugin-catch-links'
  ],
}
