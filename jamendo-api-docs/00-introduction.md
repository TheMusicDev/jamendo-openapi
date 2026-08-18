Version 3.0


# Jamendo API Introduction

Welcome to the Jamendo API documentation!

Please use our Api to build awesome music applications, support independent artists and express your creativity through mash-ups and innovative products!

We provide more than 20 different [read methods](https://developer.jamendo.com/v3.0/read-methods) to access a catalog of half-a-million tracks,
some powerful features for music discovery like search and radios, [OAuth2 based authentication](https://developer.jamendo.com/v3.0/authentication#authentication-oauth2-introduction),
5 [write methods](https://developer.jamendo.com/v3.0/write-methods) to manage user library, and a website to monitor your app statistics.

Developer.jamendo.com will help you discover the various features available through our API and will give you thorough explanations about how to implement them in your application. Have a great time using our API and don't hesitate to share the outcome of your work with us!

### Rest-like API

Every Jamendo Api method is generically expressed as an entity or entity+subentity. The generic GET url form is the following:
`http[s]://api.jamendo.com/<version>/<entity>/<subentity>/?<api_parameter>=<value>`
As some of the RESTfull specifications (like the CRUD actions 1-1 mapping through HTTP methods, or the entity Id received as get parameter) are not implemented in our framework, we prefer to define our API as RESTlike.

### Http\[s\] methods

Read methods need an http or https GET method, while write methods need a POST. Note that you _can and definitely should_ always use SSL to improve your application security, and you _must_ use it in certain parts of the OAuth process.

### Document format

Every Api call returns a response document in the [requested format](https://developer.jamendo.com/v3.0/read-methods): json, jsonpretty, xml. Such a response document (with a slightly different structure depending on the used format), will always contain some [headers](https://developer.jamendo.com/v3.0/response-codes), and the results requested by your Api call.

On every [read method's documentation page](https://developer.jamendo.com/v3.0/read-methods) and [write method's documentation page](https://developer.jamendo.com/v3.0/write-methods) you can see an example of a request and the corresponding response document.

### Need any help?

If you have any questions, suggestions, bugs or malfunctions to report, write us and actively participate to the [Jamendo GoogleGroup!](https://groups.google.com/forum/#!forum/jamendo-dev) Someone from our team or from the developer community itself will answer you as soon as possible.

### Jamendo Api Terms of Use

When signing up to our [developer portal](https://devportal.jamendo.com/) and creating application, you are required to accept [Jamendo's Api terms of use](https://devportal.jamendo.com/api_terms_of_use), which we invite you to read carefully.

[![API powered by 3scale API Management solution](https://developer.jamendo.com/images/3scale/powered_by_logo.png)](http://www.3scale.net/)