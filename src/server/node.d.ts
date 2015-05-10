/**
 * Created by Christian on 5/9/2015.
 * Meta information for none Typescript Code
 */

/**
 * We need to declare require as var
 * else typescript will not recognize nodes commonjs require
 */
declare var require;

/**
 * NodeJs Promise
 */
interface Promise {
    then(func: any)
    catch(func: any)
}

/**
 * https://gist.github.com/PyYoshi/9970498
 */
interface SequelizeResult {
    save():SequelizeEmitters;
    update(...args:any[]):SequelizeEmitters;
    updateAttributes(data:any,opts?:any):SequelizeEmitters;
    destroy(...args:any[]):SequelizeEmitters;
    reload():SequelizeEmitters;
    decrement(obj:any):SequelizeEmitters;
}

// read sequelize/lib/emitters/custom-event-emitter.js
interface SequelizeEmitters {
    then(cb:Function):SequelizeEmitters;
    catch(cb:Function):SequelizeEmitters;
}
/**
 * Sequelize default Model
 */
interface SequelizeModel {
    build(obj:any):SequelizeResult;
    create(obj:any, opts?:any):SequelizeEmitters;
    bulkCreate(obj:any[]):SequelizeEmitters
    find(id:number):SequelizeEmitters;
    find(opts?:any, qopts?:any):SequelizeEmitters;
    findAll(opts?:any, qopts?:any):SequelizeEmitters;
    findOrCreate(where:any, defaults:any, opt?:any):SequelizeEmitters;
    findAndCountAll(opts:any, queryOptions:any):SequelizeEmitters;
    sync(options?:{force?:boolean}):SequelizeEmitters;
    drop():SequelizeEmitters;
    count():SequelizeEmitters;
    max(attr:string):SequelizeEmitters;
    min(attr:string):SequelizeEmitters;
    belongsTo(model:SequelizeModel);
    hasOne(model:SequelizeModel, opts?:any);
    hasMany(model:SequelizeModel, opts?:any);
    update(obj:any, where:any, opts?:any):SequelizeEmitters;
}
