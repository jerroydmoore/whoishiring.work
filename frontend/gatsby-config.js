const short_name = 'Who is Hiring';
const title = `HN: ${short_name}?`;
const description = 'Aggregate, filter, and seach for monthly jobs posted on AskHN: Who is Hiring?';

module.exports = {
  siteMetadata: {
    title,
    description,
    author: '@jerroydmoore',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: title,
        short_name,
        description: 'foo',
        start_url: '/',
        background_color: '#FD6600',
        theme_color: '#FD6600',
        display: 'minimal-ui',
        icon: 'src/images/hn-icon.png', // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: 'gatsby-plugin-s3',
      options: {
        bucketName: 'www.whoishiring.work',
        // generateRedirectObjectsForPermanentRedirects: true,
        protocol: 'https',
        hostname: 'www.whoishiring.work',
      },
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://www.whoishiring.work',
      },
    },
  ],
};
