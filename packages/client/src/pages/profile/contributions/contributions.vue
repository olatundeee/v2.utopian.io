<script>
import moment from 'moment'
import UContributionList from 'src/components/contribution-list/contribution-list'
import ULayoutPage from 'src/layouts/parts/page/page'
import { categories, categoryOptions } from 'src/services/utopian/categories'
import { format } from 'quasar'
import { get } from 'lodash'

const { capitalize } = format

export default {
  name: 'PageProfileContributions',
  components: {
    UContributionList,
    ULayoutPage
  },

  props: {
    project: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isMounted: false,
      loading: false,
      category: '',
      author: ''
    }
  },
  filters: {
    timeAgo (isoDateString) {
      return moment.utc(isoDateString).fromNow()
    }
  },
  methods: {
    triggerCategoryRoute (newVal, event) {
      this.$nextTick(() => {
        this.$refs.categoryList.$el.blur()
        this.$router.push({ name: 'profile.contributions', params: { category: this.category, author: this.author } })
      })
    }
  },
  mounted () {
    this.category = get(this.$route, 'params.category', 'all')
    this.author = get(this.$route, 'params.username', '')
    this.isMounted = true
  },
  computed: {
    categories () {
      return categories
    },
    categoryOptions () {
      return [{ label: 'All categories', value: 'all' }].concat(
        categoryOptions.map(category => ({ ...category, label: capitalize(category.label) }))
      )
    }
  }
}
</script>

<style lang="stylus" src="./contributions.styl"></style>

<template lang="pug" src="./contributions.pug"></template>
