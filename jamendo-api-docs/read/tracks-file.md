Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/tracks](https://developer.jamendo.com/v3.0/tracks) [/file](https://developer.jamendo.com/v3.0/tracks/file)

### Description

Since February 2021, a new field called 'audiodownload\_allowed' or 'track\_audiodownload\_allowed' is returned in these api:


https://developer.jamendo.com/v3.0/tracks
https://developer.jamendo.com/v3.0/users/tracks
https://developer.jamendo.com/v3.0/playlists/tracks
https://developer.jamendo.com/v3.0/artists/tracks
https://developer.jamendo.com/v3.0/albums/tracks
https://developer.jamendo.com/v3.0/albums/tracks
https://developer.jamendo.com/v3.0/reviews/tracks
https://developer.jamendo.com/v3.0/artists/tracks
https://developer.jamendo.com/v3.0/playlists/tracks
https://developer.jamendo.com/v3.0/reviews/tracks
https://developer.jamendo.com/v3.0/users/tracks

It contains a boolean to know if you can propose or not the possibility to download the track through your application.
Indeed, now Jamendo artists can choose if they want to allow or not the download of their tracks.
If you are already using this api ( [/v3.0/tracks/file](https://developer.jamendo.com/v3.0/tracks/file)), please take time to modify your code to take into account this new 'audiodownload\_allowed'/'track\_audiodownload\_allowed' value.
Moreover, in April 2022, the api [/v3.0/tracks/file](https://developer.jamendo.com/v3.0/tracks/file) will start returning 404 error if 'audiodownload\_allowed'/'track\_audiodownload\_allowed' is false for the track you are trying to download.


The 'file' method represent an exception to the norm. Instead of returning a document object, here we http-redirect to the requested file url, in order to let your application download a certain resource. Note that here we don't inherit parent params declarations as usual, and that a not valid request will trigger an http error (404 or 500)

### Required parameters

_client\_id && id_

### Parameter List

| Name | Type | Description |
| --- | --- | --- |
| client\_id | string | A Client Id provided by [devportal.jamendo.com](https://devportal.jamendo.com/). |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| audioformat | enum: {mp31, mp32, ogg, flac} | The audio format you wish to get in the "audio" returned field: mp31 (96kbs), mp32 (VBR, good quality), ogg and flac are the available formats. If no "audioformat" is declared, mp31 will be used by default. |
| action | enum: {download, stream} | Help our server to optimize this request handling depending on the whether the action is stream or download. The default is dowload. |
| id | integer | Applying a redirection this method accepts and needs only one track id |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/tracks/file/?client_id=your_client_id&id=10
```

#### Response:

`(If the request is successfull you should be redirected to the requested file, but if the resource doesn't exists a 404 http error with an corresponding error message will be notified in the header. In case of malformed requests, you would receive an http code 500 with relative error information`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)