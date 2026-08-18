Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/tracks](https://developer.jamendo.com/v3.0/tracks) [/similar](https://developer.jamendo.com/v3.0/tracks/similar)

### Description

Given the id of a Jamendo track, /tracks/similar let you find other similar Jamendo tracks. The 'no\_artist' and 'no\_album' filters aim to improve results by filtering out typically the album and/or artist relater to the song you are asking similarity for.


Similarity is mostly based on tags (genre, instrument, mood, etc), then acousticelectric, vocalinstrumental, and less important xartists\_idstr, lang, gender.


Results are sorted by relevancy, and relevancy is represented by the field 'score' (max score is 1).

### Required parameters

_client\_id && id_

### Parameter List

| Name | Type | Description |
| --- | --- | --- |
| client\_id | string | A Client Id provided by [devportal.jamendo.com](https://devportal.jamendo.com/). |
| format | enum: {xml, json, jsonpretty} | The results formatting type |
| callback | string | Use this parameter to have the response json wrapped in a callback function (jsonp technique). Such feature is enable only for json format and GET requests; if used in combination with other formats or a not-get request, the callback parameter is simply ignored and a warning is raised |
| offset | integer | The position to start returning results from |
| limit | string | The max number of results to return. Default is 10 and Max is 200. Using the keyword 'all' still a max of 200 rows will be returned |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| imagesize | enum: {25, 35, 50, 55, 60, 65, 70, 75, 85, 100, 130, 150, 200, 300, 400, 500, 600} | The cover size in pixel (if not specified, a default one will be returned) |
| audioformat | enum: {mp31, mp32, ogg, flac} | The audio format you wish to get in the 'audio' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audioformat' is declared, mp31 will be used by default. |
| audiodlformat | enum: {mp31, mp32, ogg, flac} | The audio download format you wish to get in the 'audiodownload' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audiodlformat' is declared, the value given to 'audioformat' will be used as default, and if neither 'audioformat' is declared, 'mp32' will be the default |
| include | \[\]enum: {licenses, musicinfo, stats, lyrics} | With this special parameter you can append to the results some additional fields, not returned by default. |
| id | integer | The id of the track which the returned similar tracks must be similar to |
| no\_artist | integer | If you have the artist\_id information of the track you are searching similarity for, you can use that artist\_id to exclude his tracks from the results |
| no\_album | integer | If you have the artist\_id information of the track you are searching similarity for, you can use that artist\_id to exclude his tracks from the results |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/tracks/similar/?client_id=your_client_id&format=jsonpretty&limit=3&include=musicinfo&id=628410&no_album=72779
```

#### Response:

`{
"headers":{
    "status":"success",
    "code":0,
    "error_message":"",
    "warnings":"",
    "results_count":0
},
"results":[\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)