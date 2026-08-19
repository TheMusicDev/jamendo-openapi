Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/radios](https://developer.jamendo.com/v3.0/radios) [/stream](https://developer.jamendo.com/v3.0/radios/stream)

### Description

**WARNING: The stream link returned is not more working, and it could be never fixed...**
Giving a radio id or a radio idstr, this method will return the streaming url,
the playingnow object containing information about the currently streamed track,
the callmeback object indicating in how many ms the current track will be
finished and the next one will start.


### Required parameters

_client\_id && (id \|\| name)_

### Parameter List

| Name | Type | Description |
| --- | --- | --- |
| client\_id | string | A Client Id provided by [devportal.jamendo.com](https://devportal.jamendo.com/). |
| format | enum: {xml, json, jsonpretty} | The results formatting type |
| callback | string | Use this parameter to have the response json wrapped in a callback function (jsonp technique). Such feature is enable only for json format and GET requests; if used in combination with other formats or a not-get request, the callback parameter is simply ignored and a warning is raised |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | integer | A radio id |
| type | enum: {www, pro} | Jamendo has its featured www.jamendo.com ('www') and licensing.jamendo.com ('pro') radios, and may add some other types in the future. The api returns only 'www' radios by default, as 'pro' radios are for commercial stores and places only (read this api description for more info). |
| name | string | A radio name (unique and thus identifying) |
| imagesize | enum: {150, 30} | The radio image size in pixel (if not specified, a default one will be returned) |
| track\_imagesize | The cover size in pixel (if not specified, a default one will be returned) | The track cover size in pixel (if not specified, a default one will be returned) |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/radios/stream/?client_id=your_client_id&format=jsonpretty&name=rock
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
      "id":3,\
      "name":"rock",\
      "dispname":"Rock Radio",\
      "type":"www",\
      "image":"https:\/\/images.jamendo.com\/new_jamendo_radios\/rock150.jpg",\
      "stream":"https:\/\/streaming.jamendo.com\/JamRock",\
      "playingnow":{\
        "track_id":0,\
        "artist_id":0,\
        "album_id":0,\
        "album_name":"",\
        "track_name":"",\
        "track_image":"",\
        "artist_name":""\
      },\
      "callmeback":""\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)