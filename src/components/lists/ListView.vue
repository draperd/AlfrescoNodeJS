<style></style>

<template>
   <ul>
      <li v-for="item in list.entries"
          @click="navigate(item, $event)">{{item.entry.name}}</li>
   </ul>
</template>

<script>
   export default {
      props: ['list'],
      methods: {
         navigate: function(item, evt) {
            if (item.entry.isFolder)
            {
               this.$emit("navigate", item);
            }
         }
      }
   }
</script>