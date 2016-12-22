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

      var timeout = 2000;
      var selector = 'li.components-lists-ListView__item';
      var p = new Promise(function(resolve, reject) {

         var intervalId;
         var timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            reject('Could not find element');
         }, timeout);
         intervalId = setInterval(() => {
            let result = vm.$el.querySelector(selector);
            if (result)
            {
               clearInterval(intervalId);
               clearTimeout(timeoutId);
               resolve(result);
            }
         }, 100);
         
      });
      
      p.then((result) => {
         expect(result.textContent).to.equal('Data Dictionary', 'Wrong text');
         done();
      }).catch((error) => {
         done(error);
      });


    // setTimeout(function() {
    //     expect(vm.$el.querySelector('li.components-lists-ListView__item').textContent).to.equal('Data Dictionary');
    //     done();
    // }, 1500);
    
  });
});