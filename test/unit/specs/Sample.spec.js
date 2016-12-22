import Vue from 'vue';
import List from '../../../src/components/lists/List.vue';

describe('List.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: (h) => h(List),
    });
    expect(vm.$el.querySelector('form'));
  });
});