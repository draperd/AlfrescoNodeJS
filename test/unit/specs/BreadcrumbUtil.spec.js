/* global describe, it, expect */

import BreadcrumbUtil from '../../../src/components/lists/Breadcrumb';


// Describe the tests...
describe('Breadcrumb Util', () => {
   it('should generate home breadcrumb for root', () => {
      
      let breadcrumbs = BreadcrumbUtil.createBreadcrumbs({
         relativePath: '/'
      });
      expect(breadcrumbs.breadcrumbs).to.have.lengthOf(1);
    
  });
});