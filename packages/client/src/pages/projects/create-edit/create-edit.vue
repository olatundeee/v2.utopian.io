<script>
import { Notify } from 'quasar'
import { mapActions } from 'vuex'
import { minLength, required, requiredUnless, url } from 'vuelidate/lib/validators'
import { LicencesMixin } from 'src/mixins/licences'
import UFileUploader from 'src/components/project/file-uploader/file-uploader'

export default {
  name: 'u-page-projects-create-edit',
  mixins: [LicencesMixin],
  components: {
    UFileUploader
  },
  data () {
    return {
      formPercentage: 0,
      project: {
        name: '',
        closedSource: false,
        platforms: {
          github: {
            repository: ''
          }
        },
        website: '',
        docs: '',
        license: '',
        images: [],
        description: '',
        tags: []
      }
    }
  },
  validations: {
    project: {
      name: {required},
      platforms: {
        github: {
          repository: {
            required: requiredUnless(function () { return this.project.closedSource })
          }
        }
      },
      website: {url},
      docs: {url},
      license: {required},
      images: {
        /*
        required,
        minLength: minLength(1)
        */
      },
      description: {required},
      tags: {
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    ...mapActions({
      searchGithubRepository: 'github/searchGithubRepository'
    }),
    ...mapActions({
      saveProject: 'projects/saveProject'
    }),
    searchGithubRepositoryWrapper (query, done) {
      this.searchGithubRepository(query).then(done)
    },
    handleImageUpload (uploadUrl) {
      this.updateFormPercentage('images')
      this.project.images = [uploadUrl]
    },
    updateFormPercentage (field) {
      this.$v.project[field].$touch()
      const fields = Object.keys(this.$v.project.$params)
      const completed = fields.reduce((count, key) => {
        console.log(key, this.project[key] !== '')
        return this.project[key] !== '' && !(this.$v.project[key].$invalid || this.$v.project[key].$error) ? count + 1 : count
      }, 0)
      this.formPercentage = Math.round(completed / fields.length * 100)
    },
    async submit () {
      this.$v.project.$touch()
      if (this.$v.project.$error) {
        return
      }
      if (this.project.platforms.github.repository && !this.isAllowed) {
        Notify.create({
          type: 'negative',
          position: 'bottom-right',
          message: 'You must be the owner of the GitHub project.'
        })
        return
      }

      await this.saveProject(this.project)
    }
  }
}
</script>

<style lang="stylus" src="./create-edit.styl"></style>
<template lang="pug" src="./create-edit.pug"></template>
