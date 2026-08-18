Version 3.0


# Authentication

## Basic authentication

Every api call needs the ' **client\_id**' GET parameter. To get your client\_id, you have to sign up for a developer account on our [**Developer Portal**](https://devportal.jamendo.com/).
Note that for some api methods (to read/write a Jamendo user's private data), in addition to the 'client\_id', you will need to implement an [**OAuth2 authentication** workflow](https://developer.jamendo.com/v3.0/authentication#authentication-workflow).

### Obtain a 'client\_id'

With your new developer account, you will be able to create ' **applications**'. For each application you will get a private ' **client\_id**' that you can use to authenticate all API queries made by your application. If you want to make some **quick tests**, you can use this **client id: 709fa152 (ONLY for TESTING the read api)**.

### Choose your plan

By default, all 'applications' created in your account have the ' **read only**' plan applied (it allows you to use all the [read api](https://developer.jamendo.com/v3.0/read-methods) methods).
If you need to use our [write api](https://developer.jamendo.com/v3.0/write-methods), you have to change the plan of your application to the ' **Read & Write**' plan.
This change requires **approval by the Jamendo team**, so don't forget to **complete your application description** correctly before applying for read access (application name, description, usage, ...).

### Statistics and alerts

With your account you will also have access to the **usage statistics of your application(s)**, that you can use to monitor how and how many users are using your application on devportal.jamendo.com. If your application exceeds **500,000 hits**, or is likely to exceed **500,000 hits in the future**, you should contact us at api@jamendo.com in order to avoid restrictions or limitations to your app.

All high-consumption applications will go through a specific process analysis in order to identify mutual opportunities such as a partnership or other business opportunities. Don’t panic we will not directly block your API calls althought a specific warning will be added to all API response documents. Also, you will receive a warning email with specific instruction to follow. Please refer to section 3.3 in our Terms of Use.

​

JAMENDO has a strict policy aiming to avoid resource waste or violation of our content right holders and reserves the right to set up a temporary call limitation when processing the analysis of the type, the purpose and the legitimacy of your application. In the case that the API account owner does not reply or provide the required information within 7 days, JAMENDO reserves the right to restrain or ban the application.

## Introduction

The objective of Jamendo OAuth2 is to let users **log-in to Jamendo, via third-party applications**.
During the process, the user decides to **grant (or not) some rights** to your application, in order to let it **read/write data from/to Jamendo on the users behalf**.


For the user, such a personal data access mechanism is **secure**, because the user does not need to use his credentials to authentificate inside of the app. He just needs to log-in on Jamendo as usual and from there he can authorize the app to access his data.


Oauth2 is a widely used IETF standard and Jamendo has fully implemented it following the official specification: [http://oauth.net/2/](http://oauth.net/2/).

## Workflow

- A new user of your application does something that requires the use of a **Jamendo api method, requiring OAuth2 authentication**.
- Your application makes an **OAuth2 Authorize** request to let the user log-in with his Jamendo credentials and authorize your application to access and/or write personal data on his behalf.
- If the user grants your application the requested rigths, the OAuth2 Authorize request will send you back an **Authorization Code**.
- Your application can then make an **OAuth2 Grant** request to exchange the Authorization Code for an **Access Token** and a **Refresh Token**.
- With the Access Token, your application will be able to **execute Jamend Api requests** protected by OAuth2 authentication. This allows your application to perform write actions on the users behalf (ex: _/setuser/favorite_), or retrieve private user data (ex: _/reviews/tracks_).
- For security reasons, your will be able to use an Authorization Token for a maximum of **2 hours**.
- After those 2 hours, your application will receive an error: _'Your access token has expired'_.
- At this stage, to continue the users session, the application has to make a new OAuth2 Grant request, passing the **Refresh Token** instead of the Authorization Code (which isn't valid anymore). Such request will return a new Access Token (again, valid for 2 hours) and a new Refresh Token.


Don't forget to **overwrite the old Refresh Token** by the new one in your application storage.

- At anytime, **the user can revoke the permissions he has granted to your application** in his Jamendo account preferences panel. This action will invalidate the corresponding Access Token and Refresh Token.

## Requirements

- The **Redirect Url** of your _application_ **must be defined** in your Jamendo developer account.
- You have to use a **OAuth2 compatible client** to communicate with our OAuth2 server: it should be based on the [draft #31](http://tools.ietf.org/html/draft-ietf-oauth-v2-31) of the [OAuth2 protocol](http://oauth.net/2/) (maybe clients that support newer or older versions of the draft will work too, but this is untested).
- For some requests (like Oauth2 Grant) an **SSL** POST http method is required, even for those where it is not a requirement it is still recommended.

## Which methods need the OAuth2 authentication

The Jamendo api methods protected by the OAuth2 authentication are those which require an _access\_token_ parameter, typically all the write methods. Check it out reading the 'Required parameters' information listed on every api method documentation page.

## OAuth2 Authorize request (get user 'authorization\_code')

### Objective:

The objective of such a request is to **ask the user if he agrees to grant some rights to your application**.


The eventual agreement, will **redirect the user to the Jamendo login form**, if he is not already logged in.

It's possible to ask permissions for different classes of rights, called ' **scopes**'. Every api method protected by the OAuth2 authentication requires an 'access\_token' parameter.
To know wich scope is needed for an api method, read the _access\_token description_ of that method. At the moment, all our api methods protected by OAuth2 authentication need the scope named 'music'.
The **music scope** allows your application to write user's music properties (user's playlists, user's favorite tracks/artists/albums, ...)


Some methods like _/reviews/tracks_, _/playlists_, or _/users_, simply read public data, and thus **accept but don't require** the access\_token; such methods don't need any specific scope to be accepted.

In the future, we may add some new api methods requiring different scopes: for example 'private' could authorize to read and write user's private data, and 'publish' could authorize to publish reviews on Jamendo...


To summarize, **depending on the permissions needed to implement your application features**, you will ask the user to authorize one or more corresponding scopes. Of course, the user will be able to authorize all, none, or just some of them.

### How to:

To do an OAuth2 Authorize request, make a **GET request** to **"https://api.jamendo.com/v3.0/oauth/authorize"** with the following parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| client\_id | string | yes | A Jamendo.com Client Id ( [see simple authentication](https://developer.jamendo.com/v3.0/authentication#authentication-app)) |
| redirect\_uri | string | no | If not defined as a GET parameter, the redirect url defined in your _application_ (in your Jamendo developer portal) will be used as default. <br> If you prefer to pass it as a GET parameter, **ensure that redirect\_uri GET parameter uses the same domain as the redirect url parameter defined in your application configuration**. <br> Example: if you have defined the redirect url as "http://yourdomain.com/yourapp/" in your "application" created in your Jamendo developer portal, you can only set a redirect\_uri parameter like "http://yourdomain.com/yourapp/ANYTHING". |
| scope | enum: {music} | no | The default scope is 'music' and at the moment there is no other scope available. <br> Check the 'access\_token' description of the api method you want to use to know which scope is needed |
| response\_type | enum: {code} | no | The default value is 'code' and that's the only possible value for this parameter. In fact we always use the [Authorization Code Grant protocol](http://tools.ietf.org/html/draft-ietf-oauth-v2-31#section-4.1). |
| state | string | no | An opaque value used by the client to maintain state between the request and the callback. The authorization server will return this value as a GET parameter when redirecting the user back to the redirect\_url that got supplied in the request. <br> This parameter should be used to prevent cross-site request forgery (CSRF) attacks. |

_Sample_:
`https://api.jamendo.com/v3.0/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URL&state=YOURSTATE`

### Reponse:

**If an error got detected** that is related to your client\_id or your redirect\_uri, json string containing the error will be returned in the http body.
If an error gets detected for another parameter, the error will be sent to the redirect url as GET parameters.

| Error name | Description |
| --- | --- |
| invalid\_client | Several reasons, see the description in the returned json... |
| invalid\_request | Several reasons, see the description in the returned json... |
| invalid\_uri | The redirect URI must not contain a [fragment](https://en.wikipedia.org/wiki/Fragment_identifier) |
| redirect\_uri\_mismatch | The redirect URI provided is missing or does not match |
| unsupported\_response\_type | The only supported response type is "code" |
| invalid\_scope | You have asked an authorization for an unsupported scope. |
| access\_denied | The user denied the access for the wanted scope(s). It means he has refused to give an access to your application. |
| server\_error | Probably a temporary error, try again later and contact Jamendo ( [api@jamendo.com](mailto:api@jamendo.com)) if you continue to get this error... |

_Error sample_:
`{"error":"invalid_client", "error_description":"Can't get information about this clientId: Not Found", "error_uri":"URL_TO_HELP_YOU"}`

**If the request is successful**, an authorization 'code' and your 'state' (if defined) get returned to your redirect url as GET parameters.

_Success (redirect) sample_:
`http://YOUR_REDIRECT_URL?code=YOUR_AUTHORIZATION_CODE&state=YOUR_STATE`

## OAuth2 Grant request (get an 'access\_token')

### Objective:

The main objective of the OAuth2 Grant request is to **exchange the authorization code** you have received with the [OAuth2 Authorize request](https://developer.jamendo.com/v3.0/authentication#oauth2-authorize-request) to get an **'access token'**.

### How to:

To do an OAuth2 Grant request, make a **SSL POST request** to **"https://api.jamendo.com/v3.0/oauth/grant"**.


**Caution**, this request MUST be in SSL to protect your client\_secret and the accesses you will receive.


**Caution**, you must execute this request immediately after having received the authorization token from the [OAuth2 Authorize request](https://developer.jamendo.com/v3.0/authentication#oauth2-authorize-request) because the authorization code will expire after 30 seconds.
Here are the available parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| client\_id | string | yes | A Jamendo API Client Id ( [see simple authentication](https://developer.jamendo.com/v3.0/authentication#authentication-app)) |
| client\_secret | string | yes | The client\_secret provided in your "application" (in your Jamendo developer portal). **This client\_secret MUST stay SECRET!** |
| grant\_type | string | yes | This must be " **authorization\_code**". |
| code | string | yes | The authorization code you've got with the [OAuth2 Authorize request](https://developer.jamendo.com/v3.0/authentication#oauth2-authorize-request). Caution, an authorization code is **valid only for 30 seconds**. |
| redirect\_uri | string | yes or no | Required, if the "redirect\_uri" parameter was included in the previous OAuth2 Authorize request, both redirect uri parameters **MUST be identical**. |

### Reponse:

**If an error is detected**, a json document containing information about the error is returned in the http response body.
In the error response you can also have an error\_uri that you might want to follow if you need more help to understand the error or understand how to fix it.

| Error name | Description |
| --- | --- |
| invalid\_client | The client credentials are invalid |
| unauthorized\_client | The grant type is unauthorized for this client\_id |
| invalid\_request | Several reasons, see the description in the returned json... |
| invalid\_grant | Several reasons, see the description in the returned json... |
| unsupported\_grant\_type | Grant type GRANT\_TYPE\_ASKED is not supported |

_Error sample_:
`{"error":"invalid_grant", "error_description":"Authorization code doesn't exist or is invalid for the client"}`

**If the request is successful**, an "access\_token", an "expires\_in" (time in seconds for which the access\_token is valid), a "refresh\_token",
the "scope" that has been authorized by the user and the "token\_type" (always " [bearer](http://tools.ietf.org/html/draft-ietf-oauth-v2-bearer-22)"
(it indicates how to use your OAuth2 client to make OAuth2 access requests) parameters get returned in the http reponse (json).

_Success sample_:
`{"access_token":"YOUR_NEW_ACCESS_TOKEN", "expires_in":7200,"token_type":"bearer", "scope":"music", "refresh_token":"YOUR_REFRESH_TOKEN"}`

## OAuth2 Grant request (refresh an "access\_token")

### Objective:

The other objective of the OAuth2 Grant request is to **renew an access\_token** when it has expired.

### How to:

To refresh an access\_token, make an **SSL POST request (this request MUST use SSL to protect your client\_secret and the accesses you will receive)** to **"https://api.jamendo.com/v3.0/oauth/grant"** with these parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| client\_id | string | yes | A Jamendo API Client Id ( [see simple authentication](https://developer.jamendo.com/v3.0/authentication#authentication-app)) |
| client\_secret | string | yes | The client\_secret provided in your "application" (in your Jamendo developer portal). **This client\_secret MUST stay SECRET!** |
| grant\_type | string | yes | This must be " **refresh\_token**". |
| refresh\_token | string | yes | The "refresh\_token" you got after you requested the "access\_token" that has expired |

### Reponse:

**If an error gets detected**, a json string containing the error gets returned in the http reponse body.
In the error response you can also have an error\_uri that you might want to follow if you need more help to understand the error or understand how to fix it.

| Error name | Description |
| --- | --- |
| invalid\_client | The client credentials are invalid |
| unauthorized\_client | The grant type is unauthorized for this client\_id |
| invalid\_request | Several reasons, see the description in the returned json... |
| invalid\_grant | Several reasons, see the description in the returned json... |
| unsupported\_grant\_type | Grant type GRANT\_TYPE\_ASKED not supported |

**_Error sample_**:
`{"error":"invalid_request", "error_description":"The grant type was not specified in the request"}`

**If the request is successfull**, a **NEW** "access\_token", an "expires\_in" (time in seconds for which the access\_token is valid) a **NEW** "refresh\_token",
the "scope" that has been authorized by the user and the "token\_type" (always " [bearer](http://tools.ietf.org/html/draft-ietf-oauth-v2-bearer-22)"
(it indicates how to use your OAuth2 client to make OAuth2 access requests) will get returned in the http reponse body (json string).


**Don't forget to overwrite the old "access\_token" AND the old "refresh\_token" by the new ones in your application storage.**

_Success sample_:
`{"access_token":"YOUR_NEW_ACCESS_TOKEN", "expires_in":7200, "token_type":"bearer", "scope":"music", "refresh_token":"YOUR_NEW_REFRESH_TOKEN"}`

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)