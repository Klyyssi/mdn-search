#!/usr/bin/env node

var open = require('open');
var req = require('superagent');
var arg = require('minimist')(process.argv.slice(2), { boolean: ['o', 'open'] });
var baseURL = 'https://developer.mozilla.org';
var o = arg.o || arg.open || (arg._[0] == 'open' ? arg._.shift() : false);

var request = baseURL + '/en-US/search.json' +
    '?q=' + encodeURIComponent(arg._.join(' ')) +
    '&page=' + encodeURIComponent(arg.p || arg.page || 1) +
    '&per_page=' + encodeURIComponent(arg.l || arg.limit || o ? 1 : 5);

if (arg.t || arg.topic) request += '&topic=' + encodeURIComponent(arg.t || arg.topic);

req.get(request).end(function(err, res){
    if (!err && res.body.documents) {
        if (o) open(baseURL + res.body.documents[0].mdn_url);
        else console.log('\n' + res.body.documents.map(function(doc){
            return doc.title + '\n' + baseURL + doc.mdn_url;
        }).join('\n\n') + '\n');
    }
});