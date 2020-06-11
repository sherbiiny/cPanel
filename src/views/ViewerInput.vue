<template>
  <main class="ViewerInput">
    <v-form autocomplete="off" class="form" @submit.prevent="submit()">
      <v-container>
        <h1>اضافة عميل استفساري</h1>
        <!-- Fields -->
        <v-text-field outlined v-model="clientName" label="الإسم الرباعي"></v-text-field>
        <v-text-field outlined v-model="phone" label="رقم التليفون"></v-text-field>
        <v-text-field outlined v-model="reason" label="سبب الزيارة"></v-text-field>
        <v-text-field outlined v-model="shopId" label="رقم المحل"></v-text-field>
        <v-textarea outlined v-model="notes" label="ملاحظات"></v-textarea>
        <p v-if="feedback" class="feedback text-center">{{ feedback }}</p>
        <v-btn type="submit" :loading="loading">تسجيل</v-btn>
        <v-icon large @click="$router.push({name: 'Home'})">fa-arrow-circle-left</v-icon>
      </v-container>
    </v-form>
    <v-snackbar v-model="snackbar">
      تم تسجيل العميل بنجاح
      <v-btn text color="primary" @click.native="snackbar = false">اغلاق</v-btn>
    </v-snackbar>
  </main>
</template>

<script>
import db from '../firebase'
import $ from 'jquery'

export default {
  data() {
    return {
      // Variables relted to database
      clientName: null,
      phone: null,
      reason: null,
      notes: null,
      shopId: null,

      // Other variables
      feedback: null,
      snackbar: false,
      loading: false
    }
  },

  watch: {
    shopId: {
      handler(val) {
        this.shopId = val.toUpperCase()
      },
    },
  },

  methods: {

    setData(id) {

      db.collection('viewers').doc(id).set({
        clientName: this.clientName,
        phone: this.phone,
        notes: this.notes,
        reason: this.reason,
        shopId: this.shopId
      })
        .then(() => {
          // Set shop as booked
          if(this.shopId) db.collection('shops').doc(this.shopId).update({booked: true})

          this.snackbar = true
          this.resetForm()
          this.loading = false

        })
        .catch(err => console.log(err))
    },

    // Set data to firebase
    submit() {
      this.loading = true
      this.setData(this.phone)
    },

    resetForm() {
      this.clientName = null,
      this.phone = null,
      this.reason = null,
      this.notes = null,
      this.shopId = null
    },
  },
}
</script>

<style lang="scss">
@import '../assets/styles/input';

.ViewerInput {

  h1 {
    margin-bottom: 30px;
  }
}
</style>