<style>

</style>

<template>
   <div>
      <Toolbar :list="list" @pageForward="pageForward" @pageBack="pageBack"></Toolbar>
      <List-View :list="list"></List-View>
   </div>
</template>

<script>
   import Vue from 'vue';
   import axios from 'axios';

   import ListView from './ListView.vue';
   import Toolbar from './Toolbar.vue'

   export default { 
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
      },
      components: {
         ListView,
         Toolbar
      }
   };
</script>
