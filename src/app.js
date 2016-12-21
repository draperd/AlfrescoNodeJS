import Vue from 'vue';
import axios from 'axios';

Vue.component('alf-list', {
   template: `<ul id="example-1">
      <li v-for="item in items">
       {{ item.node.properties["cm:name"] }}
     </li>
   </ul>`,
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

var vm = new Vue({
   el: '#app'
});