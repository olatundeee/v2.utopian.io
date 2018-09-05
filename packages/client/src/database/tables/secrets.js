// imports.
import { secrets } from 'src/database'
import * as _ from 'lodash'

// all secrets.
export const all = () => secrets.toArray()

// find a secret by key.
export const find = (name) => secrets.get({ name }).then(record => _.get(record, 'value', null))

// save a secret under a key.
export const save = (name, value = {}) => secrets.put({ name, value }).then(() => find(name))

// find or save a secret.
export const findOrSave = async (name, fallback = null) => (find(name) || save(name, fallback))
