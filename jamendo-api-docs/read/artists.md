Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/artists](https://developer.jamendo.com/v3.0/artists)

### Description

The artist entity may be consider as the second most important musical entity.


If the simple 'artists' method let you filter by the most obvious parameters and returns just the main fields, many submethods (as artists/tracks, artists/albums, artists/locations, artists/musicinfo) are provided.

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
| order | \[\]enum: {name, id, joindate, popularity\_total, popularity\_month, popularity\_week} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one.<br>All rating orders (such as "popularity\_total") follow a more specific norm: they use "desc" as default and will forcedly use "desc" even if you requested an "asc". |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | \[\]integer | One or more artist id |
| name | string | An artist name |
| namesearch | string | Search an artist by name (artist\_name matching \*seachquery\*) |
| hasimage | enum: {true, 1} | Return only artists with an image |
| datebetween | string | Filter on the artist joining date (the date artists joined Jamendo). This parameter need a value to be used for a between closed interval. The "from" and "to" parts are both mandatory, must be separated by an underscore ("\_"), and must be both in the yyyy-mm-dd format |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/artists/?client_id=your_client_id&format=jsonpretty&name=we+are+fm
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
      "id":"376782",\
      "name":"WE ARE FM",\
      "website":"https:\/\/www.facebook.com\/wearefm",\
      "joindate":"2011-12-29",\
      "image":"https:\/\/usercontent.jamendo.com?type=artist&id=376782&width=300",\
      "shorturl":"https:\/\/jamen.do\/a\/376782",\
      "shareurl":"https:\/\/www.jamendo.com\/artist\/376782"\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)