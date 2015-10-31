'use strict';

import assert from 'assert';
import Todo from '../../../dist/server/server/model/todo.js';
import User from '../../../dist/server/server/model/user.js';
import ErrorUtil from '../../../dist/server/server/util/error.js';
import co from 'co';

describe('Test Todo Model', () => {

    it('Should create Todo', (done) => {
        assert.equal(typeof Todo, 'object');
        assert.equal(typeof User, 'object');

        co(testCreateTodo).then(done).catch(done);
    });
});

/**
 * Test TodoCreation
 */
function* testCreateTodo() {

}
