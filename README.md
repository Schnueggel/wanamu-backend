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

## Docker

We use docker to run the database
To update the scheme use the wanamu-db project and the docker-liquibase project.

1. Go to the folder changelogs in the wanamu-db create a new changelog.xml and raise the postfix. Dont forget to include the previous Version.

Go into the folder of wanamu-db and build the container 
```build -t wanamudb .```

Go into the folder of liquibase and build the container
```build -t liquivase .```

2. Create the needed env vars (Example):
    export LB_CHANGELOGS=/c/Users/Schnueggel/WebstormProjects/wanamu-db/changelogs
    export POSTGRES_DATA=/c/Users/Schnueggel/WebstormProjects/wanamu-db/data
    export POSTGRES_USER=postgres
    export POSTGRES_PASSWORD=postgres
    export WU_DB_NAME=wanamu
    export WU_DB_PASS=wanamu
    export WU_DB_USER=wanamu

3. Start wanamudb container

docker run --name wanamudb \
    -p 5432:5432  \
    -v POSTGRES_DATA:/var/lib/postgresql/data \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD   \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e DB_USER=$WU_DB_USER
    -e DB_PASS=$WU_DB_PASS
    -e DB_NAME=$WU_DB_NAME
    -d wanamudb
    
    Or single line:
    docker run --name wanamudb -p 5432:5432  -v POSTGRES_DATA:/var/lib/postgresql/data  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -e POSTGRES_USER=$POSTGRES_USER  -e DB_USER=$WU_DB_USER  -e DB_PASS=$WU_DB_PASS -e DB_NAME=$WU_DB_NAME  -d wanamudb  
    
4. Start liquibase container to update database

    docker run -it --name liquibase --link wanamudb:db --entrypoint="/scripts/liquibase_command.sh"   -v $LB_CHANGELOGS:/changelogs -e LB_CHANGELOG_FILE=/changelogs/changelog.xml -e LB_DB_NAME=wanamu --rm liquibase  update
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
