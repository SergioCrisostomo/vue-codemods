<template>
  <div>Some test template</div>
</template>
<script>
const {spreadA, spreadB} = {};

export default {
  name: 'TestTemplate',
  computed: {
    ...spreadA,
    ...spreadB,

    computedA() {
      return 'A';
    },

    computedB() {
      return 'B';
    }
  },
  props: {
    a: ['foo'],
    b: ['bar'],
    c: ['baz'],
  },
  methods: {
    methodA() {
      return 'a';
    },
    methodB() {
      return 'b';
    },
    methodC() {
      return 'c';
    },
  },
};
</script>

<style scoped>
div {
  background-color: aquamarine;
}
</style>
