export default class Breadcrumb {

   /**
    * 
    * 
    * @param  {[type]} relativePath [description]
    * @return {[type]}              [description]
    */
   static createBreadcrumbs(relativePath) {
      let lastPathElement = '/';
      let breadcrumbs = [{
         label: 'Home',
         relativePath: lastPathElement
      }];
      relativePath
         .split('/')
         .filter(function(name) {
            return name.trim() !== '';
         })
         .forEach(function(pathElement) {
            let currRelativePath = lastPathElement + pathElement + '/';
            this.breadcrumbs.push({
               label: pathElement,
               relativePath: currRelativePath
            });
            lastPathElement = currRelativePath;
         }, this);
      return breadcrumbs;
   }
}