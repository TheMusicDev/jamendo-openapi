Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/users](https://developer.jamendo.com/v3.0/users) [/tracks](https://developer.jamendo.com/v3.0/users/tracks)

### Description

Since February 2021, a new field 'audiodownload\_allowed' is returned in this api.
It contains a boolean to know if you can propose or not the possibility to download the track through your application.
Indeed, now Jamendo artists can choose if they want to allow or not the download of their tracks.
If you are already using this api, please take time to modify your code to take into account this new 'audiodownload\_allowed' value.
Moreover, in April 2022, the content of the field 'audiodownload' returned in this api will become an empty string if 'audiodownload\_allowed' is false.


Given a user, which are the Jamendo tracks he has liked or added to favorite or reviewed or all of them?


The 'relation' parameter let you choose which relations must be considered, while with the order=rating\_desc get parameter you can get the list of results ordered by a rating which consider the following relevance order: review, favorite, like.


You can sort also by 'updatedate', that is the greatest date when the track has been liked, or reviewed, or added to favorite; the corrsponding field 'dateupdated' is contained into the track object.



In 2015 Jamendo introduced the possibility to publish **singles**, that is tracks with no album associated. You can use the 'track\_type' parameter to get only singles, album tracks or both. By default we only return album tracks, because singles have all albums fields (album\_\*) empty, and that could easily create bugs.
Take into account that all tracks have an 'image' associated. In the case of an album track 'image' is equivalent to 'album\_image', whereas in case of a single 'album\_image' is always empty.


### Required parameters

_client\_id && (id \|\| access\_token)_

### Parameter List

| Name | Type | Description |
| --- | --- | --- |
| client\_id | string | A Client Id provided by [devportal.jamendo.com](https://devportal.jamendo.com/). |
| format | enum: {xml, json, jsonpretty} | The results formatting type |
| callback | string | Use this parameter to have the response json wrapped in a callback function (jsonp technique). Such feature is enable only for json format and GET requests; if used in combination with other formats or a not-get request, the callback parameter is simply ignored and a warning is raised |
| offset | integer | The position to start returning results from |
| limit | string | The max number of results to return. Default is 10 and Max is 200. Using the keyword 'all' still a max of 200 rows will be returned |
| order | \[\]enum: {updatedate, rating} | The order parameter 'dateupdated' refers to the last date where a review/like/review action happened, while 'rating' refers to the aggregated value given by summing the values of review, like and review. Currently we consider a like as a review with score 8 and favorite as a review with score 9. |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | integer | One user id |
| access\_token | string | A valid access token corresponding to the Jamendo user you want to get data for. The authorization token is obtained through the [OAuth2 process](https://developer.jamendo.com/v3.0/oauth2). |
| imagesize | enum: {30, 50, 100} | The user avatar size in pixel (if not specified, a default one will be returned) |
| track\_type | \[\]enum: {single, albumtrack} | Select only tracks of a certain type. By default we return only albumtracks to avoid the high risk of bugging applications (especially those built before 2015, that is before the existence of singles). Using 'track\_type=single albumtrack' you will select both types |
| track\_id | \[\]integer | One or more track id |
| artist\_id | \[\]integer | One or more track id |
| album\_id | \[\]integer | One or more track id |
| audioformat | enum: {mp31, mp32, ogg, flac} | The audio format you wish to get in the 'audio' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audioformat' is declared, mp31 will be used by default. |
| audiodlformat | enum: {mp31, mp32, ogg, flac} | The audio download format you wish to get in the 'audiodownload' returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no 'audiodlformat' is declared, the value given to 'audioformat' will be used as default, and if neither 'audioformat' is declared, 'mp32' will be the default |
| album\_imagesize | enum: {25, 35, 50, 55, 60, 65, 70, 75, 85, 100, 130, 150, 200, 300, 400, 500, 600} | The cover size in pixel (if not specified, a default one will be returned) |
| relation | \[\]enum: {like, favorite, review} | With this parameter you can choose to list the tracks a user have liked, added to favorite, or reviewed. Note that "favorite+like" means in this case "favorite OR like". If no value is given, all relations are taken into account. |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/users/tracks/?client_id=your_client_id&format=jsonpretty&limit=3&order=rating_desc+updatedate_desc&id=972174
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
      "avatar_type":"uploadedv2",\
      "avatar":"jpg",\
      "album_id":"49216",\
      "tracks":[\
        {\
          "id":"391002",\
          "name":"Balrog Boogie",\
          "releasedate":"2009-07-23",\
          "artist_id":"351716",\
          "duration":"233",\
          "artist_name":"Diablo Swing Orchestra",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-nd\/3.0\/",\
          "updatedate":"2014-02-18 15:39:55",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=49216&width=300&trackid=391002",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=49216&width=300&trackid=391002",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=391002&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/391002\/mp32\/",\
          "relations":{\
            "review":"10",\
            "favorite":"0",\
            "like":"1"\
          },\
          "audiodownload_allowed":true\
        },\
        {\
          "id":"238862",\
          "name":"Only God Knows Why",\
          "releasedate":"2008-11-14",\
          "artist_id":"3498",\
          "duration":"338",\
          "artist_name":"Nocreeps",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-sa\/3.0\/",\
          "updatedate":"2013-02-25 12:31:57",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=34802&width=300&trackid=238862",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=34802&width=300&trackid=238862",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=238862&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/238862\/mp32\/",\
          "relations":{\
            "review":"10",\
            "favorite":"0",\
            "like":"1"\
          },\
          "audiodownload_allowed":true\
        },\
        {\
          "id":"353341",\
          "name":"Yellow Gold",\
          "releasedate":"2009-06-06",\
          "artist_id":"343767",\
          "duration":"289",\
          "artist_name":"John Dada &amp; the Weathermen",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-nd\/3.0\/",\
          "updatedate":"2013-01-17 17:57:48",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=46816&width=300&trackid=353341",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=46816&width=300&trackid=353341",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=353341&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/353341\/mp32\/",\
          "relations":{\
            "review":"10",\
            "favorite":"0",\
            "like":"1"\
          },\
          "audiodownload_allowed":true\
        },\
        {\
          "id":"628410",\
          "name":"Mi ammazzo di caff\u00e8",\
          "releasedate":"2010-08-08",\
          "artist_id":"362118",\
          "duration":"274",\
          "artist_name":"Falsorigo",\
          "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/3.0\/",\
          "updatedate":"2014-01-20 12:02:52",\
          "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=72779&width=300&trackid=628410",\
          "image":"https:\/\/usercontent.jamendo.com?type=album&id=72779&width=300&trackid=628410",\
          "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=628410&format=mp31&from=app-devsite",\
          "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/628410\/mp32\/",\
          "relations":{\
            "review":"9",\
            "favorite":"0",\
            "like":"1"\
          },\
          "audiodownload_allowed":true\
        }\
      ]\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)