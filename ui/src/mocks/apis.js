'use strict';

var API_BASE = '/v1/se';
var DEF_API_PATH = API_BASE;

module.exports = {
    API_A_URL: DEF_API_PATH,

    createGETRequest: function (api, query, preffix) {
        var _preffix = preffix || DEF_API_PATH;
        var req = {
            'url': '^' + _preffix + api + '$',
            'method': 'GET'
        };

        if(query){
            req.query = query;
        }

        return req;
    },

    createPOSTRequest: function (api, post, query, preffix) {
        var _preffix = preffix || DEF_API_PATH;
        var req = {
            'url': '^' + _preffix + api + '$',
            'method': 'POST',
            'post': post
        };

        if(query){
            req.query = query;
        }

        return req;
    },

    createDELETERequest: function (api, post, query, preffix) {
        var _preffix = preffix || DEF_API_PATH;
        var req = {
            'url': '^' + _preffix  + api,
            'method': 'DELETE',
            'post': post
        };

        if(query){
            req.query = query;
        }

        return req;
    },

    createPUTRequest: function (api, post, query, preffix) {
        var _preffix = preffix || DEF_API_PATH;
        var req = {
            'url': '^' + _preffix  + api + '$',
            'method': 'PUT',
            'post': post
        };

        if(query){
            req.query = query;
        }

        return req;
    },

    createResponse: function (body, status, latency) {
        return {
            'status': status || 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'latency': latency || 500,
            'body': body
        };
    },

    createJSONResponse: function (path, status, latency) {
        return {
            'status': status || 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
             },
            'latency': latency || 500,
            'file': '../res_data' + path
        };
    },

    createFileDownloadResponse: function (path, status, latency){
        return {
            'status': status || 200,
            'headers': {
                'Content-Disposition': 'attachment; filename=export.xml',
                'Content-Length': 5214,
                'Content-Type': 'text/xml',
                'Access-Control-Allow-Origin': '*'
            },
            'latency': latency || 500,
            'file': '../data' + path
        };
    }


};
