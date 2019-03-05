# punk-tex
The fuck'em-all alternative to traditional typesetting systems

## Try online
You can try a [live demo](http://punktex.g6.cz/) of punkTex.

## How to download, build and run
```
git clone https://github.com/m93a/punk-tex
cd punk-tex
yarn
yarn start
```

## Syntax
The PunkTEX syntax is based on [Markdown](https://commonmark.org/help/) with some extensions.

### Equations
You can write LaTeX equations enclosed in `$$` for inline equation and `$$$` for a block equation.

```markdown
And hence we see, that indeed $$2 + 2 = 4$$.<br>
One might think of it as an counter-intuitive result
but without it, we couldn't possibly make sense of this:

$$$
\sum_{n=0}^\infty n = -\frac{1}{12}
$$$
```

Note that inline equations have to start right after the first `$$` and end right before the second `$$` – no spaces between the dollars and the first/last character of the equation are allowed.

### Typographic replacements
* `--` → `­–`
* `---` → `—`
* `+-` → `±`
* `...` → `…`
* `\copyright` → `©`
* `\registered` → `®`
* `\tm` → `™`
* `\S` → `§`
* `\dag` → `†`


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.