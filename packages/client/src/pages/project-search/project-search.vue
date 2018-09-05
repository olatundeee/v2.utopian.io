<!-- component script. -->
<script>
// imports.
import moment from 'moment'
import * as _ from 'lodash'
import UPostPreview from 'src/components/post-preview/post-preview'
import ULayoutPage from 'src/layouts/parts/page/page'
import { categories, categoryOptions } from 'src/services/utopian/categories'
import firebase from 'firebase/app'

// default component export.
export default {
  // component name.
  name: 'u-page-project-search',

  // child components.
  components: {
    UPostPreview,
    ULayoutPage
  },

  // component data.
  data () {
    return {
      // page sort.
      sortBy: 'trending',
      // page sort options.
      sortOptions: [
        { label: 'Trending', value: 'trending' },
        { label: 'New', value: 'new' }
      ],
      // loading state indicator.
      loading: false,
      // currently selected category.
      category: 'utopian-io',

      projects: [],
      // current search.
      search: '',
      openSource: true
    }
  },

  // component local filters.
  // @TODO this should be done at content parsing state, not rendering.
  filters: {
    timeAgo (isoDateString) {
      return moment.utc(isoDateString).fromNow()
    }
  },

  // component methods.
  methods: {

    // initial content loading.
    loadInitial () {
      // start loading as true.
      this.loading = true
      // call teh load posts method.
      return this.loadProjects().then((result) => {
        // disable the loading indicator
        this.loading = false
        // return the results to complete the promise.
        return result
      })
    },

    // debounced post loading (paginated).
    loadProjectsScroll: _.debounce(function (index, done) {
      return this.loadProjects(done)
    }, 3000),

    // load posts main method.
    async loadProjects (done) {
      const listProjects = firebase.functions().httpsCallable(`api/projects/list?q=${this.search}&openSource=${this.opensource}`)
      this.projects = (await listProjects()).data
      if (this.projects.length < 10) {
        _.attempt(done)
        this.$refs.infiniteScroll.stop()
      } else {
        _.attempt(done)
      }
    },
    getProjectImage (project) {
      return project.images && project.images.length > 0 ? project.images[0] : 'statics/img/fallback.jpg'
    },
    async searchProjects (ev) {
      if (ev.keyCode === 13) {
        this.loading = true
        const listProjects = firebase.functions().httpsCallable(`api/projects/list?q=${this.search}&opensource=${this.openSource}`)
        this.projects = (await listProjects()).data
        this.loading = false
      }
    },
    goToProjectPage (name) {
      return this.$router.push({ name: 'project.details', params: { name } })
    }
  },

  // computed properties.
  computed: {

    // compute available categories (alias).
    categories () {
      return categories
    },

    // map the categories into a selectable array.
    categoryOptions () {
      return _.map(categoryOptions, (option) => {
        // @TODO upper case should be handler at CSS level, not runtime transformations.
        option.label = option.label.toUpperCase()
        return option
      })
    },

    // currently selected category filter.
    currentCategory () {
      return _.get(this.$route, 'params.category', null)
    },

    // filter utopian-only posts.
    visiblePosts () {
      return _.filter(this.posts, (post) => ((post['parent_permlink'] === 'utopian-io')))
    }
  },

  // mounted hook.
  mounted () {
    // start sort and category from route, defaulting to trending, all categories.
    this.sortBy = _.get(this.$route, 'meta.order', 'trending')
    this.category = _.get(this.$route, 'params.category', 'utopian-io')

    // load initial content.
    this.loadInitial()

    // just return something to be polite.
    return true
  },

  // watchers.
  watch: {

    // reload the data as the category changes.
    currentCategory () {
      this.loadInitial()
    }
  }
}
</script>

<!-- component style. -->
<style lang="stylus" src="./project-search.styl"></style>

<!-- component template. -->
<template lang="pug" src="./project-search.pug"></template>
