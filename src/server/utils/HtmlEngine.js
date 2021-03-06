import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import Html from '../template/Html';

export default class HtmlEngine {
  constructor({ entry, namespace }) {
    // this.entry = entry;
    this.namespace = namespace;
    this.extractor = new ChunkExtractor({
      statsFile: path.resolve(__dirname, './public/loadable-stats.json'),
      // entrypoints: [entry],
    });
  }

  render(component) {
    const jsx = this.extractor.collectChunks(component);
    let content;
    try {
      content = renderToString(jsx);
    } catch (err) {
      console.error(err.stack);
      console.log('==================');
    }

    const scriptElements = this.extractor.getScriptElements();
    const styleElements = this.extractor.getStyleElements();

    let insertedScripts;
    let insertedHeads;
    if (this.namespace) {
      const res = this.namespace.get('res');
      insertedScripts = res.insertedScripts;
      insertedHeads = res.insertedHeads;
    }
    // console.log('engine: ', insertedScripts);

    return `<!doctype html>\n${renderToString(
      <Html
        content={content}
        scriptElements={scriptElements}
        styleElements={styleElements}
        insertedScripts={insertedScripts}
        insertedHeads={insertedHeads}
      />
    )}`;
  }
}
