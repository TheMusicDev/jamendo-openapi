Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/autocomplete](https://developer.jamendo.com/v3.0/autocomplete)

### Description

Using this method, you can build an autocomplete operating on Jamendo tracks, albums, artists and tags. By default all those four entities are considered, but you can choose to select just one or more of them through the 'entity' parameter. The string given with the 'prefix' parameter is considered as a prefix.

The results document contains the matches for each selected entity, in a number limited by the 'limit' parameter. You can see the matches count value, by turning the 'matchcount' paramter to on; that gives you also an idea of the metrics used for ordering results.

At the moment we cannot return the id of the matching entity, therefore, take into account that the lookup which in your implementation will probably follow the autocomplete request, is a lookup by name, that is a not unique entity.

### Required parameters

_client\_id && prefix_

### Parameter List

| Name | Type | Description |
| --- | --- | --- |
| client\_id | string | A Client Id provided by [devportal.jamendo.com](https://devportal.jamendo.com/). |
| format | enum: {xml, json, jsonpretty} | The results formatting type |
| callback | string | Use this parameter to have the response json wrapped in a callback function (jsonp technique). Such feature is enable only for json format and GET requests; if used in combination with other formats or a not-get request, the callback parameter is simply ignored and a warning is raised |
| limit | string | How many results to return per entity? |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| prefix | string | The string to be searched as prefix of an entity name. The query on our side correspond to an sql \[...WHERE name LIKE 'qvalue%' GROUP BY entity, name ORDER BY name, COUNT(\*) DESC\]. The minimum string length accepted is 2. |
| entity | \[\]enum: {artists, albums, tracks, tags} | By default the autocomplete method searchs for matches in every entity (tracks, albums, artists, tags). With this parameter, you can specify to search and return only some of those. |
| matchcount | boolean | Turn this parameter value to 'true' if you want to get the match count returned with the match as well. The default value is false.<br>The matchcount of the entity 'tags' refers only to tracks and not albums or artist tags |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/autocomplete/?client_id=your_client_id&format=jsonpretty&limit=3&prefix=something&matchcount=1
```

#### Response:

`{
"headers":{
    "status":"success",
    "code":0,
    "error_message":"",
    "warnings":"",
    "results_count":4
},
"results":{
    "tags":[\
      {\
        "match":"something",\
        "count":1\
      },\
      {\
        "match":"somethingkindofvocalthingy",\
        "count":1\
      },\
      {\
        "match":"somethingonitisoff",\
        "count":1\
      }\
    ],
    "artists":[\
      {\
        "match":"something",\
        "count":2\
      },\
      {\
        "match":"something else",\
        "count":1\
      },\
      {\
        "match":"somethingelse",\
        "count":1\
      }\
    ],
    "tracks":[\
      {\
        "match":"something",\
        "count":28\
      },\
      {\
        "match":"somethingelse",\
        "count":15\
      },\
      {\
        "match":"something else",\
        "count":14\
      },\
      {\
        "match":"somethingwrong",\
        "count":14\
      }\
    ],
    "albums":[\
      {\
        "match":"something",\
        "count":50\
      },\
      {\
        "match":"something wicked this way comes",\
        "count":32\
      },\
      {\
        "match":"somethingwickedthiswaycomes",\
        "count":32\
      },\
      {\
        "match":"something about us",\
        "count":20\
      }\
    ]
}
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)