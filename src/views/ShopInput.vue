<template>
  <main class="shopInput">
    <v-form autocomplete="off" class="form" @submit.prevent="submit">
      <v-container>
        <h1>اضافة محل جديد</h1>
        <!-- Fields -->
        <v-select :items="floorItems" outlined label="الدور" v-model="floor"></v-select>
        <v-text-field v-model="block" outlined class="block-input" required maxlength="1" label="البلوك"></v-text-field>
        <v-text-field v-model="sNum" class="sNum" outlined label="رقم المحل"></v-text-field>
        <v-text-field v-model="area" outlined label="مساحة المحل"></v-text-field>
        <v-text-field v-model="meterPrice" outlined readonly label="سعر المتر"></v-text-field>
        <!-- <v-select outlined :items="bookedItems" v-model="booked"></v-select> -->
        <v-select outlined :items="premiumItems" v-model="premium"></v-select>
        <p v-if="feedback" outlined class="feedback text-center">{{ feedback }}</p>
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
      floor: 6,
      block: null,
      area: null,
      meterPrice: null,
      invest: null,
      totalPrice: null,
      booked: false,
      premium: 'notPremium',
      first: null,
      
      // Variables relted to select element
      floorItems: [
        {text: "الدور الأرضي", value: 1},
        {text: "الدور الأول", value: 2},
        {text: "الدور الثاني", value: 3},
        {text: "الدور الثالث", value: 4},
        {text: "الدور الرابع", value: 5},
        {text: "الدور الخامس", value: 6}
      ],

      bookedItems: [
        {text: "متاحة للبيع", value: false},
        {text: "غير متاحة للبيع", value: true},
      ],

      premiumItems: [
        {text: "مميز", value: 'premium'},
        {text: "عادي", value: 'notPremium'},
        {text: "نصف مميز", value: 'halfPremium'}
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
          $('.sNum input').focus()
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
      } else {
        this.feedback = 'يرجي ادخال جميع البيانات المطلوبة'
        this.loading = false
      }

    },

    calcMeterPrice() {
      switch(`${this.floor}-${this.premium}`) {
        // Ground floor
        case '1-premium' :
          this.meterPrice = 6000
          break;

        case '1-notPremium' :
          this.meterPrice = 5500
          break;

        // First floor
        case '2-premium' :
          this.meterPrice = 5500
          break;

        case '2-notPremium' :
          this.meterPrice = 5200
          break;

        // Second floor
        case '3-premium':
          this.meterPrice = 5000
          break;

        case '3-halfPremium':
          this.meterPrice = 4500
          break;

        case '3-notPremium':
          this.meterPrice = 4000
          break;

        // Third floor
        case '4-premium':
          this.meterPrice = 5200
          break;

        case '4-halfPremium':
          this.meterPrice = 5100
          break;

        case '4-notPremium':
          this.meterPrice = 5000
          break;


        // Fourth floor
        case '5-premium':
          this.meterPrice = 5200
          break;

        case '5-halfPremium':
          this.meterPrice = 5100
          break;

        case '5-notPremium':
          this.meterPrice = 5000
          break;

        // Fifth floor
        case '6-premium':
          this.meterPrice = 5200
          break;

        case '6-halfPremium':
          this.meterPrice = 5100
          break;

        case '6-notPremium':
          this.meterPrice = 5000
          break;
      }
    },

    resetForm() {
      this.sNum = null
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