Version 3.0


# Jamendo Api Documentation

## POST [/v3.0](https://developer.jamendo.com/v3.0)/setuser [/like](https://developer.jamendo.com/v3.0/setuser/like)

### Description

Let this 'userid' like the given 'trackid' (/users/tracks?relation='like'). Note that if the track doesn't exist, no error will be raised, but the track will not appear in any read request of api and website.

### Required parameters

_client\_id && access\_token && track\_id_

### Parameter List

| Name | Type | Description |
| --- | --- | --- |
| client\_id | string | A Client Id provided by [devportal.jamendo.com](https://devportal.jamendo.com/) |
| format | enum: {xml, json, jsonpretty} | The results formatting type |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| access\_token | string | A valid access token (with **'music' scope authorized**) corresponding to the Jamendo user you want to update. You can get it with the [OAuth2 process](https://developer.jamendo.com/v3.0/oauth2) |
| track\_id | integer |  |

### Sample

#### Call:

```
curl -X POST  -d client_id="your_client_id"  -d format="jsonpretty"  -d access_token="your_access_token"  -d track_id="10"  "https://api.jamendo.com/v3.0/setuser/like/"
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