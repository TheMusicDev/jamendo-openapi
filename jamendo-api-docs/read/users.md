Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/users](https://developer.jamendo.com/v3.0/users)

### Description

With this method you can get the main information about a user. We chose to let this method be only a 'look up' rather than a 'search' to afford just a light access to our user base.

### Required parameters

_client\_id && (id \|\| access\_token \|\| name)_

### Parameter List

| Name | Type | Description |
| --- | --- | --- |
| client\_id | string | A Client Id provided by [devportal.jamendo.com](https://devportal.jamendo.com/). |
| format | enum: {xml, json, jsonpretty} | The results formatting type |
| callback | string | Use this parameter to have the response json wrapped in a callback function (jsonp technique). Such feature is enable only for json format and GET requests; if used in combination with other formats or a not-get request, the callback parameter is simply ignored and a warning is raised |
| offset | integer | The position to start returning results from |
| limit | string | The max number of results to return. Default is 10 and Max is 200. Using the keyword 'all' still a max of 200 rows will be returned |
| order | \[\]enum: {} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one. |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | \[\]integer | One or more user id (without requiring any access token) |
| access\_token | string | A valid access token corresponding to the Jamendo user you want to get data for. The authorization token is obtained through the [OAuth2 process](https://developer.jamendo.com/v3.0/oauth2). |
| name | string | One or more user names |
| imagesize | enum: {30, 50, 100} | The user avatar size in pixel (if not specified, a default one will be returned) |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/users/?client_id=your_client_id&format=jsonpretty&name=claudod
```

#### Response:

`{
"headers":{
    "status":"success",
    "code":0,
    "error_message":"",
    "warnings":"",
    "results_count":1
},
"results":[\
    {\
      "name":"claudod",\
      "dispname":"claudod",\
      "id":"972174",\
      "lang":"en",\
      "creationdate":"2010-10-17",\
      "image":"https:\/\/images.jamendo.com\/users\/s972\/972174\/covers\/1.50.jpg"\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)