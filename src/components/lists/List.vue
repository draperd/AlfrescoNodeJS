<style>

</style>

<template>
   <div>
      <Breadcrumb :relativePath="relativePath"
                  @setRelativePath="setRelativePath"></Breadcrumb>
      <Toolbar :list="list" 
               @pageForward="pageForward" 
               @pageBack="pageBack"></Toolbar>
      <List-View :list="list"
                 @navigate="navigate"></List-View>
   </div>
</template>

<script>
   import Vue from 'vue';
   import axios from 'axios';

   import NodeService from '../../services/NodeService';
   import ListView from './ListView.vue';
   import Toolbar from './Toolbar.vue';
   import Breadcrumb from './Breadcrumb.vue';

   export default { 
      data: () => ({
         skipCount: 0,
         maxItems: 3,
         relativePath: '/',
         list: {
            pagination: {
               skipCount: 0,
               maxItems: 3
            }
         }
      }),
      beforeMount() {
         this.nodeService = new NodeService();
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
            this.nodeService.getItems({
               skipCount: this.skipCount,
               maxItems: this.maxItems,
               relativePath: this.relativePath
            })
               .then(response => {
                  this.list = response.data.list;
               });
            // axios.get(`/proxy/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?include=path&skipCount=${this.skipCount}&maxItems=${this.maxItems}&relativePath=${this.relativePath}`)
               // .then(response => {
               //    this.list = response.data.list;
               // });
         },
         navigate: function(item) {
            this.skipCount = 0;
            this.relativePath += `${item.entry.name}/`;
            this.getData();
         },
         setRelativePath: function(relativePath) {
            this.skipCount = 0;
            this.relativePath = relativePath;
            this.getData();
         }
      },
      components: {
         ListView,
         Toolbar,
         Breadcrumb
      }
   };
</script>
