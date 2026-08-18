Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/playlists](https://developer.jamendo.com/v3.0/playlists)

### Description

A playlist is a dynamic collection of tracks, and the user who created it and own it, can modify/delete/publish/mask it in any time. This method let you select playlists filtering by the most characteristing parameters.

Among the returned fields, 'zip' shows the url to be used for getting the playlist's tracks in high quality mp3, contained in a zip; note that the zip may contain less tracks than what the playlist actually contains, as an internal limit of about 100 is set on our servers.

New orders and social feature will probably be added in the futures.

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
| order | \[\]enum: {name, id, creationdate} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one. |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | \[\]integer | One or more playlist id |
| name | string | An playlist name |
| namesearch | string | Search a playlist by name (playlist\_name matching \*seachquery\*) |
| user\_id | \[\]integer | One or more author id (without requiring any access token) |
| access\_token | string | A valid access token corresponding to the Jamendo user you want to get data for. The authorization token is obtained through the [OAuth2 process](https://developer.jamendo.com/v3.0/oauth2). |
| user\_name | string | One or more user name |
| datebetween | string | Created between dates. This parameter need a value to be used for a between closed interval. The "from" and "to" parts are both mandatory, must be separated by an underscore ("\_"), and must be both integer |
| audioformat | enum: {mp32} | The audio format you wish to use on the fileurl returned field. At the moment mp32 (mp3 192kbps) is the only existing format. |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/playlists/?client_id=your_client_id&format=jsonpretty&namesearch=cool&datebetween=2012-01-01_2012-02-01
```

#### Response:

`{
"headers":{
    "status":"success",
    "code":0,
    "error_message":"",
    "warnings":"",
    "results_count":9
},
"results":[\
    {\
      "id":"218277",\
      "name":"some cool stuff",\
      "creationdate":"2012-01-04",\
      "user_id":"1293438",\
      "user_name":"hywayace",\
      "zip":"https:\/\/storage.jamendo.com\/download\/p218277\/mp32\/",\
      "shorturl":"https:\/\/jamen.do\/l\/p218277",\
      "shareurl":"https:\/\/www.jamendo.com\/list\/p218277"\
    },\
    {\
      "id":"218560",\
      "name":"coole,\
       l\u00e4ssige Musik",\
      "creationdate":"2012-01-07",\
      "user_id":"1291542",\
      "user_name":"Die Blume",\
      "zip":"https:\/\/storage.jamendo.com\/download\/p218560\/mp32\/",\
      "shorturl":"https:\/\/jamen.do\/l\/p218560",\
      "shareurl":"https:\/\/www.jamendo.com\/list\/p218560"\
    },\
    {\
      "id":"218691",\
      "name":"cool",\
      "creationdate":"2012-01-09",\
      "user_id":"1297727",\
      "user_name":"tripack88",\
      "zip":"https:\/\/storage.jamendo.com\/download\/p218691\/mp32\/",\
      "shorturl":"https:\/\/jamen.do\/l\/p218691",\
      "shareurl":"https:\/\/www.jamendo.com\/list\/p218691"\
    },\
    {\
      "id":"218887",\
      "name":"Just Cool",\
      "creationdate":"2012-01-12",\
      "user_id":"506357",\
      "user_name":"chepetusa",\
      "zip":"https:\/\/storage.jamendo.com\/download\/p218887\/mp32\/",\
      "shorturl":"https:\/\/jamen.do\/l\/p218887",\
      "shareurl":"https:\/\/www.jamendo.com\/list\/p218887"\
    },\
    {\
      "id":"219032",\
      "name":"Coole Lieder",\
      "creationdate":"2012-01-14",\
      "user_id":"1301432",\
      "user_name":"Ason814",\
      "zip":"https:\/\/storage.jamendo.com\/download\/p219032\/mp32\/",\
      "shorturl":"https:\/\/jamen.do\/l\/p219032",\
      "shareurl":"https:\/\/www.jamendo.com\/list\/p219032"\
    },\
    {\
      "id":"219177",\
      "name":"Cool",\
      "creationdate":"2012-01-16",\
      "user_id":"1303091",\
      "user_name":"d.crik",\
      "zip":"https:\/\/storage.jamendo.com\/download\/p219177\/mp32\/",\
      "shorturl":"https:\/\/jamen.do\/l\/p219177",\
      "shareurl":"https:\/\/www.jamendo.com\/list\/p219177"\
    },\
    {\
      "id":"219227",\
      "name":"Cool Jazz",\
      "creationdate":"2012-01-17",\
      "user_id":"1059233",\
      "user_name":"thegrigg",\
      "zip":"https:\/\/storage.jamendo.com\/download\/p219227\/mp32\/",\
      "shorturl":"https:\/\/jamen.do\/l\/p219227",\
      "shareurl":"https:\/\/www.jamendo.com\/list\/p219227"\
    },\
    {\
      "id":"219754",\
      "name":"Electro Cool",\
      "creationdate":"2012-01-24",\
      "user_id":"48468",\
      "user_name":"darkeliot",\
      "zip":"https:\/\/storage.jamendo.com\/download\/p219754\/mp32\/",\
      "shorturl":"https:\/\/jamen.do\/l\/p219754",\
      "shareurl":"https:\/\/www.jamendo.com\/list\/p219754"\
    },\
    {\
      "id":"219949",\
      "name":"cool-rithm",\
      "creationdate":"2012-01-25",\
      "user_id":"1310674",\
      "user_name":"luluby",\
      "zip":"https:\/\/storage.jamendo.com\/download\/p219949\/mp32\/",\
      "shorturl":"https:\/\/jamen.do\/l\/p219949",\
      "shareurl":"https:\/\/www.jamendo.com\/list\/p219949"\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)