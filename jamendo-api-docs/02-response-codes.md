Version 3.0


## Jamendo Api Response Codes

Every call returns a document containing headers and results. The headers are composed of four fields:

- _status_: it can be either 'succeed' or 'failed'
- _code_: will be 0 in case of a success or an error Id (different then zero) in case of a fail. All the information you need is in the table below.
- _error\_message_: contains the error message if an error occured else it is empty. Every error message will contain the _type_ of the error (see in table below) as well as the contextual error description
- _warnings_: may contain warning messages if any. Warnings get raised, but do not let the request fail.

| code | type | description |
| --- | --- | --- |
| 0 | Success | Success (or success with warning) |
| 1 | Exception | A generic not well identificated error occurred |
| 2 | Http Method | The received http method is not supported for this method |
| 3 | Type | One of the received parameters has a value not respecting requirements such as type, range, format, etc |
| 4 | Required Parameter | A required parameter was not been received, or it was empty |
| 5 | Invalid Client Id | The client Id received does not exists or cannot be validated |
| 6 | Rate Limit Exceeded | This requester app or the requester IP have exceeded the permitted rate limit |
| 7 | Method Not Found | Jamendo Api rest-like reading methods are in the format api.jamendo.com/version/entity/subentity (subentity is optional). This exception is raised when entity and/or subentity methods don't exist |
| 8 | Needed Parameter | A parameter needed because of an imposed local condition was not received or/and has not the needed value |
| 9 | Format | This exception is raised when the api call requests an unkown output format |
| 10 | Entry Point | The used IP and/or port is not recognized as valid entry point |
| 11 | Suspended Application | The client application has been suspended (illegal usage, ...) |
| 12 | Access Token | Invalid Access Token. |
| 13 | Insufficient Scope | Insufficient scope. The request requires higher privileges than provided by the access token |
| 21 | Invalid User | Some parameters of User is not valid. |
| 22 | Email Already Exist | The email is already used by another user. |
| 23 | Duplicate Value | This error is raised when a client tries to write or update a value which already exists and cannot be duplicated |
| 24 | Invalid Playlist | Check your playlist id. |
| 101 | Access Code | Please check if you have correctly typed in your access code and if your subscription is still marked as being active in your client space. |

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)