# TODOIT Backend

## Install
In order to run this application you need to make an alias and run the node command with `--harmony_generators` flag or use 
`io.js`.

Use `npm start` to start the server.

Use `gulp build-serve` to start development server.

Use `gulp build` to build only.

Use `gulp test` to start tests.
   
## Development
For development create a MongoDb database at localhost without password and username

   use `gulp build-development-database` to build the development database.
   
## Application structure

The application source code is located in `src`.

The backend code is located in:

`src/server`

The built code will be put into the `dist` folder and have the same structure as the `src` folder.

## Tools and Software

The backend of the application is written in NodeJs using the Express framework.
The frontend is made with Angular.

### Docs:


Koa:

<https://github.com/koajs/koa>

## Build

We use gulp to control the build process of the application.


## Tests
The application gets tested in two ways. To start all tests you can use:

`gulp test`


The backend test are made with mocha. The mocha test files are in:

`test/mocha`

To start the tests on the command line you can use:

`gulp test-mocha`

## Database

All data is stored in a Mongo Database.

## Mockups

Are at:  <https://projects.invisionapp.com/d/main#/projects/3485192>

