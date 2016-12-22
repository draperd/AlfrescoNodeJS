import Vue from 'vue';
import List from './components/lists/List.vue';

new Vue({
   el: '#app',
   render(createElement) {
      return createElement(List);
   }
});