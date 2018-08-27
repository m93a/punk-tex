import * as React from 'react';
import './App.css';

import logo from './logo.svg';

import * as hljs from "highlight.js";
import * as markdownIt from "markdown-it";

let md = markdownIt({
    highlight(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }
  
      return ''; // use external default escaping
    }
  });


md.render('Lorem ipsum');

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Editor</h1>
        </header>
        <div className="App-intro">
          <p contentEditable>
            To get started, edit <code>src/App.tsx</code> and save to reload.
          </p>
          <p>
            ASDF
          </p>
        </div>
      </div>
    );
  }
}

export default App;
