<template>
  <main class="shopInput">
    <v-form autocomplete="off" class="form" @submit.prevent="submit">
      <v-container>
        <h1>اضافة محل جديد</h1>
        <!-- Fields -->
        <v-select :items="floorItems" outlined label="الدور" v-model="floor"></v-select>
        <v-text-field v-model="block" outlined clearable class="block-input" required maxlength="1" label="البلوك"></v-text-field>
        <v-text-field v-model="sNum" outlined clearable label="رقم المحل"></v-text-field>
        <v-text-field v-model="area" outlined clearable label="مساحة المحل"></v-text-field>
        <v-text-field v-model="meterPrice" outlined clearable readonly label="سعر المتر"></v-text-field>
        <!-- <v-select outlined :items="bookedItems" v-model="booked"></v-select> -->
        <v-select outlined :items="premiumItems" v-model="premium"></v-select>
        <p v-if="feedback" outlined clearable class="feedback text-center">{{ feedback }}</p>
        <v-btn type="submit" :loading="loading">تسجيل</v-btn>
        <v-icon large @click="$router.push({name: 'Home'})">fa fa-arrow-circle-left</v-icon>
      </v-container>
    </v-form>
    <v-snackbar v-model="snackbar">
      تمت اضافة المحل بنجاح
      <v-btn text color="primary" @click.native="value = false">اغلاق</v-btn>
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
      sNum: null,
      floor: 1,
      block: null,
      area: null,
      meterPrice: null,
      invest: null,
      totalPrice: null,
      booked: false,
      premium: false,
      first: null,
      
      // Variables relted to select element
      floorItems: [
        {text: "الدور الأرضي", value: 1},
        {text: "الدور الأول", value: 2},
        {text: "الدور الثاني", value: 3},
      ],

      bookedItems: [
        {text: "متاحة للبيع", value: false},
        {text: "غير متاحة للبيع", value: true},
      ],

      premiumItems: [
        {text: "عادية", value: false},
        {text: "مميزة", value: true},
      ],

      // Other variables
      feedback: null,
      snackbar: false,
      loading: false
    }
  },

  mounted() {
    setInterval(this.calcMeterPrice, 100)
  },

  methods: {

    setData(id) {
      db.collection('shops').doc(id).set({
        sNum: this.sNum,
        floor: this.floor,
        block: this.block.toUpperCase(),
        area: this.area,
        invest: this.invest,
        booked: this.booked,
        premium: this.premium,
        meterPrice: this.meterPrice,
        totalPrice: this.totalPrice,
        first: this.first
      })
        .then(() => {
          this.snackbar = true
          this.loading = false
          this.feedback = null
          this.resetForm()
        })
        .catch(err => console.log(err)  )
    },

    // Set data to firebase
    submit() {
      this.loading = true
      let id = `${this.floor}${this.block.toUpperCase()}-${this.sNum}`

      // Calculate meter price
      this.calcMeterPrice()

      // Calculate total price
      this.totalPrice = this.meterPrice * this.area

      // Calculate invest
      if(this.premium) this.invest = .15 * this.totalPrice
      else this.invest = .1 * this.totalPrice

      // Calculate first
      this.first = 0.1 * this.totalPrice

      if(this.sNum && this.floor && this.block && this.area) {
        db.collection('shops').doc(id).get()
          .then((docSnapshot) => {
            if (docSnapshot.exists) {
              this.feedback = "هذا المحل تمت اضافته من قبل"
              this.loading = false
            }
  
            else this.setData(id)
        }) 
      } else this.feedback = 'يرجي ادخال جميع البيانات المطلوبة'

    },

    calcMeterPrice() {
      switch(`${this.floor}-${this.premium}`) {
        case '1-true' :
          this.meterPrice = 6000
          break;

        case '1-false' :
          this.meterPrice = 5500
          break;

        case '2-true' :
          this.meterPrice = 5500
          break;

        case '2-false' :
          this.meterPrice = 5200
          break;

        case '3-true' :
          this.meterPrice = 5200
          break;

        case '3-false' :
          this.meterPrice = 5000
          break;
      }
    },

    resetForm() {
      this.sNum = null
      this.block = null
      this.area = null
      this.meterPrice = null
      this.totalPrice = null
    }
  },
}
</script>

<style lang="scss">
@import '../assets/styles/input';

.block-input input{
  text-transform: uppercase !important;
  font-weight: 700;
}

.fa-arrow-circle-left {
  color: crimson !important;
  transform: rotate(180deg);
}
</style>