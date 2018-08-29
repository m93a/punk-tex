// Global
import * as React from 'react';
import './App.css';
import logo from './logo.svg';


// Editor
import Ace from 'react-ace';
import 'brace/mode/markdown';
import './theme';


// Compiler
import * as MarkdownIt from 'markdown-it';
import * as IncrementalDOM from 'incremental-dom';
import mdIncrementalDOM from 'markdown-it-incremental-dom';
import TexZilla from 'texzilla';
import mdMath from 'markdown-it-math';

const md = MarkdownIt({
  breaks: false,
  html: true,
  quotes: "„“‚‘",
  xhtmlOut: true,
});

md.use(
  mdIncrementalDOM,
  IncrementalDOM
);

md.use(
  mdMath,
  {
    inlineRenderer(str: string) {
        return TexZilla.toMathMLString(str);
    },
    blockRenderer(str: string) {
        return TexZilla.toMathMLString(str, true);
    }
  }
);




class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Editor</h1>
        </header>
        <div className="App-intro">

          <Ace
            mode="markdown"
            theme="decent"
            onChange={this.onTyping}
            name="editor"
            editorProps={{$blockScrolling: true}}
            defaultValue={sampleText}
          />

          <div id="renderTarget" />
        </div>
      </div>
    );
  }

  public onTyping = (code: string) =>
  {
    IncrementalDOM.patch(
      document.getElementById('renderTarget') as Element,
      md.renderToIncrementalDOM(code)
    )
  };

  public componentDidMount() { this.onTyping(sampleText); }

}

const sampleText = `# Heading
How *are* __you__, [human](being)?
* I
* am
* a
* \`computer\`


1. wow
2. this
3. is
4. so
5. sad


\`\`\`can
we get like
+Infinity
likes?
\`\`\`

$$$
3 + 2 \in ℝ
$$$

<script src="asdf">var bar; if (jar) far();</script>`;

export default App;
