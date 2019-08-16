# Vue codemods

This repository contains a collection of codemod scripts for use with JSCodeshift that help update and refactor Vue and JavaScript files.


### How to use:

    $ npm install 
    $ node transformers/sort_keys/sortKeys.js --path <folder with vue files>

### Transformers:

**Sort keys:**

Sort object keys sorts Vue API properties according to [Vue's styleguide](https://vuejs.org/v2/style-guide/).  
 This transformer does:

 - sort Vue API properties alphabetically
 - sort keys inside each of the vue API properties
 
Example:

    $ node transformers/sort_keys/sortKeys.js --path <folder with vue files>


Before the transform:

```
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
```

After the transform:

```
  computed: {
    ...mapGettersB(),
    ...mapGettersA(),

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

```

You might want to run your ESLint after the transformer was applied, to keep your codestyle.
