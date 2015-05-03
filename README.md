# Nautic Online Rewrite in Node.JS

## Application structure

The application source code is located in `src`.

The frontend code is located in:

`src/app`

The backend code is located in:

`src/server`

The builded code will put into the `dist` folder. An have the same structure as the `src` folder.

## Tools and Software

The Backend of the Application is written with NodeJs.
The Frontend is made with Angular.

## Build

We use gulp to control the build process of the application.

The frontend will be packed with Webpack and all client side javascript code will result in a single index.js file placed in `dist/app`.

### Typescript
Its also possible to write typescript for frontend code makeing files with a `.ts` extension.

### ES6
 To use ES6 we inculded babel into the build process. Files that use ES6 features need the extension `es6.js`

## Tests
The application get tested in two ways. To start all test you can use:

`gulp test`

or

`npm test`

### Frontend
The frontend gets tested with Jasmine using Karma and PhantomJS to run the tests. The test file are in:

`test/jasmin`

To start the test on the command line you can use: 

`gulp test-jasmine`

### Backend
The backend test are made with mocha. The mocha test files are in:

`test/mocha`

To start the tests on the command line you can use:

`gulp test-mocha`

## Database

All data is stored in a Mysql Database.

## Mockups

Are at:  <https://projects.invisionapp.com/d/main#/projects/3485192>

