Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/playlists](https://developer.jamendo.com/v3.0/playlists) [/tracks](https://developer.jamendo.com/v3.0/playlists/tracks)

### Description

Since February 2021, a new field 'audiodownload\_allowed' is returned in this api.
It contains a boolean to know if you can propose or not the possibility to download the track through your application.
Indeed, now Jamendo artists can choose if they want to allow or not the download of their tracks.
If you are already using this api, please take time to modify your code to take into account this new 'audiodownload\_allowed' value.
Moreover, in April 2022, the content of the field 'audiodownload' returned in this api will become an empty string if 'audiodownload\_allowed' is false.


Returns playlist entity containing the list of belonging tracks.



In 2015 Jamendo introduced the possibility to publish **singles**, that is tracks with no album associated. You can use the 'track\_type' parameter to get only singles, album tracks or both. By default we only return album tracks, because singles have all albums fields (album\_\*) empty, and that could easily create bugs.
Take into account that all tracks have an 'image' associated. In the case of an album track 'image' is equivalent to 'album\_image', whereas in case of a single 'album\_image' is always empty.


### Required parameters

_client\_id && (id \|\| name \|\| user\_id \|\| access\_token \|\| user\_name)_

### Parameter List

| Name | Type | Description |
| --- | --- | --- |
| client\_id | string | A Client Id provided by [devportal.jamendo.com](https://devportal.jamendo.com/). |
| format | enum: {xml, json, jsonpretty} | The results formatting type |
| callback | string | Use this parameter to have the response json wrapped in a callback function (jsonp technique). Such feature is enable only for json format and GET requests; if used in combination with other formats or a not-get request, the callback parameter is simply ignored and a warning is raised |
| offset | integer | The position to start returning results from |
| limit | string | The max number of results to return. Default is 10 and Max is 200. Using the keyword 'all' still a max of 200 rows will be returned |
| order | \[\]enum: {name, id, creationdate, track\_id, track\_name, track\_added\_date, track\_position} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one. |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | \[\]integer | One or more playlist id |
| name | string | An playlist name |
| namesearch | string | Search a playlist by name (playlist\_name matching \*seachquery\*) |
| user\_id | \[\]integer | One or more author id (without requiring any access token) |
| access\_token | string | A valid access token corresponding to the Jamendo user you want to get data for. The authorization token is obtained through the [OAuth2 process](https://developer.jamendo.com/v3.0/oauth2). |
| user\_name | string | One or more user name |
| datebetween | string | Created between dates. This parameter need a value to be used for a between closed interval. The "from" and "to" parts are both mandatory, must be separated by an underscore ("\_"), and must be both integer |
| audioformat | enum: {mp31, mp32, ogg, flac} | The audio format you wish to get in the 'audio' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audioformat' is declared, mp31 will be used by default. |
| track\_type | \[\]enum: {single, albumtrack} | Select only tracks of a certain type. By default we return only albumtracks to avoid the high risk of bugging applications (especially those built before 2015, that is before the existence of singles). Using 'track\_type=single albumtrack' you will select both types |
| imagesize | enum: {25, 35, 50, 55, 60, 65, 70, 75, 85, 100, 130, 150, 200, 300, 400, 500, 600} | The cover size in pixel (if not specified, a default one will be returned) |
| positionbetween | string | Filter on the track position in the playlist. This parameter need a value to be used for a between closed interval. The "from" and "to" parts are both mandatory, must be separated by an underscore ("\_"), and must be both integer |
| audiodlformat | enum: {mp31, mp32, ogg, flac} | The audio download format you wish to get in the 'audiodownload' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audiodlformat' is declared, the value given to 'audioformat' will be used as default, and if neither 'audioformat' is declared, 'mp32' will be the default |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/playlists/tracks/?client_id=your_client_id&format=jsonpretty&limit=2&name=Instrumental&track_type=albumtrack
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