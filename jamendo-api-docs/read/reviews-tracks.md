Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0)/reviews [/tracks](https://developer.jamendo.com/v3.0/setuser/tracks)

### Description

Since February 2021, a new field 'track\_audiodownload\_allowed' is returned in this api.
It contains a boolean to know if you can propose or not the possibility to download the track through your application.
Indeed, now Jamendo artists can choose if they want to allow or not the download of their tracks.
If you are already using this api, please take time to modify your code to take into account this new 'track\_audiodownload\_allowed' value.
Moreover, in April 2022, the content of the field 'track\_audiodownload' returned in this api will become an empty string if 'track\_audiodownload\_allowed' is false.


This method let you filter and browse tracks reviews, which are available as a feature on Jamendo.com from May 2012.

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
| track\_id | \[\]integer | One or more track id |
| album\_id | integer | An album id |
| artist\_id | integer | An artist id |
| audioformat | enum: {mp31, mp32, ogg, flac} | The audio format you wish to get in the 'audio' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audioformat' is declared, mp31 will be used by default. |
| audiodlformat | enum: {mp31, mp32, ogg, flac} | The audio download format you wish to get in the 'audiodownload' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audiodlformat' is declared, the value given to 'audioformat' will be used as default, and if neither 'audioformat' is declared, 'mp32' will be the default |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/reviews/tracks/?client_id=your_client_id&format=jsonpretty&limit=2&order=score_desc+addeddate_desc&lang=en
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
      "id":"533416",\
      "title":"",\
      "text":"Hi",\
      "dateadded":"2023-12-09",\
      "agreecnt":"5",\
      "lang":"en",\
      "user_id":"8849127",\
      "user_name":"s12384657@students.duvalschools.org",\
      "user_dispname":"Elektra_L",\
      "score":"10",\
      "track_id":"2133898",\
      "track_name":"One Gift Shawty (For Christmas)",\
      "album_id":"549522",\
      "artist_id":"484695",\
      "track_audiodownload_allowed":true,\
      "track_license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-nd\/3.0\/",\
      "track_audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=2133898&format=mp31&from=app-devsite",\
      "track_audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/2133898\/mp32\/"\
    },\
    {\
      "id":"532432",\
      "title":"",\
      "text":"Love it",\
      "dateadded":"2023-07-15",\
      "agreecnt":"0",\
      "lang":"en",\
      "user_id":"8678316",\
      "user_name":"jonze785@gmail.com",\
      "user_dispname":"jonze785",\
      "score":"10",\
      "track_id":"2026253",\
      "track_name":"Moon Reflections",\
      "album_id":"519570",\
      "artist_id":"485950",\
      "track_audiodownload_allowed":false,\
      "track_license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-nd\/3.0\/",\
      "track_audio":"",\
      "track_audiodownload":""\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)