'use strict';

import TodoList from '../model/todolist';
import {TodoListDefaultNoDelete, AccessViolation, TodoListNotFound} from '../util/error';
import _ from 'lodash';
import  Todo from '../model/todo';

export class TodoListController {
    /**
     * TODO implement
     */
    * createTodolist(next, context) {
        throw new Error('Not Implemented yet');
    }

    /**
     * Gets a single todolist
     */
    * getTodolist(id, next, context) {
        const user = context.req.user,
            isAdmin = user.isAdmin(),
            todolistVisibleFields = TodoList.getVisibleFields(isAdmin),
            result = {
                error: null,
                success: false,
                data: []
            };
        let todolist = null;
        context.body = result;

        if (id === 'default') {
            todolist = yield TodoList.findOne({
                where: {
                    UserId: user.id,
                    type: id
                },
                attributes: todolistVisibleFields,
                include: [{model: Todo, attributes: Todo.getVisibleFields(isAdmin)}]
            });
        } else {
            todolist = yield TodoList.findById(id, {
                attributes: todolistVisibleFields,
                include: [{model: Todo, attributes: Todo.getVisibleFields(isAdmin)}]
            });
        }

        if (!todolist) {
            context.status = 404;
            result.error = new TodoListNotFound();
            return;
        }

        if (!isAdmin && todolist.UserId !== user.id) {
            context.status = 403;
            result.error = new AccessViolation();
            return;
        }

        // ==========================================================================
        // Filter the output data
        // We have to add the virtual fields Todos to the list. Else Todos will not be
        // included. Because its not a normal attribute of the TodoList model.
        // ==========================================================================
        todolistVisibleFields.push('Todos');
        const resultdata = _.pick(todolist.get({plain: true}), todolistVisibleFields);

        result.success = true;
        result.data.push(resultdata);
    }

    /**
     * Gets a single todolist
     *
     * Can accept following input:
     *
     * ```js
     * {
 *    userid: <int> //only by admins to select todolists from a user
 *    includetodos: <boolean, false> //if the true query will include todos off the selected todolists. Default: false
 * }
     * ```
     */
    * listTodolist(next, context) {
        const input = context.request.body || {},
            limit = input.limit || 100,
            offset = input.offset || 0,
            user = context.req.user,
            isAdmin = user.isAdmin(),
            result = {
                count: 0,
                error: null,
                success: false,
                data: []
            };

        let include = [],
            id = user.id;

        context.body = result;

        // ==========================================================================
        // If is admin and userid is set we select those todolists
        // ==========================================================================
        if (isAdmin && input.userid) {
            id = input.userid;
        }

        if (input.includetodos === true) {
            include = [{model: Todo, attributes: Todo.getVisibleFields(isAdmin)}];
        }
        const todolistresult = yield TodoList.findAndCountAll({
            where: {
                UserId: id
            },
            offset: offset,
            limit: limit,
            include: include,
            attributes: TodoList.getVisibleFields(isAdmin),
            raw: true
        });

        if (!todolistresult) {
            return;
        }

        result.data = todolistresult.rows;
        result.count = todolistresult.count;

        result.success = true;
    }


    /**
     * Delete Action
     *
     * Sends the folling errors:
     *
     * Error.TodoListNotFound, 404
     * Error.TodoListDefaultNoDelete 403
     * Error.AccessViolation 403
     * Error.ValidationError 422
     * Error 500
     *
     * @param {int} id
     */
    * deleteTodoList(id, next, context) {
        let result = {
                data: [],
                success: false,
                error: null
            },
            user = context.req.user,
            isAdmin = user.isAdmin(),
            todolist;

        context.body = result;

        // ==========================================================================
        // Try to find the given todo
        // ==========================================================================
        todolist = yield TodoList.findById(id);

        if (todolist === null) {
            context.status = 404;
            result.error = new TodoListNotFound();
            return;
        }


        if (todolist.isDefault()) {
            context.status = 403;
            result.error = new TodoListDefaultNoDelete();
            return;
        }

        // ==========================================================================
        // Check if user owns context todo
        // ==========================================================================
        if (!isAdmin && todolist.UserId !== user.id) {
            context.status = 403;
            result.error = new AccessViolation();
            return;
        }

        try {
            yield todolist.destroy();
            result.success = true;
        } catch (err) {
            console.error(err);
            if (err instanceof Todo.sequelize.ValidationError) {
                context.status = 422;
                result.error = err;
            } else {
                context.status = 500;
                result.error = new Error('Unable to create todo');
            }
        }
    }
}
