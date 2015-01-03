var models = require("./models");
var internals = {};

internals.createSystem = function(input, callback){
    var errorMessages = [];
    var name = input.name;
    var description = input.description;
    models.System.create({
        name: name,
        description: description,
        status: true
    }).then(function(system){
        callback(null, system);
    }).catch(function(error){
        errorMessages.push(error);
        callback(new Error(errorMessages));
    });
};

internals.getSystem = function(input, callback){
    var errorMessages = [];
    models.System.find({
        status: true
    }).then(function(system){
        callback(null, system);
    }).catch(function(error){
        errorMessages.push(error);
        callback(new Error(errorMessages));
    });
};

internals.getSystemCount = function(input, callback){
    var errorMessages = [];
    models.System.count(
    ).then(function(count){
        callback(null, count);
    }).catch(function(error){
        errorMessages.push(error);
        callback(new Error(errorMessages));
    });
};

module.exports = internals;