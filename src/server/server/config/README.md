# Description

Config contains pre configured and setup modules.

## The Config

To use the config use ```require('../config')``` depending on your path. This will load the index.js in the config folder.

The config files resides in ./json. Depending on your Environment it will automatically load the specific json file

All file config inherit from the default.json

### The loading order

Later loaded config will overwrite preceding config

1. First arguments of the node process that started the application will be loaded first
 
2. Then the environment will be loaded and overwrite the argv

3. default.json will be loaded

4. In case of test environment the development.json is loaded. Because test shares most of development config

5. The environment specific json file is loaded

6 The local.json is loaded if it exists


### local.json
To overwrite the config locally create a local.json in ./json folder. Dont commit the local.json into git
