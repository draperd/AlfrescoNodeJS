<style>
   .components-lists-Breadcrumb {

   }

</style>

<template>
   <nav class='components-lists-Breadcrumb' role='navigation'>
       <p id='breadcrumblabel'>You are here: {{relativePath}}</p>
       <ol id='breadcrumb' aria-labelledby='breadcrumblabel'>
           <li role='link' 
               v-for='breadcrumb in breadcrumbs' 
               @click='navigate(breadcrumb, $event)'>{{breadcrumb.label}}</li>
       </ol>
   </nav>
</template>

<script>
   export default {
      props: ['relativePath'],
      beforeMount() {
         this.breadcrumbs = [{
            label: 'Home',
            relativePath: '/'
         }]
      },
      watch: {
         relativePath: function() {
            let lastPathElement = '/';
            this.breadcrumbs = [{
               label: 'Home',
               relativePath: lastPathElement
            }];
            this.relativePath
               .split('/')
               .filter(function(name) {
                  return name.trim() !== '';
               })
               .forEach(function(pathElement) {
                  let relativePath = lastPathElement + pathElement + '/'
                  this.breadcrumbs.push({
                     label: pathElement,
                     relativePath: relativePath
                  });
                  lastPathElement = relativePath;
               }, this);
         }
      },
      methods: {
         navigate: function(breadcrumb, evt) {
            this.$emit('setRelativePath', breadcrumb.relativePath);
         }
      }
   }
</script>