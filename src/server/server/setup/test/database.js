'use strict';

/**
 * Created by Christian on 5/6/2015.
 */

var Category = require('../../model/category.js'),
    createpromises = [],
    destroypromises = [];

// ==========================================================================
// Collect all truncate promises
// ==========================================================================
destroypromises.push(Category.destroy({
    where: {
        id: {
            $in: [1,2,3]
        }
    }
}));

var completepromise = new Promise(function(resolve, reject) {
    // ==========================================================================
    // First we truncate all tables
    // ==========================================================================
    Promise.all(destroypromises).then(function(){
        // ==========================================================================
        // Create all create data promises
        // ==========================================================================
        createpromises.push(Category.bulkCreate([
            {id: 1, name: 'category1' },
            {id: 2, name: 'category2' },
            {id: 3, name: 'category3', parent: 1}
        ]));

        // ==========================================================================
        // Execute all create data promises and resolve the complete promise.
        // This means the data are in the tables
        // ==========================================================================
        Promise.all(createpromises).then(function(){
            console.log('resolve create');
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    });
});

module.exports = completepromise;
