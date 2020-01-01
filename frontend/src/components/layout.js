/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';

import './bootstrap.css';
import './layout.css';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query MyQuery {
      file(relativePath: { eq: "GitHub-icon.png" }) {
        childImageSharp {
          fixed(width: 20, height: 20) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `);
  return (
    <>
      <header>
        <nav className="navbar">
          <Link className="navbar-brand" to="/">
            <div className="icon">HN:</div>
            <h1>Who is Hiring?</h1>
          </Link>
        </nav>
      </header>
      <main className="container">{children}</main>
      <footer>
        <div className="footer">
          <a className="githubLink" href="https://github.com/jerroydmoore/whoishiring.work" rel="nofollow">
            <Img fixed={data.file.childImageSharp.fixed} alt="GitHub" />
            <div>View the source code</div>
          </a>
        </div>
      </footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
