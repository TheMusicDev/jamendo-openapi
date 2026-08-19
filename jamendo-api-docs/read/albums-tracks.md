Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/albums](https://developer.jamendo.com/v3.0/albums) [/tracks](https://developer.jamendo.com/v3.0/albums/tracks)

### Description

Since February 2021, a new field 'zip\_allowed' is returned in this api.
It contains a boolean to know if you can propose or not the possibility to download the album through your application.
Indeed, now Jamendo artists can choose if they want to allow or not the download of their tracks.
If you are already using this api, please take time to modify your code to take into account this new 'zip\_allowed' value.
Moreover, in April 2022, the content of the field 'zip' returned in this api will become an empty string if 'zip\_allowed' is false.


This method select and filter album entities and their belonging tracks. As usual, the returned fields are the same of the parent method ('albums' in this case), plus some specific fields for each tracks.

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
| order | \[\]enum: {name, id, releasedate, artist\_id, artist\_name, popularity\_total, popularity\_month, popularity\_week, track\_id, track\_name, track\_position} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one.<br>All rating orders (such as "popularity\_total") follow a more specific norm: they use "desc" as default and will forcedly use "desc" even if you requested an "asc". |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | \[\]integer | One or more album id |
| name | string | An album name |
| namesearch | string | Search an album by name (album\_name matching \*seachquery\*) |
| artist\_id | \[\]string | One or more artist id |
| artist\_name | string | An artist name |
| datebetween | string | Released between dates. This parameter need a value to be used for a between closed interval. The "from" and "to" parts are both mandatory, must be separated by an underscore ("\_"), and must be both in the yyyy-mm-dd format |
| imagesize | enum: {25, 35, 50, 55, 60, 65, 70, 75, 85, 100, 130, 150, 200, 300, 400, 500, 600} | The cover size in pixel (if not specified, a default one will be returned) |
| audioformat | enum: {mp31, mp32, ogg, flac} | The audio format you wish to get in the 'audio' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audioformat' is declared, mp31 will be used by default. |
| type | \[\]enum: {single, album} | Select only releases of a certain type. By default we return 'albums' (with several tracks) and 'singles' (only one track). Using 'type=single' you will select only singles |
| track\_id | \[\]integer | One or more track id |
| track\_name | string | A track name |
| audiodlformat | enum: {mp31, mp32, ogg, flac} | The audio download format you wish to get in the 'audiodownload' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audiodlformat' is declared, the value given to 'audioformat' will be used as default, and if neither 'audioformat' is declared, 'mp32' will be the default |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/albums/tracks/?client_id=your_client_id&format=jsonpretty&limit=1&artist_name=we+are+fm&type=album+single
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
      "id":"104336",\
      "name":"Season One",\
      "releasedate":"2011-12-29",\
      "artist_id":"376782",\
      "artist_name":"WE ARE FM",\
      "track_id":"887202",\
      "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887202",\
      "zip":"https:\/\/storage.jamendo.com\/download\/a104336\/mp32\/",\
      "zip_allowed":true,\
      "tracks":[\
        {\
          "count":"1",\
          "id":"887202",\
          "position":"10",\
          "name":"Press Record",\
          "duration":"192",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887202&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887202\/mp32\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "count":"1",\
          "id":"887203",\
          "position":"3",\
          "name":"No Words (Director's Cut)",\
          "duration":"338",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887203&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887203\/mp32\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "count":"1",\
          "id":"887204",\
          "position":"2",\
          "name":"Dance",\
          "duration":"211",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887204&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887204\/mp32\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "count":"1",\
          "id":"887205",\
          "position":"6",\
          "name":"Episode 4 Pt. 3",\
          "duration":"99",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887205&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887205\/mp32\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "count":"1",\
          "id":"887206",\
          "position":"4",\
          "name":"Episode 4 Pt. 1",\
          "duration":"198",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887206&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887206\/mp32\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "count":"1",\
          "id":"887207",\
          "position":"5",\
          "name":"Episode 4 Pt. 2",\
          "duration":"198",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887207&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887207\/mp32\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "count":"1",\
          "id":"887208",\
          "position":"1",\
          "name":"My World",\
          "duration":"202",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887208&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887208\/mp32\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "count":"1",\
          "id":"887209",\
          "position":"9",\
          "name":"Scene 5",\
          "duration":"325",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887209&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887209\/mp32\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "count":"1",\
          "id":"887210",\
          "position":"7",\
          "name":"God Save The DJ",\
          "duration":"240",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887210&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887210\/mp32\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "count":"1",\
          "id":"887211",\
          "position":"8",\
          "name":"City",\
          "duration":"197",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887211&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887211\/mp32\/",\
          "audiodownload_allowed":true\
        }\
      ]\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)