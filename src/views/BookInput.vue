<template>
  <main class="ViewerInput">
    <v-form autocomplete="off" class="form" @submit.prevent="submit()">
      <v-container>
        <h1>اضافة حجز</h1>
        <!-- Fields -->
        <v-text-field outlined v-model="clientName" label="الإسم الرباعي"></v-text-field>
        <v-text-field outlined v-model="cardNum" label="رقم البطاقة"></v-text-field>
        <v-text-field outlined v-model="phone" label="رقم التليفون"></v-text-field>
        <v-text-field outlined v-model="shopId" label="رقم المحل"></v-text-field>
        <div class="d-flex">
          <v-text-field outlined v-model="meterPrice" label="سعر المتر"></v-text-field>
          <v-text-field outlined v-model="totalPrice" label="اجمالي المحل"></v-text-field>
        </div>
        <v-text-field outlined v-model="paid" label="قيمة الحجز"></v-text-field>
        <v-menu
          ref="bookingMenu"
          v-model="bookingMenu"
          :close-on-content-click="false"
          :return-value.sync="bookingDate"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field v-model="bookingDate" label="تاريخ الحجز" readonly v-on="on" outlined></v-text-field>
          </template>
          <v-date-picker v-model="bookingDate" @input="bookingMenu = false, $refs.bookingMenu.save(bookingDate)"></v-date-picker>
        </v-menu>
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
            <v-text-field v-model="date" label="تاريخ التعاقد" readonly v-on="on" outlined></v-text-field>
          </template>
          <v-date-picker v-model="date" @input="menu = false, $refs.menu.save(date)"></v-date-picker>
        </v-menu>
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
import db from "../firebase"
import $ from "jquery"
import store from '../store/index'


export default {
  data() {
    return {
      // Variables relted to database
      clientName: null,
      cardNum: null,
      phone: null,
      notes: null,
      notesArr: null,
      shopId: null,
      date: null,
      meterPrice: null,
      totalPrice: null,
      paid: null,
      bookingMenu: false,
      bookingDate: null,

      // Other variables
      feedback: null,
      snackbar: false,
      loading: false,
      menu: false
    };
  },

  watch: {

    shopId: {
      handler(val) {
        if(val) {
          this.shopId = val.toUpperCase();
          this.getShopInfo(val)
        }
      }
    },

    notes: { handler(val) {store.state.dealWithNotes(val)} }

  },

  methods: {
    setData(id) {
      db.collection("booking")
        .doc(id)
        .set({
          clientName: this.clientName,
          phone: this.phone,
          notes: this.notes,
          shopId: this.shopId,
          cardNum: this.cardNum,
          paid: this.paid,
          date: this.date,
          bookingDate: this.bookingDate,
          meterPrice: this.meterPrice,
          totalPrice: this.totalPrice
        })
        .then(() => {
          // Set shop as booked
          if (this.shopId)
            db.collection("shops")
              .doc(this.shopId)
              .update({ booked: true });

          this.snackbar = true;
          this.resetForm();
          this.loading = false;
        })
        .catch(err => console.log(err));
    },

    // Set data to firebase
    submit() {
      this.loading = true;
      this.setData(this.cardNum);
    },

    resetForm() {
      this.clientName = null
      this.cardNum = null
      this.phone = null
      this.notes = null
      this.shopId = null
      this.date = null
      this.totalPrice = null
      this.meterPrice = null
    },

    getShopInfo(val) {
      if(val) {
        db.collection("shops")
          .doc(val)
          .get()
          .then(res => {
            if(res.data()) {
              this.totalPrice = res.data().totalPrice;
              this.meterPrice = res.data().meterPrice;
            }
          });
      }
    }
  },

};
</script>

<style lang="scss">
@import "../assets/styles/input";

.ViewerInput {
  h1 {
    margin-bottom: 30px;
  }
}
</style>