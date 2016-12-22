<style></style>

<template>
   <ul>
      <li v-for="item in list.entries">{{item.entry.name}}</li>
   </ul>
</template>

<script>
   export default {
      props: ['list']
   }
</script>