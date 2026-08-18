Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/artists](https://developer.jamendo.com/v3.0/artists) [/tracks](https://developer.jamendo.com/v3.0/artists/tracks)

### Description

Since February 2021, a new field 'audiodownload\_allowed' is returned in this api.
It contains a boolean to know if you can propose or not the possibility to download the track through your application.
Indeed, now Jamendo artists can choose if they want to allow or not the download of their tracks.
If you are already using this api, please take time to modify your code to take into account this new 'audiodownload\_allowed' value.
Moreover, in April 2022, the content of the field 'audiodownload' returned in this api will become an empty string if 'audiodownload\_allowed' is false.


Return the artists' tracks as subentity of each artist and let them be reordered or filtered by some basic parameter.



In 2015 Jamendo introduced the possibility to publish **singles**, that is tracks with no album associated. You can use the 'track\_type' parameter to get only singles, album tracks or both. By default we only return album tracks, because singles have all albums fields (album\_\*) empty, and that could easily create bugs.
Take into account that all tracks have an 'image' associated. In the case of an album track 'image' is equivalent to 'album\_image', whereas in case of a single 'album\_image' is always empty.


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
| order | \[\]enum: {name, id, joindate, popularity\_total, popularity\_month, popularity\_week, track\_name, track\_id, track\_releasedate} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one.<br>All rating orders (such as "popularity\_total") follow a more specific norm: they use "desc" as default and will forcedly use "desc" even if you requested an "asc". |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | \[\]integer | One or more artist id |
| name | string | An artist name |
| namesearch | string | Search an artist by name (artist\_name matching \*seachquery\*) |
| hasimage | enum: {true, 1} | Return only artists with an image |
| datebetween | string | Filter on the artist joining date (the date artists joined Jamendo). This parameter need a value to be used for a between closed interval. The "from" and "to" parts are both mandatory, must be separated by an underscore ("\_"), and must be both in the yyyy-mm-dd format |
| track\_id | \[\]integer | One or more track id |
| track\_name | string | A track name |
| track\_type | \[\]enum: {single, albumtrack} | Select only tracks of a certain type. By default we return only albumtracks to avoid the high risk of bugging applications (especially those built before 2015, that is before the existence of singles). Using 'track\_type=single albumtrack' you will select both types |
| album\_datebetween | string | Created between dates. This parameter need a value to be used for a between closed interval. The "from" and "to" parts are both mandatory, must be separated by an underscore ("\_"), and must be both in the yyyy-mm-dd format |
| album\_id | \[\]string | One or more album id |
| album\_name | string | An album name |
| imagesize | enum: {25, 35, 50, 55, 60, 65, 70, 75, 85, 100, 130, 150, 200, 300, 400, 500, 600} | The cover size in pixel (if not specified, a default one will be returned) |
| audioformat | enum: {mp31, mp32, ogg, flac} | The audio format you wish to get in the 'audio' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audioformat' is declared, mp31 will be used by default. |
| audiodlformat | enum: {mp31, mp32, ogg, flac} | The audio download format you wish to get in the 'audiodownload' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audiodlformat' is declared, the value given to 'audioformat' will be used as default, and if neither 'audioformat' is declared, 'mp32' will be the default |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/artists/tracks/?client_id=your_client_id&format=jsonpretty&order=track_name_desc&name=we+are+fm&album_datebetween=0000-00-00_2012-01-01
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
      "tracks":[\
        {\
          "album_id":"104336",\
          "album_name":"Season One",\
          "id":"887209",\
          "name":"Scene 5",\
          "duration":"325",\
          "releasedate":"2011-12-29",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887209",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887209",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887209&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887209\/mp31\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "album_id":"104336",\
          "album_name":"Season One",\
          "id":"887202",\
          "name":"Press Record",\
          "duration":"192",\
          "releasedate":"2011-12-29",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887202",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887202",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887202&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887202\/mp31\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "album_id":"104336",\
          "album_name":"Season One",\
          "id":"887203",\
          "name":"No Words (Director's Cut)",\
          "duration":"338",\
          "releasedate":"2011-12-29",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887203",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887203",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887203&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887203\/mp31\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "album_id":"104336",\
          "album_name":"Season One",\
          "id":"887208",\
          "name":"My World",\
          "duration":"202",\
          "releasedate":"2011-12-29",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887208",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887208",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887208&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887208\/mp31\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "album_id":"104336",\
          "album_name":"Season One",\
          "id":"887210",\
          "name":"God Save The DJ",\
          "duration":"240",\
          "releasedate":"2011-12-29",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887210",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887210",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887210&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887210\/mp31\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "album_id":"104336",\
          "album_name":"Season One",\
          "id":"887205",\
          "name":"Episode 4 Pt. 3",\
          "duration":"99",\
          "releasedate":"2011-12-29",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887205",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887205",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887205&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887205\/mp31\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "album_id":"104336",\
          "album_name":"Season One",\
          "id":"887207",\
          "name":"Episode 4 Pt. 2",\
          "duration":"198",\
          "releasedate":"2011-12-29",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887207",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887207",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887207&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887207\/mp31\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "album_id":"104336",\
          "album_name":"Season One",\
          "id":"887206",\
          "name":"Episode 4 Pt. 1",\
          "duration":"198",\
          "releasedate":"2011-12-29",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887206",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887206",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887206&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887206\/mp31\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "album_id":"104336",\
          "album_name":"Season One",\
          "id":"887204",\
          "name":"Dance",\
          "duration":"211",\
          "releasedate":"2011-12-29",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887204",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887204",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887204&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887204\/mp31\/",\
          "audiodownload_allowed":true\
        },\
        {\
          "album_id":"104336",\
          "album_name":"Season One",\
          "id":"887211",\
          "name":"City",\
          "duration":"197",\
          "releasedate":"2011-12-29",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887211",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887211",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=887211&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/887211\/mp31\/",\
          "audiodownload_allowed":true\
        }\
      ]\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)