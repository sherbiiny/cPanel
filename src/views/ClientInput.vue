<template>
  <main class="clientInput">
    <v-form autocomplete="off" class="form" @submit.prevent="submit()">
      <v-container>
        <h1>اضافة عميل جديد</h1>
        <!-- Fields -->
        <v-text-field v-model="clientName" outlined label="الإسم الرباعي"></v-text-field>
        <div class="group">
          <v-text-field v-model="cardNum" type="number" outlined :rules="cardNumRules" label="رقم البطاقة"></v-text-field>
          <v-text-field v-model="phone" type="number" outlined label="رقم التليفون"></v-text-field>
        </div>
        <v-text-field v-model="shopId" outlined label="رقم المحل"></v-text-field>  
        <div class="group">
          <v-text-field v-model="totalPrice" outlined label="المبلغ الكلي للمحل" readonly></v-text-field>
          <v-text-field v-model="invest" outlined label="المقدم" readonly></v-text-field>
          <v-text-field v-model="first" outlined label="دفعة بعد 6 اشهر" readonly></v-text-field>
        </div>
        <div class="group">
          <v-text-field v-model="shopInstall" outlined label="قسط المحل" readonly></v-text-field>
          <v-text-field v-model="install" outlined label="القسط"></v-text-field>
          <v-text-field v-model="finalInstall" readonly outlined label="القسط الفعلي"></v-text-field>
        </div>
        <div class="group">
          <v-select outlined :items="installSystemItems" v-model="installSystem"></v-select>
          <v-text-field outlined maxlength='10' v-model="firstDate" label="تاريخ دفعة بعد 6 اشهر"></v-text-field>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field v-model="date" label="تاريخ الحجز" readonly v-on="on" outlined></v-text-field>
            </template>
            <v-date-picker v-model="date">
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </div>
        <v-textarea label="ملاحظات" outlined v-model="notes"></v-textarea>
        <p v-if="feedback" class="feedback text-center">{{ feedback }}</p>
        <v-btn type="submit">تسجيل</v-btn>
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
import store from '../store/index'

export default {
  data() {
    return {
      // Variables related to database
      cardNum: null,
      clientName: null,
      phone: null,
      shopId: null,
      totalPrice: null,
      invest: null,
      first: null,
      date: null,
      firstDate: null,
      left: null,
      install: null,
      shopInstall: null,
      installSystem: 1,
      finalInstall: null,
      notes: null,
      notesArr: [],

      // Other variables
      feedback: null,
      snackbar: false,
      menu: false,

      // Card number rules
      cardNumRules: [
        v => (v && v.length == 14) || "رقم البطاقة غير صحيح",
      ],

      // Select items
      installSystemItems: [
        {text: 'شهري', value: 1},
        {text: 'كل 3 اشهر', value: 3}
      ]
    }
  },

  watch: {

    shopId: {
      handler(val) {
        this.shopId = val.toUpperCase()
        this.getShopInfo()
      },
    },

    install: {
      handler(val) {
        if(val) this.finalInstall = val * this.installSystem
      }
    },

    notes: {handler(val) {store.state.dealWithNotes(val)}},

    installSystem: {
      handler(val) {
        if(this.install) this.finalInstall = this.install * val
      }
    },

    date: {
      handler(val) {
        if(val) {
          this.firstDate = this.addMonths(new Date(val.substring(0, 4), val.substring(5, 7), val.substring(8, 10)), 5).toISOString()
          this.firstDate = this.firstDate.toString().substring(0, 10)
        }
      }
    },

    firstDate: {
      handler(val) {
        this.firstDate = val.substring(0, 10)
      }
    }
  },

  mounted() {
    if (this.$route.params.shop_id) this.shopId = this.$route.params.shop_id
  },

  methods: {

    setData() {
      db.collection('clients').doc(this.cardNum).set({
        cardNum: this.cardNum,
        clientName: this.clientName,
        phone: this.phone,
        shopId: this.shopId,
        date: this.date,
        totalPrice: this.totalPrice,
        install: this.finalInstall,
        installSystem: this.installSystem,
        firstDate: this.firstDate,
        notes: this.notesArr

      })
        .then(() => {
          this.snackbar = true
        })
        .catch(err => console.log(err))
    },

    // Set data to firebase
    submit() {

      // Set Client Data
      db.collection('clients').doc(this.cardNum).get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) this.feedback = "هذا العميل موجود بالفعل"
          else this.setData()
      })

      // Set the shop as booked
      store.state.setShopAsBooked(this.shopId, this.cardNum)

      // Redirect to client page
      this.$router.push({name: 'ClientsList'})
      
    },

    addMonths(date, months) {
      let d = date.getDate();
      date.setMonth(date.getMonth() + +months);
      if (date.getDate() != d) {
        date.setDate(0);
      }
      return date;
    },

    getShopInfo() {
      // Get shop data
      if(this.shopId) {
        db.collection('shops').doc(this.shopId).get()
          .then(res => {
            this.totalPrice = res.data().totalPrice
            this.invest = res.data().invest
            this.first = res.data().first
            if(this.totalPrice && this.invest && this.first) this.left  = this.totalPrice - (this.invest + this.first)
            this.shopInstall = this.left / 60
          })
      }
    },
  },
}
</script>

<style lang="scss">
@import '../assets/styles/input';

.clientInput {
  .form {
    width: 800px;
  }
  .group {
    display: flex;
  }
}
</style>