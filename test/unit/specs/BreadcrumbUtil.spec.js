/* global describe, it, expect */

import BreadcrumbUtil from '../../../src/components/lists/Breadcrumb';


// Describe the tests...
describe('Breadcrumb Util', () => {
   it('should generate home breadcrumb for root', () => {
      
      let breadcrumbs = BreadcrumbUtil.createBreadcrumbs('/');
      expect(breadcrumbs).to.have.lengthOf(1);
    
  });
});