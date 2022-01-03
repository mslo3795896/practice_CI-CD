// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'


// https://webpack.js.org/guides/dependency-management/#require-context
/* const requireComponent = require.context(
  // Look for files in the current directory
  './Base',
  // Do not look in subdirectories
  true,
  // Only include "_base-" prefixed .vue files
  /Base[\w-]+\.vue$/
); */

const requireComponent = import.meta.globEager('./Base/Base*.vue');

export default function register(app) {
  for (const path in requireComponent) {
    const componentName = upperFirst(
      camelCase(
        path
          // Remove the "./Base/" from the beginning
          .replace(/^\.\/Base\//, '')
          // Remove the file extension from the end
          .replace(/\.\w+$/, '')
          .replace(/^.\/input/, '')
          .replace(/^.\/dialog/, '')
      )
    );
    // Globally register the component
    app.component(componentName, requireComponent[path].default || requireComponent[path])
  }
}


/* // For each matching file name...
requireComponent.keys()
  .forEach((fileName) => {
    // Get the component config
    const componentConfig = requireComponent(fileName);
    // Get the PascalCase version of the component name
    const componentName = upperFirst(
      camelCase(
        fileName
          // Remove the "./_" from the beginning
          .replace(/^\.\/_/, '')
          // Remove the file extension from the end
          .replace(/\.\w+$/, '')
          .replace(/^.\/input/, '')
          .replace(/^.\/dialog/, '')
      )
    );
    // Globally register the component
    Vue.component(componentName, componentConfig.default || componentConfig)
  }); */

