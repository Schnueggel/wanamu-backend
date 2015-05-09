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
 * Sequelize default Model
 */
interface Model {
    find (options: any) : Promise
    findAndCountAll(findOptions: any, queryOptions: any) : Promise
    sync (options: any) : Promise
    create(options: any) : Promise
}
