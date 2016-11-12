const jsdom = require('jsdom');
const chai = require('chai');
const chaiImmutable = require('chai-immutable');

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultview;

global.document = doc;
global.window = win;

Object.key(window).forEach((key) => {
    if (!key in global) {
        global[key] = window[key];
    }
});

chai.use(chaiImmutable);
