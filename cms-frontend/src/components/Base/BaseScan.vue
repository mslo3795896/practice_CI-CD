<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import formatDate from '@utils/format-date'

const errorMessageMap = {
  NotAllowedError: '請允許 zerone 存取您的相機',
  NotFoundError: '此裝置無相機',
  NotSupportedError: '此頁面非安全瀏覽（如：HTTPS、localhost 或 file://）',
  NotReadableError: '無法存取您的相機。相機是否正在使用中？',
  OverconstrainedError: '您裝置的相機無法使用',
  StreamApiNotSupportedError: '掃描憑證不支援此瀏覽器',
};

const initDecodeData = () => {
  return {
    decodeResult: '',
    codeInfo: '',
    codeCanCheckIn: false,
    codeInvalidMessage: '',
  }
};

export default {
  name: 'BaseScan',
  components: {
    QrcodeStream,
  },
  filters: {
    formatDate,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cameraStatus: 'auto', // auto 自動；rear 後鏡頭；front 前鏡頭；off 關閉
      cameraErrorMessage: '',
      cameraVisible: false,
      cameraLoading: false,
      ...initDecodeData(),

      tryingCheckIn: false,
      tryingNoShow: false,
    }
  },
  computed: {
    isMobile() {
      return /Mobi/.test(navigator.userAgent)
    },
  },
  watch: {
    visible(value) {
      if(value) {
        /* const devTest = () => {
          this.$router.push({
            name: 'quick-checkin',
            params: {
              qrcodeId: 'qrcodeId'
            }
          });

          this.closeCamera();
        };

        devTest(); */

        this.openCamera()
      }
    }
  },
  methods: {
    onClose() {
      this.closeCamera();
      this.$emit('update:visible', false)
    },
    async onInit(promise) {
      this.cameraLoading = true;

      try {
        await promise
      } catch (error) {
        this.cameraErrorMessage = errorMessageMap[error.name] || `未預期的錯誤：${error}`
      } finally {
        this.cameraLoading = false
      }
    },
    async onDecode(codeId) {
      if(codeId) {
        this.closeCamera();
        this.$emit('scanned', codeId)
        this.handleContinue()
      }
    },
    closeCamera() {
      this.cameraStatus = 'off'
    },
    openCamera() {
      this.cameraStatus = 'auto'
    },
    handleContinue() {
      this.resetDecodeData()
      this.cameraVisible = true
      this.closeCamera()
      setTimeout(()=>{
        this.openCamera()
      }, 300)
    },
    resetDecodeData() {
      Object.assign(this.$data, initDecodeData())
    },
  },
}
</script>

<template>
  <el-dialog
    title="掃描QRcode"
    :visible="visible"
    :fullscreen="isMobile"
    top="0"
    append-to-body
    :class="$style.baseScan"
    @close="onClose"
  >
    <div>
      <div
        v-loading="tryingCheckIn"
        class="mb-5"
      >
        <QrcodeStream
          v-loading="cameraLoading"
          :class="$style.camera"
          :camera="cameraStatus"
          class="camera"
          @init="onInit"
          @decode="onDecode"
        />
        <p v-if="cameraErrorMessage">{{ cameraErrorMessage }}</p>
      </div>
      <BaseButton
        class="isStyleDark isOutline isRadius isFull"
        @click="onClose"
      >
        關閉視窗
      </BaseButton>
    </div>
  </el-dialog>
</template>

<style lang="scss" module>
  .baseScan {
    :global {
      .baseScan {
        @include unstyled;
      }
    }
  }

  .camera {
    height: 60vh !important;
    margin-top: 20px;
    @include max-md {
      margin-left: -20px;
      margin-right: -20px;
      width: auto !important;
    }
  }
</style>
