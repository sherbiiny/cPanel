<template>
  <main class="Nums" autocomplete='off'>
    <v-text-field v-model="value" autocomplete='off' outlined label="اكتب الرقم"></v-text-field>
    <h3 class="pa-2">{{ value }}</h3>
  </main>
</template>

<script>
import store from '../store/index'

export default {
  data() {
    return {
      value: null
    }
  },

  watch: {
    value: {
      handler(val) {
        this.value = store.state.convertNumToEng(val)
      }
    }
  },
}
</script>

<style lang="scss">
.Nums {
  padding: 100px
}
</style>