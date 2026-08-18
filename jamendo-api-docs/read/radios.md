Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/radios](https://developer.jamendo.com/v3.0/radios)

### Description

This method returns the list of existing jamendo radios, with their associated
image and name. Each radio id or name can then be used to integrate the radio into your system via
[stream api](https://developer.jamendo.com/v3.0/radios/stream).

Please note that the usage of Jamendo music for direct or indirect commercial activities requires the
[purchase of a commercial license](https://licensing.jamendo.com/en/in-store).

Buying a commercial radio license, your Jamendo developer account will be upgraded enabling
you the access to type=pro radios and providing you a legal certificate
which will prevent you by paying royalties to collecting societies.


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
| order | \[\]enum: {id, name, dispname} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one. |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | integer | A radio id |
| type | enum: {www, pro} | Jamendo has its featured www.jamendo.com ('www') and licensing.jamendo.com ('pro') radios, and may add some other types in the future. The api returns only 'www' radios by default, as 'pro' radios are for commercial stores and places only (read this api description for more info). |
| name | string | A radio name (unique and thus identifying) |
| imagesize | enum: {150, 30} | The radio image size in pixel (if not specified, a default one will be returned) |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/radios/?client_id=your_client_id&format=jsonpretty&limit=3
```

#### Response:

`{
"headers":{
    "status":"success",
    "code":0,
    "error_message":"",
    "warnings":"",
    "results_count":3
},
"results":[\
    {\
      "id":1,\
      "name":"bestof",\
      "dispname":"Best Of Jamendo Radio",\
      "type":"www",\
      "image":"https:\/\/images.jamendo.com\/new_jamendo_radios\/bestof150.jpg"\
    },\
    {\
      "id":2,\
      "name":"electro",\
      "dispname":"Electronic Radio",\
      "type":"www",\
      "image":"https:\/\/images.jamendo.com\/new_jamendo_radios\/electro150.jpg"\
    },\
    {\
      "id":3,\
      "name":"rock",\
      "dispname":"Rock Radio",\
      "type":"www",\
      "image":"https:\/\/images.jamendo.com\/new_jamendo_radios\/rock150.jpg"\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)