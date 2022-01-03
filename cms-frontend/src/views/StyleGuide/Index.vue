<script>
  export default {
    data() {
      return {
        buttonText: '<span class="baseButton__text">按鈕</span> <i class="fad fa-meat baseButton__icon"></i>',
        buttonCircleText: '<i class="fad fa-meat baseButton__icon"></i>',
        textColorList: [
          'primary',
          'primary-dark',
          '',
          '',
          '',
          '',
          'success',
          'warning',
          'danger',
          'info',
          'complete',
          'gray-1',
          'gray-2',
          'gray-3',
          'gray-4',
          'gray-5',
          'gray-6',
          'gray-7',
        ],
        textFamilyList: [
          {
            family: 'Noto Sans TC',
            class: 'sans',
          },
          {
            family: 'Noto TC',
            class: 'serif',
          },
          {
            family: 'Inter',
            class: 'inter',
          },
        ],
        textSizeList: [
          '7xl',
          '6xl',
          '5xl',
          '4xl',
          '3xl',
          '2xl',
          'xl',
          'lg',
          'base',
          'sm'
        ],
        buttonColorList: [
          'primary',
          'primaryDark',
          'primary',
        ]
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
  }
</script>
<template>
  <div class="container" :class="$style.styleGuide">
    <!--COLOR-->
    <section class="styleGuide__section">
      <h2 class="styleGuide__title">
        <span class="styleGuide__titleText">
            COLOR
        </span>
      </h2>
      <div
        :class="$style.styleGuideSection"
        class="row my-4"
      >
        <div
          v-for="color in textColorList"
          class="col-2"
          :class="{'mb-3': color}"
        >
          <template v-if="color">
            <h6 class="styleGuideSection__title">{{ toUpperCasefirst(color) }}</h6>
            <div :class="`styleGuideSection__colorBlock bg-${color}`"></div>
          </template>
        </div>
      </div>
    </section>

    <!--TEXT-->
    <section class="styleGuide__section">
      <h2 class="styleGuide__title">
        <span class="styleGuide__titleText">
          TEXT
        </span>
      </h2>
      <div
        :class="$style.styleGuideSection"
        class="row my-4"
      >
        <template v-for="n in 6">
          <div class="col-md-2">
            <component :is="`h${n}`">
              h{{ n }}
            </component>
          </div>
          <div class="col-md-10 mb-3">
            <component :is="`h${n}`">
              測試 123 TEST Aa
            </component>
          </div>
        </template>
        <div class="col-md-2">
          <p>
            p
          </p>
        </div>
        <div class="col-md-10 mb-3">
          <p>
            p 測試 123 TEST Aa
          </p>
        </div>
      </div>
      <div
        v-for="familyItem in textFamilyList"
        :class="[$style.styleGuideSection, `row my-4 font-${familyItem.class}`]"
      >
        <template v-for="size in textSizeList">
          <div class="col-md-2">
            <span :class="`fs-${size}`">
                {{ size }}
            </span>
          </div>
          <div class="col-md-10 mb-3">
            <span :class="`fs-${size}`">
              {{ familyItem.family }} 測試 123 Aa
            </span>
          </div>
        </template>
      </div>
    </section>

    <!--BUTTON-->
    <section class="styleGuide__section">
      <h2 class="styleGuide__title">
        <span class="styleGuide__titleText">
          BUTTON
        </span>
      </h2>

      <!--Small-->
      <div class="row my-4">
        <div
          v-for="color in buttonColorList"
          class="col-6 col-md-4 mb-3"
        >
          <h6 class="title">{{ toUpperCasefirst(color) }} Small</h6>
          <button :class="`baseButton isStyle${toUpperCasefirst(color)} isSmall`">
            <span v-html="buttonText"></span>
          </button>
        </div>
      </div>

      <!--Outline-->
      <div class="row my-4">
        <div
          v-for="color in buttonColorList"
          class="col-6 col-md-4 mb-3"
        >
          <h6 class="title">{{ toUpperCasefirst(color) }} Small Outline</h6>
          <button :class="`baseButton isStyle${toUpperCasefirst(color)} isSmall isOutline`">
            <span v-html="buttonText"></span>
          </button>
        </div>
      </div>

      <div class="row my-4">
        <div
          v-for="color in buttonColorList"
          class="col-6 col-md-4 mb-3"
        >
          <h6 class="title">{{ toUpperCasefirst(color) }}</h6>
          <button :class="`baseButton isStyle${toUpperCasefirst(color)}`">
            <span v-html="buttonText"></span>
          </button>
        </div>
      </div>

      <!--Big-->
      <div class="row my-4">
        <div
          v-for="color in buttonColorList"
          class="col-6 col-md-4 mb-3"
        >
          <h6 class="title">{{ toUpperCasefirst(color) }} Big</h6>
          <button :class="`baseButton isStyle${toUpperCasefirst(color)} isBig`">
            <span v-html="buttonText"></span>
          </button>
        </div>
      </div>

      <!--Radius-->
      <div class="row my-4">
        <div
          v-for="color in buttonColorList"
          class="col-6 col-md-4 mb-3"
        >
          <h6 class="title">{{ toUpperCasefirst(color) }} Full Radius</h6>
          <button :class="`baseButton isStyle${toUpperCasefirst(color)} isFull isRadius`">
            <span v-html="buttonText"></span>
          </button>
        </div>
      </div>

      <!--Col-->
      <div class="row my-4">
        <template v-for="n in 6">
          <div :class="`col-md-${12 - n} mb-3`">
            <h6 class="title">Primary Col{{ 12 - n }}</h6>
            <button :class="`baseButton isStylePrimary isCol${12 - n}`">
              <span v-html="buttonText"></span>
            </button>
          </div>

          <div
            :class="`col-md-${n} mb-3`"
          >
            <h6
              v-if="n !== 1"
              class="title"
            >
              Primary Col{{ n }}
            </h6>
            <h6
              v-else
              class="title"
            >
              Col1
            </h6>
            <button :class="`baseButton isStylePrimary isCol${n}`">
              <span
                v-if="n !== 1"
                v-html="buttonText"
              ></span>
              <span v-else>&ensp;</span>
            </button>
          </div>
        </template>
      </div>

      <!--fs-->
      <div class="row my-4">
        <div
          v-for="color in buttonColorList"
          class="col-6 col-md-4 mb-3"
        >
          <h6 class="title">{{ toUpperCasefirst(color) }} Text</h6>
          <button :class="`baseButton isStyle${toUpperCasefirst(color)} isText`">
            <span v-html="buttonText"></span>
          </button>
        </div>
      </div>

      <!--TextUnderline-->
      <div class="row my-4">
        <div
          v-for="color in buttonColorList"
          class="col-6 col-md-4 mb-3"
        >
          <h6 class="title">{{ toUpperCasefirst(color) }} TextUnderline</h6>
          <button :class="`baseButton isStyle${toUpperCasefirst(color)} isTextUnderline`">
            <span v-html="buttonText"></span>
          </button>
        </div>
      </div>

      <!--Circle Small-->
      <div class="row my-4">
        <div
          v-for="color in buttonColorList"
          class="col-6 col-md-4 mb-3"
        >
          <h6 class="title">{{ toUpperCasefirst(color) }} Circle Small</h6>
          <button :class="`baseButton isStyle${toUpperCasefirst(color)} isCircle isSmall`">
            <span v-html="buttonCircleText"></span>
          </button>
        </div>
      </div>

      <!--Circle Small Outline-->
      <div class="row my-4">
        <div
          v-for="color in buttonColorList"
          class="col-6 col-md-4 mb-3"
        >
          <h6 class="title">{{ toUpperCasefirst(color) }} Circle Small Outline</h6>
          <button :class="`baseButton isStyle${toUpperCasefirst(color)} isCircle isSmall isOutline`">
            <span v-html="buttonCircleText"></span>
          </button>
        </div>
      </div>

      <!--Circle-->
      <div class="row my-4">
        <div
          v-for="color in buttonColorList"
          class="col-6 col-md-4 mb-3"
        >
          <h6 class="title">{{ toUpperCasefirst(color) }} Circle</h6>
          <button :class="`baseButton isStyle${toUpperCasefirst(color)} isCircle`">
            <span v-html="buttonCircleText"></span>
          </button>
        </div>
      </div>

      <!--Circle Big-->
      <div class="row my-4">
        <div
          v-for="color in buttonColorList"
          class="col-6 col-md-4 mb-3"
        >
          <h6 class="title">{{ toUpperCasefirst(color) }} Circle Big</h6>
          <button :class="`baseButton isStyle${toUpperCasefirst(color)} isCircle isBig`">
            <span v-html="buttonCircleText"></span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
<style lang="scss" module>
  .styleGuide {
    background: #F1F1F1;

    :global {
      .styleGuide {
        &__title {
          position: sticky;
          top: 0;
          z-index: 1;
          padding: 1rem 0;
          margin-right: 0;
          margin-left: 0;
          font-weight: 600;
          background: #F1F1F1;
          border-bottom: 6px solid #000;
        }

        &__section {
          padding: 2rem 0;
        }
      }

    }
  }

  .styleGuideSection {
    :global {
      .styleGuideSection {
        &__colorBlock {
          position: relative;
          width: 50%;
          padding-top: 50%;
          margin: 2.5rem 0;
          cursor: pointer;
          border: 1px solid #FFF;
          border-top-left-radius: 0;
          box-shadow: 0 0 0 4px #F1F1F1, 0 0 0 5px rgba(0, 0, 0, 0.5);
          transition: border-radius 0.2s ease-in;
          transform: rotate(45deg) translate(25px, -20px);
          transform-origin: center;

          &::before {
            position: absolute;
            top: -6px;
            left: -6px;
            width: 0;
            height: 0;
            content: '';
            border: 2px solid rgba(0, 0, 0, 0.3);
            border-bottom-color: transparent !important;
            border-left-color: transparent !important;
            opacity: 0;
            transition: opacity 0.3s, width 0s 0.3s, height 0s 0.3s;
          }

          &::after {
            position: absolute;
            right: -6px;
            bottom: -6px;
            width: 0;
            height: 0;
            content: '';
            border: 2px solid rgba(0, 0, 0, 0.3);
            border-top-color: transparent !important;
            border-right-color: transparent !important;
            opacity: 0;
            transition: opacity 0.3s, width 0s 0.3s, height 0s 0.3s;
          }

          &:active {
            &::before, &::after {
              border-color: #000;
              transition: width 0s, height 0s;
            }
          }

          &:hover {
            &::before, &::after {
              width: calc(100% + 12px);
              height: calc(100% + 12px);
              opacity: 1;
              transition: width 0.3s, height 0.3s 0.3s;
            }
          }
        }

        &__title {
          font-size: 14px;
          letter-spacing: 0.05em;
        }

        &__iconBlock {
          // cursor: pointer;
          width: 63%;
          padding-top: 63%;
          margin: 17% 25% 25% 17%;
          border: 1px solid #FFF;
          transition: transform 0.6s ease;
          transform: rotate(45deg);

          &::before {
            position: absolute;
            top: -6px;
            right: -6px;
            bottom: -6px;
            left: -6px;
            content: '';
            border: 1px solid rgba(0, 0, 0, 0.5);
          }

          &:hover {
            transform: rotate(225deg);

            .iconBlock {
              &__content {
                transform: translate(-50%, -50%) rotate(-225deg);
              }
            }
          }

          &__content {
            position: absolute;
            top: 50%;
            left: 50%;
            display: block;
            transition: transform 0.6s ease;
            transform: translate(-50%, -50%) rotate(-45deg);

            .title {
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
</style>
