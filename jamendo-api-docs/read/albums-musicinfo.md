Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/albums](https://developer.jamendo.com/v3.0/albums) [/musicinfo](https://developer.jamendo.com/v3.0/albums/musicinfo)

### Description

Since February 2021, a new field 'zip\_allowed' is returned in this api.
It contains a boolean to know if you can propose or not the possibility to download the album through your application.
Indeed, now Jamendo artists can choose if they want to allow or not the download of their tracks.
If you are already using this api, please take time to modify your code to take into account this new 'zip\_allowed' value.
Moreover, in April 2022, the content of the field 'zip' returned in this api will become an empty string if 'zip\_allowed' is false.


This method returns the tags list of each album and its description (html) if exists.

In addition to all the get parameters in common with its parent method 'albums', musicinfo offers also the possibility to filter albums by tags (only one for the moment) through the parameter 'tag'.

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
| order | \[\]enum: {name, id, releasedate, artist\_id, artist\_name, popularity\_total, popularity\_month, popularity\_week} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one.<br>All rating orders (such as "popularity\_total") follow a more specific norm: they use "desc" as default and will forcedly use "desc" even if you requested an "asc". |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | \[\]integer | One or more album id |
| name | string | An album name |
| namesearch | string | Search an album by name (album\_name matching \*seachquery\*) |
| artist\_id | \[\]string | One or more artist id |
| artist\_name | string | An artist name |
| datebetween | string | Released between dates. This parameter need a value to be used for a between closed interval. The "from" and "to" parts are both mandatory, must be separated by an underscore ("\_"), and must be both in the yyyy-mm-dd format |
| imagesize | enum: {25, 35, 50, 55, 60, 65, 70, 75, 85, 100, 130, 150, 200, 300, 400, 500, 600} | The cover size in pixel (if not specified, a default one will be returned) |
| audioformat | enum: {mp32} | The audio format you wish to use on the fileurl returned field. At the moment mp32 (mp3 192kbps) is the only existing format. |
| type | \[\]enum: {single, album} | Select only releases of a certain type. By default we return 'albums' (with several tracks) and 'singles' (only one track). Using 'type=single' you will select only singles |
| tag | string | With this parameter you can search by one tag. Unless a different order is declared, the results are returned in a relevancy order. Note that some tags (ex "guitarre") are converted to english ("guitar") or grammatically normalized before being stored and sinonimity is not supported. We therefore suggest to use an english vocabulary, or use the tracks api search whicch is way more powerful and flexible |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/albums/musicinfo/?client_id=your_client_id&format=jsonpretty&artist_name=we+are+fm&type=album+single
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
      "id":"104336",\
      "name":"Season One",\
      "releasedate":"2011-12-29",\
      "artist_id":"376782",\
      "artist_name":"WE ARE FM",\
      "image":"https:\/\/usercontent.jamendo.com?type=album&id=104336&width=300",\
      "zip":"https:\/\/storage.jamendo.com\/download\/a104336\/mp32\/",\
      "shorturl":"https:\/\/jamen.do\/l\/a104336",\
      "shareurl":"https:\/\/www.jamendo.com\/list\/a104336",\
      "zip_allowed":true,\
      "musicinfo":{\
        "tags":[\
          "energetic",\
          "electronic",\
          "dance",\
          "rock",\
          "energetic",\
          "electronic",\
          "dance",\
          "rock",\
          "energetic",\
          "electronic",\
          "dance",\
          "rock",\
          "energetic",\
          "electronic",\
          "dance",\
          "rock",\
          "energetic",\
          "electronic",\
          "dance",\
          "rock",\
          "energetic",\
          "electronic",\
          "dance",\
          "rock",\
          "energetic",\
          "electronic",\
          "dance",\
          "rock",\
          "energetic",\
          "electronic",\
          "dance",\
          "rock",\
          "energetic",\
          "electronic",\
          "dance",\
          "rock",\
          "energetic",\
          "electronic",\
          "dance",\
          "rock",\
          "guitar",\
          "guitar",\
          "guitar",\
          "guitar",\
          "guitar",\
          "guitar",\
          "guitar",\
          "guitar",\
          "guitar",\
          "guitar",\
          "electricguitar",\
          "electricguitar",\
          "electricguitar",\
          "electricguitar",\
          "electricguitar",\
          "electricguitar",\
          "electricguitar",\
          "electricguitar",\
          "electricguitar",\
          "electricguitar",\
          "sad",\
          "sad",\
          "sad",\
          "sad",\
          "sad",\
          "sad",\
          "sad",\
          "sad",\
          "sad",\
          "sad",\
          "sport",\
          "sport",\
          "sport",\
          "sport",\
          "sport",\
          "sport",\
          "sport",\
          "sport",\
          "sport",\
          "sport",\
          "amsterdam",\
          "amsterdam",\
          "amsterdam",\
          "amsterdam",\
          "amsterdam",\
          "amsterdam",\
          "amsterdam",\
          "amsterdam",\
          "amsterdam",\
          "amsterdam"\
        ],\
        "description":{\
          "en":"",\
          "fr":"",\
          "es":"",\
          "de":"",\
          "pl":"",\
          "it":"",\
          "ru":"",\
          "pt":"",\
          "ja":""\
        }\
      }\
    },\
    {\
      "id":"124067",\
      "name":"Season One: Instrumental",\
      "releasedate":"2013-08-01",\
      "artist_id":"376782",\
      "artist_name":"WE ARE FM",\
      "image":"https:\/\/usercontent.jamendo.com?type=album&id=124067&width=300",\
      "zip":"https:\/\/storage.jamendo.com\/download\/a124067\/mp32\/",\
      "shorturl":"https:\/\/jamen.do\/l\/a124067",\
      "shareurl":"https:\/\/www.jamendo.com\/list\/a124067",\
      "zip_allowed":true,\
      "musicinfo":{\
        "tags":[\
          "rock",\
          "rock",\
          "rock",\
          "electronic",\
          "electronic",\
          "electronic",\
          "electricguitar",\
          "electricguitar",\
          "electricguitar",\
          "synthesizer",\
          "synthesizer",\
          "synthesizer",\
          "energetic",\
          "energetic",\
          "energetic",\
          "electrorock",\
          "electrorock",\
          "electrorock"\
        ],\
        "description":{\
          "en":"",\
          "fr":"",\
          "es":"",\
          "de":"",\
          "pl":"",\
          "it":"",\
          "ru":"",\
          "pt":"",\
          "ja":""\
        }\
      }\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)