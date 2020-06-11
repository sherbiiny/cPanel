<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
.v-application {
  font-family: 'Cairo', "Roboto" !important;
  background: #f9f9f9 !important;
  
  .v-btn, .btn {
    letter-spacing: 0 !important;
  }
}  
</style>
