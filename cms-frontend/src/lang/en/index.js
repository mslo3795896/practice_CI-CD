// const files = require.context('./', false, /[A-Za-z0-9-_,\s]+\.json$/i);
const files = import.meta.globEager('./*.json');
const locales = {};

for (const path in files) {
  const matched = path.match(/([A-Za-z0-9-_]+)\./i)
  if(matched && matched.length > 1) {
    const fileName = matched[1]
    locales[fileName] = files[path]
  }
}

/* files.keys()
  .forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if(matched && matched.length > 1) {
      const file_name = matched[1]
      locales[file_name] = files(key)
    }
  }) */

export default locales;
