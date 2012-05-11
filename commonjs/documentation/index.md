# Ti.DataJS Module

## Desription

Provides access to Microsoft's DataJS through Titanium. DataJS makes it easy to interact with OData through XML or JSON.

## Getting Started

View the [Using Titanium Modules](http://docs.appcelerator.com/titanium/2.0/#!/guide/Using_Titanium_Modules) document for instructions on getting
started with using this module in your application.

## Accessing the Module

To access this module from JavaScript, you would do the following:

	var DataJS = require("ti.datajs");

The DataJS variable is a reference to the Module object.

## Installation Instructions

There is a "microsoft.datajs.js" file in this module's directory. Copy this file into the Resources directory of your
application.

## Methods

### void read(urlOrRequest, success, error, handler, httpClient, metadata)
Please see [Microsoft's DataJS documentation][datajs] on CodePlex to learn more.
The first three arguments are required. The last three are optional.

#### Example
    DataJS.read({
            requestUri: baseURL,
            headers: { Accept: 'application/atom+xml' }
        },
        function (data, response) {
            Ti.API.info(JSON.stringify(data));
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }

### void request(request, success, error, handler, httpClient, metadata)
Please see [Microsoft's DataJS documentation][datajs] on CodePlex to learn more.
The first three arguments are required. The last three are optional.

#### Example
    DataJS.request({
            requestUri: uri,
            headers: {
                'Content-Type': 'application/atom+xml',
                Accept: 'application/atom+xml'
            },
            method: 'PUT',
            data: item
        },
        function (data, response) {
            Ti.API.info(JSON.stringify(data));
        },
        function (err) {
            Ti.API.error('Error occurred ' + JSON.stringify(err));
        }
    );

## Usage
See Example.

## Author

Dawson Toth

## Module History

View the [change log](changelog.html) for this module.

## Feedback and Support

Please direct all questions, feedback, and concerns to [info@appcelerator.com](mailto:info@appcelerator.com?subject=Ti.DataJS%20Module).

## License

Copyright(c) 2011-2012 by Appcelerator, Inc. All Rights Reserved. Please see the LICENSE file included in the distribution for further details.

[datajs]: http://datajs.codeplex.com/