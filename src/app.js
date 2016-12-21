import Vue from 'vue';
import axios from 'axios';

Vue.component('alf-list', {
   template: `<div>
      <slot name="view" :items="items">No view configured</slot>
   </div>`,
   data: () => ({
      items: [],
   }),
   beforeMount() {
      axios.get('/proxy/alfresco/slingshot/doclib2/doclist/all/node/alfresco/company/home')
         .then(response => {
            this.items = response.data.items;
         });
   }
});

Vue.component('alf-list-view', {
   template: `<ul>
      <li v-for="item in items">
       {{ item.node.properties["cm:name"] }}
     </li>
   </ul>`,
   props: ['items']
});

var vm = new Vue({
   el: '#app'
});