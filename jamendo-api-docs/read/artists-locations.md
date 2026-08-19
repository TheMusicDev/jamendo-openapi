Version 3.0


# Jamendo Api Documentation

## GET [/v3.0](https://developer.jamendo.com/v3.0) [/artists](https://developer.jamendo.com/v3.0/artists) [/locations](https://developer.jamendo.com/v3.0/artists/locations)

### Description

This method let you select and filter geographical locations which artists have declared as reference for themselves.


Geographical filtering can be expressed by the name of a country and/or a city, or by a longitude/latitude pair of coordinates (location\_coords), combined with a km radius (location\_radius).

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
| order | \[\]enum: {name, id, joindate, popularity\_total, popularity\_month, popularity\_week} | Sort results by the queried field(s). <br>You can specify whether to follow an ascending or descending order adding the suffix \_asc or \_desc to every field (order=field\_asc). Asc is the default one.<br>All rating orders (such as "popularity\_total") follow a more specific norm: they use "desc" as default and will forcedly use "desc" even if you requested an "asc". |
| fullcount | boolean | Setting this parameter to true, the document header will be enriched with the 'results\_fullcount' value, that is, the absolute number of rows the query would return if there was no limit and offset parameter. This value is of course very useful for pagination, but please: use it only if you really need it, as it affects performances! For this performance reasons such parameter is not available in most heavy methods. |
| id | \[\]integer | One or more artist id |
| name | string |  |
| namesearch | string | Search an artist by name (artist\_name matching \*seachquery\*) |
| hasimage | enum: {true, 1} | Return only artists with an image |
| datebetween | string | Filter on the artist joining date (the date artists joined Jamendo). This parameter need a value to be used for a between closed interval. The "from" and "to" parts are both mandatory, must be separated by an underscore ("\_"), and must be both in the yyyy-mm-dd format |
| haslocation | boolean | Return only artsist with (true) or withouth (false) locations |
| location\_country | \[\]enum: {AFG, ALB, DZA, ASM, AND, AGO, AIA, ATA, ATG, ARG, ARM, ABW, ASC, AUS, AUT, AZE, BHS, BHR, BGD, BRB, BLR, BEL, BLZ, BEN, BMU, BTN, BOL, BIH, BWA, BVT, BRA, IOT, VGB, BRN, BGR, BFA, BDI, KHM, CMR, CAN, CPV, BES, CYM, CAF, TCD, CHL, CHN, CXR, CPT, CCK, COL, COM, COG, COD, COK, CRI, HRV, CUB, CUW, CYP, CZE, CIV, DNK, DGA, DJI, DMA, DOM, ECU, EGY, SLV, GNQ, ERI, EST, ETH, FLK, FRO, FJI, FIN, FRA, GUF, PYF, ATF, GAB, GMB, GEO, DEU, GHA, GIB, GRC, GRL, GRD, GLP, GUM, GTM, GGY, GIN, GNB, GUY, HTI, HMD, HND, HKG, HUN, ISL, IND, IDN, IRN, IRQ, IRL, IMN, ISR, ITA, JAM, JPN, JEY, JOR, KAZ, KEN, KIR, XKK, KWT, KGZ, LAO, LVA, LBN, LSO, LBR, LBY, LIE, LTU, LUX, MAC, MKD, MDG, MWI, MYS, MDV, MLI, MLT, MHL, MTQ, MRT, MUS, MYT, MEX, FSM, MDA, MCO, MNG, MNE, MSR, MAR, MOZ, MMR, NAM, NRU, NPL, NLD, ANT, NCL, NZL, NIC, NER, NGA, NIU, NFK, PRK, MNP, NOR, OMN, PAK, PLW, PSE, PAN, PNG, PRY, PER, PHL, PCN, POL, PRT, PRI, QAT, ROU, RUS, RWA, REU, BLM, SHN, KNA, LCA, MAF, SPM, WSM, SMR, SAU, SEN, SRB, SYC, SLE, SGP, SXM, SVK, SVN, SLB, SOM, ZAF, SGS, KOR, SSD, ESP, LKA, VCT, SDN, SUR, SJM, SWZ, SWE, CHE, SYR, STP, TWN, TJK, TZA, THA, TLS, TGO, TKL, TON, TTO, TAA, TUN, TUR, TKM, TCA, TUV, UMI, VIR, UGA, UKR, ARE, GBR, USA, URY, UZB, VUT, VAT, VEN, VNM, WLF, ESH, YEM, ZMB, ZWE, ALA} | The artist country (following [ISO 3166\_1 standard](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3#Officially_assigned_code_elements)) |
| location\_city | string | The artist city |
| location\_coords | string | The location coordinates, expressed in the format <latitude>\_<longitude>, where both latitude and longitued obviously must be numbers |
| location\_radius | integer | The coords radius expressed in kilometers. With a radius of value 2, the request will return items located less than 2 km far away the coords point. The default value is 1km, but if no location\_coords is declared, this paramter is simply ignored. |

### Sample

#### Call:

```
https://api.jamendo.com/v3.0/artists/locations/?client_id=your_client_id&format=jsonpretty&limit=5&haslocation=true&location_country=ITA&location_city=milan
```

#### Response:

`{
"headers":{
    "status":"success",
    "code":0,
    "error_message":"",
    "warnings":"",
    "results_count":5
},
"results":[\
    {\
      "id":"92",\
      "name":"Haeresis",\
      "website":"http:\/\/www.haeresis.org\/",\
      "joindate":"2005-04-09",\
      "image":"",\
      "shorturl":"https:\/\/jamen.do\/a\/92",\
      "shareurl":"https:\/\/www.jamendo.com\/artist\/92",\
      "locations":[\
        {\
          "id":"472",\
          "longitude":"9.18813",\
          "latitude":"45.4637",\
          "country":"ITA",\
          "city":"Milan"\
        }\
      ]\
    },\
    {\
      "id":"339997",\
      "name":"Noctiflora",\
      "website":"http:\/\/www.ekleipsi.com",\
      "joindate":"2008-06-05",\
      "image":"",\
      "shorturl":"https:\/\/jamen.do\/a\/339997",\
      "shareurl":"https:\/\/www.jamendo.com\/artist\/339997",\
      "locations":[\
        {\
          "id":"472",\
          "longitude":"9.18813",\
          "latitude":"45.4637",\
          "country":"ITA",\
          "city":"Milan"\
        }\
      ]\
    },\
    {\
      "id":"340000",\
      "name":"Last Souls",\
      "website":"http:\/\/www.ekleipsi.com",\
      "joindate":"2008-06-05",\
      "image":"",\
      "shorturl":"https:\/\/jamen.do\/a\/340000",\
      "shareurl":"https:\/\/www.jamendo.com\/artist\/340000",\
      "locations":[\
        {\
          "id":"472",\
          "longitude":"9.18813",\
          "latitude":"45.4637",\
          "country":"ITA",\
          "city":"Milan"\
        }\
      ]\
    },\
    {\
      "id":"342338",\
      "name":"Over The Trees",\
      "website":"http:\/\/www.facebook.com\/pages\/Over-The-Trees\/26106943220",\
      "joindate":"2008-10-15",\
      "image":"https:\/\/usercontent.jamendo.com?type=artist&id=342338&width=300",\
      "shorturl":"https:\/\/jamen.do\/a\/342338",\
      "shareurl":"https:\/\/www.jamendo.com\/artist\/342338",\
      "locations":[\
        {\
          "id":"472",\
          "longitude":"9.18813",\
          "latitude":"45.4637",\
          "country":"ITA",\
          "city":"Milan"\
        }\
      ]\
    },\
    {\
      "id":"342450",\
      "name":"VV.AA.",\
      "website":"http:\/\/www.jonicnoise.com",\
      "joindate":"2008-10-19",\
      "image":"",\
      "shorturl":"https:\/\/jamen.do\/a\/342450",\
      "shareurl":"https:\/\/www.jamendo.com\/artist\/342450",\
      "locations":[\
        {\
          "id":"472",\
          "longitude":"9.18813",\
          "latitude":"45.4637",\
          "country":"ITA",\
          "city":"Milan"\
        }\
      ]\
    }\
]
}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)