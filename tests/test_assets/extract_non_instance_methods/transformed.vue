<template>
  <div :some-prop="noThisButUsedInTemplate1('foo')" @click="noThisButUsedInTemplate2">
    Some test template
  </div>
</template>
<script>
const noThis = function() {
  return 'I should be extracted to the global space';
};

export default {
  name: 'Component',
  methods: {
    close() {
      this.$emit('close');
    },

    noThisButUsedInTemplate1() {
      return 'I should stay in the instance';
    },

    noThisButUsedInTemplate2() {
      return 'I should stay in the instance';
    }
  },
};
</script>

<style scoped>
div {
  background-color: aquamarine;
}
</style>
