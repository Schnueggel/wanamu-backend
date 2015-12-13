'use strict';

import TodoList from '../model/todolist';
import Todo from '../model/todo';
import {TodoListNotFound, TodoNotFound, AccessViolation} from '../util/error';
import _ from 'lodash';

export class TodoController {

    /**
     * Create Action
     */
     *create(next, context) {
        const input = context.request.body || {},
            result = {
                data: [],
                success: false,
                error: null
            },
            user = context.req.user,
            isAdmin = user.isAdmin(),
            todolistid = _.get(input, 'data.TodoListId',''),
            queryOptions = {where: {id: todolistid}};

        // ==========================================================================
        // Filter data
        // TODO check how the Model react to different case of fieldnames
        // ==========================================================================
        const data = _.pick(input.data || {}, Todo.getCreateFields(isAdmin));

        context.body = result;

        if (_.isNumber(todolistid) === false) {
            context.status = 422;
            console.error('Todolist id is not a number: ' + todolistid);
            result.error = new TodoListNotFound();
            return;
        }

        // ==========================================================================
        // Admin can create todos on every todolist
        // ==========================================================================
        if (isAdmin === false) {
            queryOptions.where.UserId = user.id;
        }

        // ==========================================================================
        // Todos always belongs to a todolist lets find this
        // ==========================================================================
        let todolist = yield TodoList.findOne(queryOptions);

        if (todolist === null) {
            context.status = 404;
            result.error = new TodoListNotFound();
            return;
        }

        try {
            const options = {fields: Todo.getCreateFields(isAdmin)};

            let todo = yield Todo.create(data, options);
            todo = yield todo.reload();
            result.success = true;

            // ==========================================================================
            // Filter the resulting data
            // Only visible fields will be sent to the user
            // ==========================================================================
            const resultdata = _.pick(todo.get({plain: true}), Todo.getVisibleFields(isAdmin));
            result.data.push(resultdata);
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

    /**
     * Update Action
     * @param id
     */
    *update(id, next, context) {
        let input = context.request.body || {},
            result = {
                data: [],
                success: false,
                error: null
            },
            user = context.req.user,
            isAdmin = user.isAdmin(),
            todolist,
            todo;

        context.body = result;
        // ==========================================================================
        // Try to find the given Todo_
        // ==========================================================================
        todo = yield Todo.findById(id);

        if (todo === null) {
            context.status = 404;
            result.error = new TodoNotFound();
            return;
        }

        // ==========================================================================
        // Filter input data
        // ==========================================================================
        const data = _.pick(input.data || {}, Todo.getUpdateFields(isAdmin));

        try {
            // ==========================================================================
            // Try to find the TodoList of this Todo_ to get the user
            // TODO We mainly need the userid here perhaps we should store it in the user model
            // ==========================================================================
            todolist = yield TodoList.findById(todo.TodoListId);

            // ==========================================================================
            // Check if user owns this todo
            // ==========================================================================
            if (user.isAdmin() === false && (!user.id || todolist.UserId !== user.id)) {
                context.status = 403;
                result.error = new AccessViolation();
                return;
            }

            // ==========================================================================
            // Set the Query options
            // ==========================================================================
            const options = {fields: Todo.getUpdateFields(isAdmin)};

            yield todo.updateAttributes(data, options);
            // ==========================================================================
            // Reload the data to get the values of generated fields like updated aso.
            // ==========================================================================
            todo = yield todo.reload();
            // ==========================================================================
            // Filter the resulting data
            // Only visible fields will be sent to the user
            // ==========================================================================
            const resultdata = _.pick(todo.get({plain: true}), Todo.getVisibleFields(isAdmin));

            result.success = true;

            result.data.push(resultdata);

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

    /**
     * Delete Action
     * @param id
     */
    *deleteTodo(id, next, context) {
        const result = {
                data: [],
                success: false,
                error: null
            },
            user = context.req.user,
            isAdmin = user.isAdmin();

        context.body = result;

        // ==========================================================================
        // Try to find the given todo
        // ==========================================================================
        let todo = yield Todo.findById(id);

        if (todo === null) {
            context.status = 404;
            result.error = new TodoNotFound();
            return;
        }

        try {
            // ==========================================================================
            // Try to find the TodoList of this Todo_ to get the user
            // TODO We mainly need the userid here perhaps we should store it in the TodoModel
            // ==========================================================================
            let todolist = yield TodoList.findById(todo.TodoListId);

            // ==========================================================================
            // Check if user owns this todo
            // ==========================================================================
            if (user.isAdmin() === false && todolist.UserId !== user.id) {
                context.status = 403;
                result.error = new AccessViolation();
                return;
            }

            yield todo.destroy();

            todo = yield todo.reload({
                paranoid: false
            });
            // ==========================================================================
            // Filter the resulting data
            // Only visible fields will be sent to the user
            // ==========================================================================
            let resultdata = _.pick(todo.get({plain: true}), Todo.getVisibleFields(isAdmin));

            result.success = true;
            result.data.push(resultdata);

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
