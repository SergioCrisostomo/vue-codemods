<template>
  <div>Some test template</div>
</template>
<script>
const {spreadA, spreadB} = {};

export default {
  name: 'TestTemplate',
  computed: {
    ...spreadA,
    computedB() {
      return 'B';
    },
    computedA() {
      return 'A';
    },
    ...spreadB,
  },
  props: {
    b: ['bar'],
    c: ['baz'],
    a: ['foo'],
  },
  methods: {
    methodC() {
      return 'c';
    },
    methodA() {
      return 'a';
    },
    methodB() {
      return 'b';
    },
  },
};
</script>

<style scoped>
div {
  background-color: aquamarine;
}
</style>
