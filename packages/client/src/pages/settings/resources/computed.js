// imports.
import langmap from 'langmap'
import * as _ from 'lodash'

// component computed properties.
export default {

  // compute languages.
  languages () {
    // map the enabled locales and retrieve then from langMap.
    return _.map(this.enabledLocales, (key) => {
      // get the language file.
      const lang = _.find(langmap, (v, k) => (k.toLowerCase() === key))
      // return a formatted object.
      return {
        // with the lower case locale name.
        value: key.toLowerCase(),
        // with the native locale name (local name instead of english name).
        label: _.get(lang, 'nativeName')
      }
    })
  }

}
