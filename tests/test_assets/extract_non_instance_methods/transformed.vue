<template>
  <div>Some test template</div>
</template>
<script>
const noThis = function(bar) {
  return {methods: [1, 2, 3, bar]};
};

export default {
  name: 'TestTemplate',
  computed: {
    computedB() {
      return 'B';
    },
    computedA() {
      return 'A';
    },
  },
  props: {
    b: ['bar'],
    c: ['baz'],
    a: ['foo'],
  },
  methods: {
    hasThis() {
      const foo = this.foo;
      bar();
      return noThis(foo);
    }
  },
};
</script>

<style scoped>
div {
  background-color: aquamarine;
}
</style>
