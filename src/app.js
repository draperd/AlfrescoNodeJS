import Vue from 'vue';
import axios from 'axios';

// Create a new Vue as an event bus.
// This has been necessary because I've not figured out how to handle custom events
// between components
// This is going to need to be updated when the components are split into different
// files!
var bus = new Vue();

Vue.component('alf-list', {
   template: `<div>
      <slot name="before-view" :list="list"></slot>
      <slot name="view" :list="list">No view configured</slot>
   </div>`,
   data: () => ({
      skipCount: 0,
      maxItems: 3,
      list: {
         pagination: {
            skipCount: 0,
            maxItems: 3
         }
      },
   }),
   beforeMount() {
      this.getData();
   },
   created() {
      bus.$on('pageForward', this.pageForward);
      bus.$on('pageBack', this.pageBack);
   },
   beforeDestroy() {
      bus.$off(); // Remove all event listeners as part of clean-up
   },
   methods: {
      pageBack: function() {
         if (this.list.pagination.skipCount)
         {
            this.skipCount -= this.maxItems;
            this.getData();
         }
      },
      pageForward: function() {
         if (this.list.pagination.hasMoreItems)
         {
            this.skipCount += this.maxItems;
            this.getData();
         }
      },
      getData: function() {
         axios.get(`/proxy/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?skipCount=${this.skipCount}&maxItems=${this.maxItems}`)
            .then(response => {
               this.list = response.data.list;
            });
      }
   }
});

Vue.component('alf-list-view', {
   template: `<ul>
      <li v-for="item in list.entries">{{item.entry.name}}</li>
   </ul>`,
   props: ['list']
});

Vue.component('alf-list-toolbar', {
   template:  `<span>
                  <button v-on:click="back()">Page Back</button>
                  <span>{{ list.pagination.skipCount / list.pagination.maxItems + 1}}
                  <button v-on:click="forward()">Page Forward</button>
               </span>`,
   props: ['list'],
   methods: {
      back: function() {
         bus.$emit('pageBack');
      },
      forward: function() {
         bus.$emit('pageForward');
      }
   }
});

var vm = new Vue({
   el: '#app'
});