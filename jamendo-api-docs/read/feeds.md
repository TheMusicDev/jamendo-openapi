Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/feeds](https://developer.jamendo.com/v3.0/feeds)

### Description

This method returns the editorial feeds that you can find also on the www.jamendo.com homepage.

Note that evey feed has a start and end date, which determine whether a feed is active or not. Only active feeds are returned.


Every feed object, always contains a list of urls refered to the following image sizes: 996\_350, 315\_111, 600\_211, 470\_165.


The recommended and default order, is position\_asc.


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
| order | \[\]enum: {id, date\_start, date\_end, position} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one. |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | integer | Select by id |
| lang | enum: {en, fr, es, de, pl, it, ru, pt} | Select only the feeds having the text written in the given language. <br>Note that texts and titles also in other languages will be returned anyway, to not change the document structure. Note also that, given a feed, you can find out which languages this feed is tanslated in, thanks to the field 'lang'. |
| target | enum: {all, logged, notlogged} | Select the feeds targetted to 'logged' users, 'notlogged' users, or 'all'. The default value is 'all'. Note that 'logged' and 'notlogged' are not mutually exclusive categories: some feeds are both part of the 'logged' and 'notlogged' category. <br>The target information is also returned in every feed document, in a field obviously named 'target'. |
| type | \[\]enum: {album, artist, playlist, track, news, interview, contest, video, update} | Each feed belong to one of the following types: album, artist, playlist, track, news, interview, contest, video. <br>If a feed is of type album, track, artist or playlist, the field 'joinid' returns the id of that album, track, artist or playlist. |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/feeds/?client_id=your_client_id&format=jsonpretty&limit=1&order=id_desc
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
      "id":"337",\
      "title":{\
        "en":"Say hello to the brand new Jamendo Music app!",\
        "fr":"La toute nouvelle version de Jamendo Music est enfin disponible !",\
        "es":"\u00a1Dale la bienvenida a la aplicaci\u00f3n de Jamendo Music reci\u00e9n creada,\
         una versi\u00f3n de la experiencia Jamendo completamente nueva!",\
        "de":"Begr\u00fc\u00dfe die brandneue Jamendo Music App!",\
        "pl":"Say hello to the brand new Jamendo Music app!",\
        "it":"Scopri la nuova app Jamendo Music!",\
        "ru":"Say hello to the brand new Jamendo Music app!",\
        "pt":"Say hello to the brand new Jamendo Music app!",\
        "ja":""\
      },\
      "link":"https:\/\/itunes.apple.com\/app\/jamendo\/id319042726?mt=8",\
      "position":"0",\
      "lang":[\
        "en",\
        "fr",\
        "it",\
        "es",\
        "de",\
        "pl",\
        "ru",\
        "pt"\
      ],\
      "date_start":"2016-04-06 00:00:00",\
      "date_end":"2200-01-01 00:00:00",\
      "text":{\
        "en":"It's a whole new version of the Jamendo experience. Explore our featured selections,\
         our playlists and charts to easily discover fresh,\
         new independent music. Keep discovering independent talents through our radio channels,\
         and suggestions of similar tracks,\
         albums or tracks. Create your own playlists,\
         save your favorite music,\
         connect your Jamendo account to retrieve all your previously saved music. Get the new Jamendo Music app for free!",\
        "fr":"L'exp\u00e9rience Jamendo est compl\u00e8tement renouvel\u00e9e,\
         gr\u00e2ce \u00e0 nos s\u00e9lections,\
         playlists et charts permettant de d\u00e9couvrir sans cesse de la nouvelle musique ind\u00e9pendante.Poursuivez l'exploration des talents de demain avec nos radios,\
         et suggestions d'artistes,\
         d'albums et de titres. Cr\u00e9ez vos propres playlists,\
         sauvegardez vos favoris,\
         et connectez vous pour r\u00e9cup\u00e9rer toute la musique sauvegard\u00e9e de par le pass\u00e9. L'application Jamendo Music est enti\u00e8rement gratuite !",\
        "es":"Explora las selecciones que te recomendamos,\
         las listas de reproducci\u00f3n y las de \u00e9xitos para descubrir una m\u00fasica fresca e independiente. Disfruta del talento de artistas independientes en nuestras radios y descubre m\u00e1s con las sugerencias de pistas,\
         \u00e1lbumes y artistas similares. Con la nueva aplicaci\u00f3n,\
         podr\u00e1s crear tus propias listas de reproducci\u00f3n,\
         guardar tu m\u00fasica favorita,\
         vincular la cuenta de Jamendo para recuperar la m\u00fasica que tienes guardada y muchas cosas m\u00e1s. \u00a1Consigue gratis la nueva aplicaci\u00f3n de Jamendo Music!",\
        "de":"Eine ganz neue Version des Jamendo-Erlebnisses. Lerne unsere empfohlenen Auswahlen,\
         unsere Playlisten und Charts kennen und entdecke einfach frische,\
         neue und unabh\u00e4ngige Musik. Finde \u00fcber unsere Radiokan\u00e4le und Vorschl\u00e4ge zu \u00e4hnlichen Liedern oder Albem immer weiter unabh\u00e4ngige Talente. Erstelle deine eigenen Playlisten,\
         speichere deine Lieblingsmusik,\
         melde dich bei deinem Jamendo-Konto an,\
         um alle deine vorher abgespeicherte Musik erneut zu h\u00f6ren. Hol dir kostenlos die neue Jamendo Music App!",\
        "pl":"It's a whole new version of the Jamendo experience. Explore our featured selections,\
         our playlists and charts to easily discover fresh,\
         new independent music. Keep discovering independent talents through our radio channels,\
         and suggestions of similar tracks,\
         albums or tracks. Create your own playlists,\
         save your favorite music,\
         connect your Jamendo account to retrieve all your previously saved music. Get the new Jamendo Music app for free!",\
        "it":"Vivi l'esperienza Jamendo in una veste tutta nuova. Esplora i brani in primo piano,\
         le playlist e le classifiche per trovare tanta nuova musica indipendente. Non perderti gli artisti indipendenti pi\u00f9 talentuosi,\
         con i nostri canali radio e i suggerimenti di artisti,\
         album e brani simili. Crea le tue playlist personalizzate,\
         salva i brani che preferisci o collegati al tuo account Jamendo per avere sempre con te i brani gi\u00e0 salvati. Scarica l'app Jamendo Music gratis!",\
        "ru":"It's a whole new version of the Jamendo experience. Explore our featured selections,\
         our playlists and charts to easily discover fresh,\
         new independent music. Keep discovering independent talents through our radio channels,\
         and suggestions of similar tracks,\
         albums or tracks. Create your own playlists,\
         save your favorite music,\
         connect your Jamendo account to retrieve all your previously saved music. Get the new Jamendo Music app for free!",\
        "pt":"It's a whole new version of the Jamendo experience. Explore our featured selections,\
         our playlists and charts to easily discover fresh,\
         new independent music. Keep discovering independent talents through our radio channels,\
         and suggestions of similar tracks,\
         albums or tracks. Create your own playlists,\
         save your favorite music,\
         connect your Jamendo account to retrieve all your previously saved music. Get the new Jamendo Music app for free!",\
        "ja":""\
      },\
      "type":"news",\
      "joinid":"0",\
      "subtitle":[\
      ],\
      "target":"all",\
      "images":{\
        "size996_350":"https:\/\/images.jamendo.com\/feeds\/37\/337.996_350.jpg?du=2016-04-06+14%3A59%3A00",\
        "size315_111":"https:\/\/images.jamendo.com\/feeds\/37\/337.315_111.jpg?du=2016-04-06+14%3A59%3A00",\
        "size600_211":"https:\/\/images.jamendo.com\/feeds\/37\/337.600_211.jpg?du=2016-04-06+14%3A59%3A00",\
        "size470_165":"https:\/\/images.jamendo.com\/feeds\/37\/337.470_165.jpg?du=2016-04-06+14%3A59%3A00"\
      }\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)