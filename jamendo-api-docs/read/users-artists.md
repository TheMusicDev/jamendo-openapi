Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/users](https://developer.jamendo.com/v3.0/users) [/artists](https://developer.jamendo.com/v3.0/users/artists)

### Description

Given a user, which are the Jamendo artists he became a fan of? At the moment 'fan' is the sole user-artist relation existing, but in the future we may add others. Therefore, the 'relation' parameter and the 'relations' field have just a future-oriented meaning.

Among the returned fields, 'updatedate' represent the date the last user-artist relation has been realized, that in this case simply means the date when the user has became fan of the artist. You can also order results by such value.

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
| order | \[\]enum: {updatedate} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one. |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | \[\]integer | One or more user id (without requiring any access token) |
| access\_token | string | A valid access token corresponding to the Jamendo user you want to get data for. The authorization token is obtained through the [OAuth2 process](https://developer.jamendo.com/v3.0/oauth2). |
| name | string | One or more user names |
| imagesize | enum: {30, 50, 100} | The user avatar size in pixel (if not specified, a default one will be returned) |
| artist\_id | \[\]integer | One or more artist id |
| relation | \[\]enum: {fan} | At the moment, only the relation 'fan' is available. In the future we will probably add other relations and you can use this parameter to select one or more of them, at the same way of reviews/tracks. The default at the moment is of course 'fan' |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/users/artists/?client_id=your_client_id&format=jsonpretty&limit=3&name=claudod
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
      "image":"https:\/\/images.jamendo.com\/users\/s972\/972174\/covers\/1.50.jpg",\
      "artists":[\
        {\
          "id":"104",\
          "name":"Tryad",\
          "image":"https:\/\/images.jamendo.com\/artists\/s0\/104\/covers\/1.200.jpg?t=1470326207",\
          "joindate":"2005-04-13",\
          "updatedate":"2013-09-09 12:01:44",\
          "relations":{\
            "fan":"1"\
          }\
        },\
        {\
          "id":"264",\
          "name":"AS-POTIRONT!",\
          "image":"https:\/\/images.jamendo.com\/artists\/a\/as-potiront.jpg",\
          "joindate":"2005-07-04",\
          "updatedate":"2014-10-23 11:35:57",\
          "relations":{\
            "fan":"1"\
          }\
        },\
        {\
          "id":"1030",\
          "name":"Suerte",\
          "image":"https:\/\/images.jamendo.com\/artists\/s\/suerte.jpg",\
          "joindate":"2006-01-31",\
          "updatedate":"2013-09-30 09:10:55",\
          "relations":{\
            "fan":"1"\
          }\
        },\
        {\
          "id":"3498",\
          "name":"Nocreeps",\
          "image":"https:\/\/images.jamendo.com\/artists\/n\/nocreeps.jpg",\
          "joindate":"2006-11-01",\
          "updatedate":"2013-02-25 11:55:06",\
          "relations":{\
            "fan":"1"\
          }\
        }\
      ]\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)