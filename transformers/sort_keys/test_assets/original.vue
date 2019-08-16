<template>
  <div>Some test template</div>
</template>
<script>
const {spreadA, spreadB} = {};

export default {
  name: 'TestTemplate',
  computed: {
    ...mapGettersB(),
    computedB() {
      return 'B';
    },
    computedA() {
      return 'A';
    },
    ...mapGettersA(),
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
