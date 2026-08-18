Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/albums](https://developer.jamendo.com/v3.0/albums) [/file](https://developer.jamendo.com/v3.0/albums/file)

### Description

Since February 2021, a new field called 'zip\_allowed' is returned in these api:


https://developer.jamendo.com/v3.0/albums
https://developer.jamendo.com/v3.0/albums/tracks
https://developer.jamendo.com/v3.0/albums/musicinfo

It contains a boolean to know if you can propose or not the possibility to download the track through your application.
Indeed, now Jamendo artists can choose if they want to allow or not the download of their albums.
If you are already using this api ( [/v3.0/albums/file](https://developer.jamendo.com/v3.0/albums/file)), please take time to modify your code to take into account this new 'zip\_allowed' value.
Moreover, in April 2022, the api [/v3.0/albums/file](https://developer.jamendo.com/v3.0/albums/file) will start returning 404 error if 'zip\_allowed' is false for the album you are trying to download.


The 'file' method represent an exception to the norm. Instead of returning a document object, here we http-redirect to the requested file url, in order to let your application download a certain resource. Note that here we don't inherit parent params declarations as usual, and that a not valid request will trigger an http error (404 or 500)

### Required parameters

_client\_id && id_

### Parameter List

| Name | Type | Description |
| --- | --- | --- |
| client\_id | string | A Client Id provided by [devportal.jamendo.com](https://devportal.jamendo.com/). |
| audioformat | enum: {mp3} | The audio format you wish to use on the fileurl returned field. At the moment mp32 (mp3 192kbps) is the only existing format. |
| id | integer | Applying a redirection this method accepts and needs only one album id |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/albums/file/?client_id=your_client_id&id=1
```

#### Response:

`(If the request is successfull you should be redirected to the requested file, but if the resource doesn't exists a 404 http error with an corresponding error message will be notified in the header. In case of malformed requests, you would receive an http code 500 with relative error information`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)