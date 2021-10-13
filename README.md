# in-memory-user-permissions-setting
Using a series of API calls, change the access permission of an email address (the user) to a feature

# Run instructions:
1.  Clone this repo
2.  Build it in a terminal by running `yarn run tsc-watch`
3.  In another terminal, start it by running `yarn run start`

# Possible queries:
1.  Check the existing permission for a feature name associated with an email address 
    Pass in "email" and "featureName" as request parameters
    ### Postman input
    GET req url:
    http://localhost:5000/feature?email=yihfoo@gmail.com&featureName=sidePage

2.  Create or update a permission for a feature name associated with an email address 
    If a profile does not exists for that email address, create one

    ### Postman input
    POST req url: http://localhost:5000/feature
    JSON req body:
    {
        "featureName": "mainPage",
        "email": "yihfoo@gmail.com",
        "enable": true
    }
