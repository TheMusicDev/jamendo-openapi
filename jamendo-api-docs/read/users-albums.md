Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/users](https://developer.jamendo.com/v3.0/users) [/albums](https://developer.jamendo.com/v3.0/users/albums)

### Description

Given a user, which are the Jamendo albums he has added to myalbums? At the moment 'myalbums' is the sole user-album relation existing, but in the future we may add others. Therefore, the 'relation' parameter and the 'relations' field have just a future-oriented meaning.


Among the returned fields, 'updatedate' represent the date the last user-album relation has been realized, that in this case simply means the date when the user has added the album to myalbums. You can also order results by such value.


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
| album\_id | \[\]integer | One or more album id |
| album\_imagesize | enum: {25, 35, 50, 55, 60, 65, 70, 75, 85, 100, 130, 150, 200, 300, 400, 500, 600} | The cover size in pixel (if not specified, a default one will be returned) |
| relation | \[\]enum: {myalbums} | At the moment, only the relation 'myalbums' is available. In the future we will probably add other relations and you can use this parameter to select one or more of them, at the same way of reviews/tracks. The default at the moment is of course 'myalbums' |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/users/albums/?client_id=your_client_id&format=jsonpretty&limit=3&name=claudod
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
      "albums":[\
        {\
          "id":"2225",\
          "name":"Increase the Dosage",\
          "releasedate":"2006-06-20",\
          "artist_id":"2278",\
          "artist_name":"revolutionvoid",\
          "updatedate":"2010-12-19 16:25:12",\
          "image":"https:\/\/images.jamendo.com\/albums\/s2\/2225\/covers\/1.200.jpg",\
          "relations":{\
            "myalbums":"1"\
          }\
        },\
        {\
          "id":"23777",\
          "name":"Beginner's Luck",\
          "releasedate":"2008-04-23",\
          "artist_id":"339253",\
          "artist_name":"Lindalou_and_Michael_Ryge",\
          "updatedate":"2011-07-05 09:53:04",\
          "image":"https:\/\/images.jamendo.com\/albums\/s23\/23777\/covers\/1.200.jpg",\
          "relations":{\
            "myalbums":"1"\
          }\
        },\
        {\
          "id":"28245",\
          "name":"Dinner for One",\
          "releasedate":"2008-07-07",\
          "artist_id":"340555",\
          "artist_name":"Amity_in_Fame",\
          "updatedate":"2014-02-04 11:21:42",\
          "image":"https:\/\/images.jamendo.com\/albums\/s28\/28245\/covers\/1.200.jpg",\
          "relations":{\
            "myalbums":"1"\
          }\
        },\
        {\
          "id":"37195",\
          "name":"Classical Music - Bach: Partitas for piano (BWV 826,\
           827,\
           828)",\
          "releasedate":"2008-12-24",\
          "artist_id":"346808",\
          "artist_name":"Gianluca_Luisi",\
          "updatedate":"2011-11-24 12:07:48",\
          "image":"https:\/\/images.jamendo.com\/albums\/s37\/37195\/covers\/1.200.jpg",\
          "relations":{\
            "myalbums":"1"\
          }\
        }\
      ]\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)