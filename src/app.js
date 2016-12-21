import Vue from 'vue';
import axios from 'axios';

Vue.component('alf-list', {
   template: `<div>
      <slot name="before-view" :list="list"></slot>
      <slot name="view" :list="list">No view configured</slot>
   </div>`,
   data: () => ({
      list: {},
   }),
   beforeMount() {
      axios.get('/proxy/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children')
         .then(response => {
            this.list = response.data.list;
         });
   }
});

Vue.component('alf-list-view', {
   template: `<ul>
      <li v-for="item in list.entries">{{item.entry.name}}</li>
   </ul>`,
   props: ['list']
});

Vue.component('alf-list-toolbar', {
   template: `<span><button>Page up</button><button>Page Down</button></span>`,
   props: ['list']
});

var vm = new Vue({
   el: '#app'
});