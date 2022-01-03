<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'button',
        validator(value) {
          return [
            'button',
            'submit',
          ].includes(value)
        },
      },
      to: {
        type: [Object,
          String],
        default: ''
      },
      href: {
        type: String,
        default: ''
      },
      target: {
        type: String,
        default: '_blank'
      },
      loading: {
        type: Boolean,
        default: false
      },
      replace: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toUpperCasefirst(str) {
        const strarr = str.split(' ');
        let result = '';

        for(let i in strarr) {
          result = `${ strarr[i].substring(0, 1)
            .toUpperCase() }${ strarr[i].substring(1) }`;
        }

        return result;
      }
    },
  };
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :disabled="disabled"
    class="baseButton"
    :class="{ isDisabled: disabled }"
    v-on="$listeners"
  >
    <span class="baseButton__content"><slot/></span>
  </a>
  <router-link
    v-else-if="to"
    :to="to"
    :disabled="disabled"
    class="baseButton"
    :class="{ isDisabled: disabled }"
    v-on="$listeners"
  >
    <span class="baseButton__content"><slot/></span>
  </router-link>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="baseButton"
    :class="{ isLoading: loading, isDisabled: disabled }"
    v-on="$listeners"
  >
    <span class="baseButton__content"><slot/></span>
  </button>
</template>
<style lang="scss">
  $colors: (
    "primary": (
      "color": $color-primary,
      "color-hover": darken($color-primary, 5%),
      "text": #FFF,
    ),
    "primaryDark": (
      "color": $color-primary-dark,
      "color-hover": darken($color-primary-dark, 5%),
      "text": #FFF,
    ),
    "dark": (
      "color": $color-gray-5,
      "color-hover": darken($color-gray-5, 5%),
      "text": #FFF,
    ),
  );

  .baseButton {
    display: inline-block;
    width: auto;
    max-width: 100%;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.15;
    color: #FFF;
    text-align: center;
    letter-spacing: 0.2em;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    background: grey;
    border: 1px solid transparent;
    opacity: 1;
    transition: background 0.3s, border 0.3s, color 0.3s, opacity 0.3s, backdrop-filter 0.3s;
    -webkit-appearance: none;
    appearance: none;

    &:focus {
      outline: none;
    }

    &:hover {
      text-decoration: none;
    }

    &:disabled, &.isDisabled, &.isLoading {
      opacity: 0.65;
    }

    &:disabled, &.isDisabled {
      cursor: not-allowed;
    }

    &.isLoading {
      cursor: wait;
    }

    @each $color, $value in $colors {
      &.isStyle#{capitalize($color)} {
        color: map-get($value, 'text');
        background: map-get($value, 'color');

        &:hover:not(:disabled), &:hover:not(.isDisabled) {
          background: map-get($value, 'color-hover');
        }

        &:active:not(:disabled), &:active:not(.isDisabled) {
          background: darken(map-get($value, 'color-hover'), 10%);
        }

        &.isOutline {
          color: map-get($value, 'color');
          border: 1px solid map-get($value, 'color');

          &:hover:not(:disabled), &:hover:not(.isDisabled) {
            background-color: map-get($value, 'color');
            border: 1px solid map-get($value, 'color');
          }

          &:active:not(:disabled), &:active:not(.isDisabled) {
            background-color: darken(map-get($value, 'color'), 15%);
          }
        }

        &.isText {
          &:hover:not(:disabled), &:hover:not(.isDisabled) {
            color: map-get($value, 'color');
            border-bottom-color: map-get($value, 'color');
          }

          &:active:not(:disabled), &:active:not(.isDisabled) {
            color: darken(map-get($value, 'color'), 10%);
          }
        }

        &.isTextUnderline {
          color: map-get($value, 'color');

          &:hover:not(:disabled), &:hover:not(.isDisabled) {
            color: map-get($value, 'color-hover');
          }

          &:active:not(:disabled), &:active:not(.isDisabled) {
            color: darken(map-get($value, 'color'), 10%);
          }
        }
      }
    }

    &.isStyleField {
      max-width: none;
      height: 55px;
      padding: 0 1rem;
      margin-right: -22px;
      margin-left: -22px;
      font-size: 1rem;
      color: #1D293F;
      letter-spacing: 0.1rem;
      background: #FFF;
      border: 1px solid #B1BACA;
      border-radius: 0;

      &:hover:not(:disabled), &:hover:not(.isDisabled) {
        color: $color-primary;
        border-color: #7484A1;
      }

      &:active:not(:disabled), &:active:not(.isDisabled) {
        color: lighten($color-primary, 10%);
      }
    }

    &.isText {
      padding: 0;
      font-size: inherit;
      color: inherit;
      letter-spacing: inherit;
      background: transparent;
      border-color: transparent;

      &:hover:not(:disabled), &:hover:not(.isDisabled) {
        background: transparent;
        // border-color: transparent !important;
        border-bottom: 1px solid $color-gray-7;
      }

      &:active:not(:disabled), &:active:not(.isDisabled) {
        background: transparent;
        // border-color: transparent !important;
        border-bottom: 1px solid $color-gray-7;
      }
    }

    &.isTextUnderline {
      padding: 0;
      font-size: inherit;
      color: inherit;
      text-decoration: underline;
      letter-spacing: inherit;
      background: transparent;
      border-color: transparent;

      &:hover:not(:disabled), &:hover:not(.isDisabled) {
        background: transparent;
        border-color: transparent !important;
      }

      &:active:not(:disabled), &:active:not(.isDisabled) {
        background: transparent;
        border-color: transparent !important;
      }
    }

    &.isRadius {
      border-radius: 5px;
    }

    &.isFillet {
      border-radius: 9527px;
    }

    &.isAuto {
      width: auto;
    }

    &.isFull {
      width: 100%;
    }

    &.isSmall {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    @for $i from 1 through 12 {
      &.isCol#{$i} {
        width: #{(($container - ($container-gap * 2)) - (((12 / $i) - 1)) * ($container-gap * 2)) / (12 / $i)};
      }
      &.isCol1 {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
      }
    }

    &.isOutline {
      background: #FFF;

      &:hover:not(:disabled), &:hover:not(.isDisabled) {
        color: #FFF;
      }
    }

    &.isCircle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      padding: 0 0 0 4px;
      border: unset;
      border-radius: 100%;

      &.isSmall {
        width: 34px;
        height: 34px;
      }
    }

    &.isLoading {
      position: relative;
      pointer-events: none;

      .baseButton__content {
        opacity: 0;
      }

      &::after {
        position: absolute;
        top: calc(50% - .6em);
        left: calc(50% - .6em);
        display: block;
        width: 1.2em;
        height: 1.2em;
        content: "";
        border: 2.5px solid;
        border-top-color: transparent;
        border-right-color: transparent;
        border-radius: 290486px;
        animation: spinAround 0.6s infinite linear;
      }
    }
  }

  @keyframes spinAround {
    0% {
      transform: rotate(0turn);
    }
    100% {
      transform: rotate(1turn);
    }
  }
</style>
