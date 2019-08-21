<template>
  <div>Some test template</div>
</template>
<script>
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
    noThis(bar) {
      return {methods: [1, 2, 3, bar]};
    },
    hasThis() {
      const foo = this.foo;
      bar();
      return this.noThis(foo);
    },
  },
};
</script>

<style scoped>
div {
  background-color: aquamarine;
}
</style>
