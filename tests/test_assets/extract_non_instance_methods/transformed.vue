<template>
  <div :some-prop="noThisButUsedInTemplate1('foo')" @click="noThisButUsedInTemplate2">
    Some test template
  </div>
</template>
<script>
import {CSS_PREFIX_UPPER_FIRST} from 'Src/shared';
import kebabCase from 'lodash/kebabCase';
import isOneOf from 'Global/Assets/isOneOf';
import not from 'Global/Assets/not';
import isPopulatedString from 'Global/Assets/isPopulatedString';
import toTrueOrNull from 'Global/Assets/toTrueOrNull';
import SrIcon from 'RootDir/src/icon/Icon';
// noinspection ES6CheckImport
import {faTimes} from '@fortawesome/pro-regular-svg-icons/faTimes';
// noinspection ES6CheckImport
import {faLightbulb} from '@fortawesome/pro-solid-svg-icons/faLightbulb';
// noinspection ES6CheckImport
import {faThumbsUp} from '@fortawesome/pro-solid-svg-icons/faThumbsUp';
// noinspection ES6CheckImport
import {faExclamationTriangle} from '@fortawesome/pro-solid-svg-icons/faExclamationTriangle';
// noinspection ES6CheckImport
import {faExclamationCircle} from '@fortawesome/pro-solid-svg-icons/faExclamationCircle';
// noinspection ES6CheckImport
import {faStar} from '@fortawesome/pro-solid-svg-icons/faStar';

import {INFO, SUCCESS, WARNING, DANGER, UPDATE, CLOSE, DESCRIPTION, ICON_LEFT, MESSAGE, TITLE} from 'Global/Dictionary';

const VARIANTS = Object.freeze([INFO, SUCCESS, WARNING, DANGER, UPDATE]);

const NAME = `${CSS_PREFIX_UPPER_FIRST}Alert`;
const CSS_COMPONENT_PREFIX = kebabCase(NAME);

const BASE_ICONS = Object.freeze({
  [INFO]: faLightbulb,
  [SUCCESS]: faThumbsUp,
  [DANGER]: faExclamationTriangle,
  [WARNING]: faExclamationCircle,
  [UPDATE]: faStar,
});

const isOneOfVariants = function isOneOfVariants(value) {
  return isOneOf(value, VARIANTS);
};

const noThis = function() {
  return 'I should be extracted to the global space';
};

export default {
  name: NAME,
  components: {SrIcon},
  props: {
    closable: {
      default: false,
      type: Boolean,
    },
    description: {
      default: null,
      type: String,
      validator: isPopulatedString,
    },
    icon: {
      default: false,
      type: Boolean,
    },
    title: {
      default: null,
      type: String,
      validator: isPopulatedString,
    },
    variant: {
      default: INFO,
      type: String,
      validator: isOneOfVariants,
    },
  },
  data() {
    return {
      isOpen: true,
    };
  },
  computed: {
    attrIconBase() {
      if (this.icon && isOneOfVariants(this.variant)) {
        return BASE_ICONS[this.variant];
      }

      return false;
    },
    attrIconClose() {
      return faTimes;
    },
    classClose() {
      return `${CSS_COMPONENT_PREFIX}-${CLOSE}`;
    },
    classDescription() {
      return `${CSS_COMPONENT_PREFIX}-${DESCRIPTION}`;
    },
    classIconLeft() {
      return `${CSS_COMPONENT_PREFIX}-${ICON_LEFT}`;
    },
    classMessage() {
      return `${CSS_COMPONENT_PREFIX}-${MESSAGE}`;
    },
    classRoot() {
      return CSS_COMPONENT_PREFIX;
    },
    classTitle() {
      return `${CSS_COMPONENT_PREFIX}-${TITLE}`;
    },
    dataClosable() {
      return toTrueOrNull(this.closable);
    },
    dataDescription() {
      return toTrueOrNull(this.isDescription);
    },
    dataTitle() {
      return toTrueOrNull(isPopulatedString(this.title) || Boolean(this.$slots.title));
    },
    isClosed() {
      return not(this.isOpen);
    },
    isDescription() {
      return isPopulatedString(this.description) || Boolean(this.$slots.description);
    },
    isTitled() {
      return isPopulatedString(this.title) || Boolean(this.$slots.title);
    },
  },
  methods: {
    close() {
      if (this.isClosed) {
        return;
      }

      this.isOpen = false;
      this.$emit(CLOSE);
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
