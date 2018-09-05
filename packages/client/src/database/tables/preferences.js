// imports.
import { preferences } from 'src/database'
import * as _ from 'lodash'

// all preferences.
export const all = () => preferences.toArray()

// find a given preference value.
export const find = (name) => preferences.get({ name }).then(record => _.get(record, 'value', null))

// save a given preference..
export const save = (name, value = {}) => preferences.put({ name, value }).then(() => find(name))

// find or save a preference.
export const findOrSave = async (name, fallback = null) => (find(name) || save(name, fallback))
