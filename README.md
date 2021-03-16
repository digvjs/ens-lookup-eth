# ENS check on https://app.ens.domains

Check if ENS is taken or available using this nodejs script.

## System compatibility

* Node v14.16.0
* NPM v6.14.11


## Knowledge guide

* `/ens_to_process`:  Put the json files to be parsed in this directory.
* `/ens_processed`: Holds the files which are parsed successfully.
* `/reports`: This directory holds the reports for every individual processed file.

Before running the script dump your ENS json files in `/ens_to_process` directory. The format of the json should follow below format -

```
[
    {"name": "test1.eth"},
    {"name": "test2.eth"},
    {"name": "test3.eth"},
    ...,
    ...
]
```

# Setup Guide

* Clone this repo and cd into the project directory

* Install npm dependencies
    ```
    npm install
    ```

* Next once you have some json files added to `/ens_to_process` directory then run the script -
    ```
    npm index.js
    ```
    This will parse the ENS names and create a report with results whether ens if taken or available.