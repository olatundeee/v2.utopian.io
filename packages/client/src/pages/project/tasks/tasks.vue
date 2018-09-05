<script>
import { byOrder } from 'src/services/steem/posts'
import moment from 'moment'
import UPostPreview from 'src/components/post-preview/post-preview'
import ULayoutPage from 'src/layouts/parts/page/page'
import { categories, categoryOptions } from 'src/services/utopian/categories'
import * as _ from 'lodash'

export default {
  name: 'PageProjectTasks',
  components: {
    UPostPreview,
    ULayoutPage
  },
  data () {
    return {
      sortBy: 'trending',
      sortOptions: [
        { label: 'Trending', value: 'trending' },
        { label: 'New', value: 'new' }
      ],
      loading: false,
      category: 'utopian-io',
      posts: [],
      search: ''
    }
  },
  filters: {
    timeAgo (isoDateString) {
      return moment.utc(isoDateString).fromNow()
    }
  },
  methods: {
    loadInitial () {
      this.loading = true
      return this.loadPosts().then((result) => {
        this.loading = false
        return result
      })
    },
    loadPostsScroll: _.debounce(function (index, done) {
      return this.loadPosts(done)
    }, 3000),
    loadPosts (done) {
      const order = _.get(this.$route, 'meta.order', 'trending')
      const tag = _.get(this.$route, 'params.category', 'utopian-io')
      return byOrder(order, { tag, limit: 40 }, _.last(this.posts))
        .then((result) => {
          this.posts = _.concat(this.posts, result)
          if (result.length < 40) {
            _.attempt(done)
            this.$refs.infiniteScroll.stop()
          } else {
            _.attempt(done)
          }
          return result
        })
    }
  },
  computed: {
    categories () {
      return categories
    },
    categoryOptions () {
      return _.map(categoryOptions, (option) => {
        option.label = option.label.toUpperCase()
        return option
      })
    },
    currentCategory () {
      return _.get(this.$route, 'params.category', null)
    },
    visiblePosts () {
      return _.filter(this.posts, (post) => ((post['parent_permlink'] === 'utopian-io')))
    }
  },
  mounted () {
    this.sortBy = _.get(this.$route, 'meta.order', 'trending')
    this.category = _.get(this.$route, 'params.category', 'utopian-io')

    this.loadInitial()
    return true
  },
  watch: {
    currentCategory () {
      this.loadInitial()
    }
  }
}
</script>

<style lang="stylus" src="./tasks.styl"></style>

<template lang="pug" src="./tasks.pug"></template>
