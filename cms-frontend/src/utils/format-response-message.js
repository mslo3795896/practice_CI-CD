import i18n from '@src/lang';

export default function formatErrorMessage(errorStatus) {
  return i18n.tm(`error.${ errorStatus }`) || errorStatus
}

export function formatSuccessMessage(successStatus) {
  return i18n.tm(`success.${ successStatus }`) || successStatus
}

export function formatInvalidInputMessage(errorData) {
  const errorField = Object.keys(errorData)
    .map(errorKey => {

      const key = i18n.tm(`field.${ errorKey.toUpperCase() }`);
      const value = errorData[errorKey]
        .join(',')
        .replace(errorKey, '')
        .replace(/ /g, '_')
        .replace(/__/g, '_')
        .replace('.', '')
        .toUpperCase();

      return `${ key }: ${ i18n.tm(`field.${ value }`, { field: key }) }`
    });

  return errorField.join('\n')
}
