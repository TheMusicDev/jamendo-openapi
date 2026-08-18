Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0)/reviews [/albums](https://developer.jamendo.com/v3.0/setuser/albums)

### Description

This method let you filter and browse albums reviews.

In addition to the parameters-related fields, most important returned fields are the number of agreements on the review ( _agreecnt_), the rate assigned by the user ( _score_), the review text ( _text_) and title ( _title_).

### Required parameters

_client\_id_

### Parameter List

| Name | Type | Description |
| --- | --- | --- |
| client\_id | string | A Client Id provided by [devportal.jamendo.com](https://devportal.jamendo.com/). |
| format | enum: {xml, json, jsonpretty} | The results formatting type |
| callback | string | Use this parameter to have the response json wrapped in a callback function (jsonp technique). Such feature is enable only for json format and GET requests; if used in combination with other formats or a not-get request, the callback parameter is simply ignored and a warning is raised |
| offset | integer | The position to start returning results from |
| limit | string | The max number of results to return. Default is 10 and Max is 200. Using the keyword 'all' still a max of 200 rows will be returned |
| order | \[\]enum: {addeddate, score, id} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one. |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | \[\]integer | One or more review id |
| lang | string | The review's language. We accept the standard 2 letters format, like "en", "fr", "it", etc) |
| datebetween | string | Released between dates. This parameter need a value to be used for a between closed interval. The "from" and "to" parts are both mandatory, must be separated by an underscore ("\_"), and must be both in the yyyy-mm-dd format |
| user\_id | integer | One or more user id (without requiring any access token) |
| access\_token | string | A valid access token corresponding to the Jamendo user you want to get data for. The authorization token is obtained through the [OAuth2 process](https://developer.jamendo.com/v3.0/oauth2). |
| hasscore | boolean | Some reviews may be written without score. This parameter allows to select reviews only with/without a score |
| album\_id | \[\]integer | One or more album id |
| artist\_id | integer | An artist id |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/reviews/albums/?client_id=your_client_id&format=jsonpretty&limit=2&order=addeddate_asc&lang=en&hasscore=1&artist_id=376782
```

#### Response:

`{
"headers":{
    "status":"success",
    "code":0,
    "error_message":"",
    "warnings":"",
    "results_count":2
},
"results":[\
    {\
      "id":"387930",\
      "title":"Good album",\
      "text":"Hi guys!\r\nCongratulations for \"My world\". I discovered this track on the Jamendo facebook page and it's just awesome. I haven't listened to the whole album yet but I'll do it straight away! Thanks for sharing!",\
      "dateadded":"2012-02-03",\
      "agreecnt":"0",\
      "lang":"en",\
      "user_id":"592597",\
      "user_name":"morganejamendo",\
      "user_dispname":"morganejamendo",\
      "score":"8",\
      "album_id":"104336",\
      "album_name":"Season One",\
      "artist_id":"376782"\
    },\
    {\
      "id":"388939",\
      "title":"Awesome!!!!!!",\
      "text":"I absolutely love the whole album!!! You guys have a great sound faving you right away!! people must hear you!!!\r\n\r\nWell done! you have a fan",\
      "dateadded":"2012-02-11",\
      "agreecnt":"4",\
      "lang":"en",\
      "user_id":"485198",\
      "user_name":"jem9",\
      "user_dispname":"jem9",\
      "score":"10",\
      "album_id":"104336",\
      "album_name":"Season One",\
      "artist_id":"376782"\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)