var co = require('co'),
    route = require('koa-route');

module.exports = function(app){
    app.use(route.get('/', function*(){
        this.body  = 'Hello World';
    }));
};
