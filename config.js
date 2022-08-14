// Create and export configuration variables


// A container for all environments
let environments = {}

// staging environment
environments.staging = {
    'httpPort':3000,
    'httpsPort':3001,
    'envName': "staging"
}

//production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort':5001,
    'envName': "production"
}

//Determine which environment was passed as a command line argument
let currentEnvironment = typeof (process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase() : ""

// Check that the passed environment is one of those defined above else default to staging
let environmentToExport = typeof (environments[currentEnvironment]) == "object" ? environments[currentEnvironment]: environments.staging


// Export the module
module.exports = environmentToExport