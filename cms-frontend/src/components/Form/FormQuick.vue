<script>
  import formMixin from "./mixins/form";
  import { eventCategoryOptions, getOption } from "@utils/zerone-options";

  const DEFAULT_SUBMIT_DATA = {
    categoryAlias: 'activity',
    eventId: '',
    eventDateId: '',
    eventSessionId: ''
  };

  export default {
    mixins: [formMixin],
    props: {
      value: {
        type: Object,
        default: () => {
          return { ...DEFAULT_SUBMIT_DATA }
        },
      },
    },
    data() {
      return {
        showPassword: false,
        eventCategoryOptions: eventCategoryOptions(),
        eventIdOptions: [],
        eventDateIdOptions: [],
        eventSessionIdOptions: []
      }
    },
    created() {
      this.tryToFetchEventList();
    },
    methods: {
      onSubmit() {
        this.$emit('open-scan')
      },
      goToQuickSession() {
        this.$router.push({
          name: 'quick-session',
          params: {
            sessionId: this.FormMixSubmitData.eventSessionId
          }
        })
      },
      onChangeCategoryAlias() {
        this.tryToFetchEventList();
      },
      onChangeEventId() {
        this.tryToFetchEventDateList();
      },
      onChangeEventDateId() {
        this.tryToFetchEventDateSessionList();
      },
      tryToFetchEventList({ storeParams, autoComplete = true } = {}) {
        this.$store.dispatch('order/fetchEventList', {
          ...this.FormMixSubmitData,
          ...storeParams
        })
          .then((response) => {
            const setEventIdOptions = () => {
              this.eventIdOptions = [];
              this.eventDateIdOptions = [];
              this.eventSessionIdOptions = [];

              this.eventIdOptions = response.items.map(item => {
                return {
                  ...item,
                  text: item.title,
                  value: item.id
                }
              })
            };

            const autoCompleteEventId = () => {
              if(autoComplete) {
                this.FormMixSubmitData.eventId = '';
                this.FormMixSubmitData.eventDateId = '';
                this.FormMixSubmitData.eventSessionId = '';

                // this.eventIdOptions = [];
                // this.eventDateIdOptions = [];
                // this.eventSessionIdOptions = [];

                if(this.eventIdOptions && this.eventIdOptions[0]) {
                  this.FormMixSubmitData.eventId = this.eventIdOptions[0].value;

                  this.onChangeEventId();
                }
              }
            };

            setEventIdOptions();
            autoCompleteEventId();
            this.resetObserver();
          })
      },
      tryToFetchEventDateList() {
        this.$store.dispatch('order/fetchEventDateList', {
          ...this.FormMixSubmitData,
        })
          .then((response) => {
            const setEventDateIdOptions = () => {
              this.eventDateIdOptions = [];
              this.eventSessionIdOptions = [];

              this.eventDateIdOptions = response.items.map(item => {
                return {
                  text: item.date,
                  value: item.id
                }
              })
            };

            const autoCompleteEventSessionId = () => {
              this.FormMixSubmitData.eventDateId = '';
              this.FormMixSubmitData.eventSessionId = '';

              // this.eventDateIdOptions = [];
              // this.eventSessionIdOptions = [];

              if(this.eventDateIdOptions && this.eventDateIdOptions[0]) {
                this.FormMixSubmitData.eventDateId = this.eventDateIdOptions[0].value;

                this.onChangeEventDateId();
              }
            };

            setEventDateIdOptions();
            autoCompleteEventSessionId();
            this.resetObserver();
          })
      },
      tryToFetchEventDateSessionList() {
        const eventItem = getOption({
          options: this.eventIdOptions,
          value: this.FormMixSubmitData.eventId,
          key: 'id',
          type: 'item'
        });

        this.$store.dispatch('order/fetchEventDateSessionList', {
          ...this.FormMixSubmitData,
          event: eventItem?.registrationType === 'impartial'
        })
          .then((response) => {
            const setEventDateIdOptions = () => {
              this.eventSessionIdOptions = [];

              this.eventSessionIdOptions = (response.items?.sessions || [])
                .filter(item => {
                  return item.canRegistration
                })
                .map(item => {
                  const removeSerialNumber = (str) => str.replace(/\(\d+\)$/, '')
                  return {
                    text: removeSerialNumber(item.title),
                    value: item.id
                  }
                })
            };

            const autoCompleteEventSessionId = () => {
              this.FormMixSubmitData.eventSessionId = '';

              // this.eventSessionIdOptions = [];

              if(this.eventSessionIdOptions && this.eventSessionIdOptions[0]) {
                this.FormMixSubmitData.eventSessionId = this.eventSessionIdOptions[0].value;
              }
            };

            setEventDateIdOptions();
            autoCompleteEventSessionId();
            this.resetObserver();
          })
      },
      onRemoteMethodEventId(search) {
        this.tryToFetchEventList({
          storeParams: {
            search
          },
          autoComplete: false
        });
      },
      onVisibleChangeEventId(visible) {
        if(visible) {
          this.tryToFetchEventList({
            autoComplete: false
          });
        }
      },
      resetObserver() {
        this.$refs.observer.reset();
      }
    }
  }
</script>
<template>
  <div>
    <ValidationObserver ref="observer" v-slot="{ invalid, handleSubmit }">
      <el-form
        ref="form"
        :model="FormMixSubmitData"
        label-position="top"
        class="isStyleBase"
        :class="$style.formQuick"
        @submit.prevent.native="handleSubmit(onSubmit)"
      >
        <!--類別-->
        <ValidationProvider
          v-slot="{ errors }"
          rules="require"
          name="類別"
        >
          <el-form-item :error="errors[0]" prop="categoryAlias" label="類別" class="isRequired">
            <el-select
              v-model="FormMixSubmitData.categoryAlias"
              placeholder="請選擇類別"
              class="w-full"
              @change="onChangeCategoryAlias"
            >
              <el-option
                v-for="(option, index) in eventCategoryOptions"
                :key="`eventCategoryOptions-${index}`"
                :label="option.text"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="require"
          name="名稱"
        >
          <el-form-item :error="errors[0]" prop="eventId" label="名稱" class="isRequired">
            <el-select
              v-model="FormMixSubmitData.eventId"
              :placeholder="!FormMixSubmitData.categoryAlias ? '請先選擇類別' : '請選擇名稱'"
              filterable
              remote
              :remote-method="onRemoteMethodEventId"
              :loading="$isLoading('fetchEventList')"
              class="w-full"
              @change="onChangeEventId"
              @visibleChange="onVisibleChangeEventId"
            >
              <el-option
                v-for="(option, index) in eventIdOptions"
                :key="`eventIdOptions-${index}`"
                :label="option.text"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="require"
          name="日期"
        >
          <el-form-item :error="errors[0]" prop="eventDateId" label="日期" class="isRequired">
            <el-select
              v-model="FormMixSubmitData.eventDateId"
              :placeholder="!FormMixSubmitData.eventId ? '請先選擇名稱' : '請選擇日期'"
              class="w-full"
              @change="onChangeEventDateId"
            >
              <el-option
                v-for="(option, index) in eventDateIdOptions"
                :key="`eventDateIdOptions-${index}`"
                :label="option.text"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="require"
          name="場次"
        >
          <el-form-item :error="errors[0]" prop="eventSessionId" label="場次" class="isRequired">
            <el-select
              v-model="FormMixSubmitData.eventSessionId"
              :placeholder="!FormMixSubmitData.eventDateId ? '請先選擇日期' : '請選擇場次'"
              class="w-full"
            >
              <el-option
                v-for="(option, index) in eventSessionIdOptions"
                :key="`eventSessionIdOptions-${index}`"
                :label="option.text"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </ValidationProvider>
        <div class="row mt-5">
          <div class="col-6">
            <BaseButton
              :disabled="invalid"
              class="isStylePrimary isOutline isRadius isFull"
              @click="goToQuickSession"
            >
              名單報到
            </BaseButton>
          </div>
          <div class="col-6">
            <BaseButton
              type="submit"
              :disabled="invalid"
              class="isStylePrimary isOutline isRadius isFull"
            >
              QRcode報到
            </BaseButton>
          </div>
        </div>
      </el-form>
    </ValidationObserver>
  </div>
</template>
<style lang="scss" module>
  .formQuick {
    :global {
      .formQuick {
        @include unstyled;
      }
    }
  }
</style>
