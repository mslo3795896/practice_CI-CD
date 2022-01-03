import { message as Message } from 'ant-design-vue';
export default function message(params) {
  Message[params?.type || 'info']({
    top: '210px',
    duration: 3,
    ...formatParams(params)
  });
}

export function messageError(params) {
  message({
    ...formatParams(params),
    type: 'error'
  })
}

export function messageSuccess(params) {
  message({
    ...formatParams(params),
    type: 'success'
  })
}

export function messageWarning(params) {
  message({
    ...formatParams(params),
    type: 'warning'
  })
}

export function messageInfo(params) {
  message({
    ...formatParams(params),
    type: 'info'
  })
}

function formatParams(params) {
  if(typeof params === 'string') {
    return { message: params }
  } else if(!!params.title || !!params.content) {
    return {
      ...params,
      dangerouslyUseHTMLString: true,
      message: `<span class="el-message__title">${ params.title }</span><br><span class="el-message__content">${ params.content }</span>`
    }
  } else {
    return { ...params }
  }
}
