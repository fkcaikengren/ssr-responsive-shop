import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

export default function Html({
  content,
  scriptElements = [],
  styleElements = [],
  insertedHeads = {},
  insertedScripts = {},
  svg = '',
  options = {},
}) {
  const helmet = Helmet.renderStatic();
  return (
    <html lang="zh">
      <head>
        {helmet.base.toComponent()}
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {insertedHeads.link}
        {helmet.link.toComponent()}
        {helmet.script.toComponent()}
        {styleElements}
        {insertedScripts.head}
      </head>
      <body style={{ overflowY: 'auto' }}>
        <svg
          style={{ display: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <div id="loadingBar" />
        <div id="modal" />
        <div id="mobileModal" />
        {insertedScripts.body}
        {scriptElements}
      </body>
    </html>
  );
}

Html.propTypes = {
  content: PropTypes.string.isRequired,
  scriptElements: PropTypes.arrayOf(PropTypes.node),
  styleElements: PropTypes.arrayOf(PropTypes.node),
  insertedHeads: PropTypes.object,
  insertedScripts: PropTypes.object,
  svg: PropTypes.string,
  options: PropTypes.object,
};
