# HOTROD

The HOTROD is web site building environment based on the [Webpack](http://webpack.js.org)

## Main Featurs

* Binding all of JavaScript files and emitting your own codes and third party vendor libraries code separately
* Transcompile JavaScript files written in ECMA2015 (ES6) by babel
* Compiling Sass
* Automatic adding style vendor prefix 
* Automatic removing unused style definition
* Minify HTML, JavaScriptt, Sass, PNG, JPEG, GIF and SVG files in production build
* versioning for all of the emitted files
* Injection styles written on `.css` files as `<style>` tag into the HTML 
* Generate 38 types of the images (selectable) for iOS, Android, and PC  such as a favicon and an apple-touch-icon from specific one seed image file. 
* Automatic injection HTML tags like `<link ref="xxx">` ,  `<script src="xxx">`  for resources all you need.

## Quick start

```bash
mkdir my-project
cd my-project
[TEMP]git clone https://git.xxxx
npm install
npm run dev
```

After running `npm run dev` command, web site resource files such as index.html will be emitted into `/public` directory.

## Build your own project

### Step 1: 

Write code and place all files into specified directory by file types.

#### HTML files (`.html`)

HTML files will be placed anywhere under  the `/src` directory. So you will be able to create directories into `/src` and place HTML files there if you need.

You can use underscore.js syntax and ECMA2015 template syntax in your HTML files and HTML files will automatically be injected `<link>` tags into `<head>` tag  and `<script>` tags into the end of the`<body>` tag you need depends on your resources.

note:  
Your own image files will be emitted with hash in their file name.  So you should write `<img>` tag is like `<img src=“${require(``./images/logo.png``)}”>`.

You need to wrap `${require(``xxx``)}`.

#### Stylesheets (`.css`)

All of your CSS files should be under the `src/css/` directory.  Style definitions in CSS files will be injected into `<head>` tag of all your own HTML file as a inline `<style>`  tag after stripping unused style definition.

#### Sass files (`.sass` and `.scss`)

The entry point of  Sass file is `src/sass/main.scss` and your own sass files should have file extension with `.sass` or `.scss`

All related sass files will be compiled and bound into `public/css/app.xxx.css` after stripping unused style definitions away from sass files and then`<link href="/css/app.xxx.css" rel="stylesheet">` tag will automatically be injected into `<head>` tag in the HTML files.

#### JavaScript files (`.js`)

The entry point of JavaScript is `src/js/main.js` and your own JavaScript files should have file extension with `.js`. 

All related JavaScript files will be transcompiled, bound and emitted three files into `/public/js/` directory.

* `app.xxx.js` is a file bound all of your JavaScript files.
* `vendor.xxx.js` is a file including all of the third party vendor libraries code.
* `manifest.xxx.js` is the common code of the webpack.

Additionally, `<script>` tags below will automatically injected into your HTML file.

```html
<script type="text/javascript" src="/js/manifest.xxx.js"></script>
<script type="text/javascript" src="/js/vendor.xxx.js"></script>
<script type="text/javascript" src="/js/app.xxx.js"></script>
```

#### Images (`.jpeg`, `jpg`, `gif` and `png`)

All of your image files should be placed in `src/images/`. Image files there will generate to `/public/images/` directory  as the same directory structure of them.

### STEP 2

Run npm script.

* `npm run dev` for development build.  
* `npm run production ` for production build.

#### A Diferences between development build and production build

A production build is almost the same as development one, but Javascript files, CSS files and HTML will be minified.

### STEP 3

Deploay all of the files and directories in the `/public` directory.


