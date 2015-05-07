# Nautic Online Rewrite in Node.JS

## Install
   use `gulp build-serve` to start development server
   
   use `gulp build` to build only
   
   use `gulp test` to start tests
   
## Development
For development create a MYSQL database at localhost and create a user and database named `nautic_dev` 
with password `nautic_dev`

   use `gulp build-development-database` to build the development database.
## Application structure

The application source code is located in `src`.

The frontend code is located in:

`src/app`

The backend code is located in:

`src/server`

The built code will be put into the `dist` folder and have the same structure as the `src` folder.

## Tools and Software

The backend of the application is written in NodeJs using the Express framework.
The frontend is made with Angular.

## Build

We use gulp to control the build process of the application.

The frontend will be packed with Webpack and all client side javascript code will result in a single index.js file placed in `dist/app`.

### Typescript
Its also possible to write typescript for frontend code creating files with a `.ts` extension.

### ES6
 To use ES6 we included babel into the build process. Files that use ES6 features need the extension `.es6.js`

## Tests
The application gets tested in two ways. To start all tests you can use:

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

All data is stored in a MySQL Database.

## Mockups

Are at:  <https://projects.invisionapp.com/d/main#/projects/3485192>

