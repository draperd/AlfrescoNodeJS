/* global sinon, describe, it, expect */

import Vue from 'vue';
import List from '../../../src/components/lists/List.vue';

// Import a fake response...
var nodes = require('json-loader!./Nodes.json');

// Create our mock server...
var server= sinon.fakeServer.create();
server.autoRespond = true;
server.xhr.useFilters = true;
server.respondWith('GET',
                  /(.*)/,
                  [200,
                   {'Content-Type':'application/json;charset=UTF-8'},
                   JSON.stringify(nodes)]);

// Describe the tests...
describe('List.vue', () => {
  it('should render correct contents', (done) => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: (h) => h(List),
    });
    setTimeout(function() {
        expect(vm.$el.querySelector('li.components-lists-ListView__item').textContent).to.equal('Data Dictionary');
        done();
    }, 1500);
    
  });
});