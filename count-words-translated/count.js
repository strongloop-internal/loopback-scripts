#!/usr/bin/env node

var fs = require('fs');
var wc = require('word-count');

var count = 0;

fs.readdir('./downloads', function(err, files) {
  files.forEach(function(file) {
    var translation = require('./downloads/' + file);
    for (var key in translation) {
      var sentence = translation[key];
      var translated = sentence
        .replace(/\"/g, '')
        .replace(/.?\"?{?\{[^}]+\}\}?.?/g, ' ');
      console.log(wc(translated));
      count += wc(translated);
    }
    console.log('total', count);
  });
  console.log(count);
});

