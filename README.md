# Wanamu Backend

##Setup

###Development
You must create a local mysql instance
See the development and test.json in src/server/server/config/json for tablenames and username

The following npm package should be installed global

gulp

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

mocha
npm-check-updates

### Docs:


Koa:
npm
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

## Docker

We use docker to run the database
To update the scheme use the wanamu-db project and the docker-liquibase project.

1. Go to the folder changelogs in the wanamu-db create a new changelog.xml and raise the postfix. Dont forget to include the previous Version.

Go into the folder of wanamu-db and build the container 
```build -t wanamudb .```

Go into the folder of liquibase and build the container
```build -t liquibase .```

2. Create the database by using the start.sh script in the database project

3. Update the schema in the database by calling the update.sh script in the liquibase folder
    
## Status Codes

This status code are used in the application

208 If User is confirmed but confirmation is requested again
401 If User is not Authenticated
403 If User does not have the permission to do this action
412 If User requests a resend of confirmation data but has not given a correct password
422 If data validation went wrong
404 Entity not found
424 User not confirmed
500 On an unexpected error
