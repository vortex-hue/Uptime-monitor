/*
* Create configs to export
*/

// Create an object which can would be exported
var environments = {};

// staging environment
environments.staging = {
    'port': 3000,
    'envName': 'staging'
};


// developemt environments settings
environments.dev = {
    'port': 7000,
    'envName': 'development'
};


//production environments settings
environments.production = {
    'port': 5000,
    'envName': 'production'
};

// determine which config to export

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// determine the one to export
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging ;

//to export the module
module.exports = environmentToExport;
