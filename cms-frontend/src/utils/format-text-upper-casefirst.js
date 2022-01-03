export default function formatTextUpperCasefirst(str) {
  const strarr = str.split(' ');
  let result = '';

  for(let i in strarr) {
    if(strarr.hasOwnProperty(i)) {
      result = `${ strarr[i].substring(0, 1)
        .toUpperCase() }${ strarr[i].substring(1) }`;
    }
  }

  return result;
}
