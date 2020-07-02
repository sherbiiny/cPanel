<template>
  <main class="Booking">
    <v-container>

      <!-- Client Card -->
      <v-card class="client-card" v-if="client">
        <v-btn
          absolute
          elevation="1"
          fab
          top
          right
          color="warning"
          @click="dialog = true"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <h1>{{ client.clientName }}</h1>

        <div class="field" v-if="client.phone">
          <div class="label">رقم التليفون</div>
          <div class="value">{{client.phone}}</div>
        </div>

        <div class="field" v-if="client.cardNum">
          <div class="label">رقم البطاقة</div>
          <div class="value">{{client.cardNum}}</div>
        </div>

        <div class="field" v-if="client.paid">
          <div class="label">قيمة الحجز</div>
          <div class="value">{{client.paid}}</div>
        </div>

        <div class="field" v-if="client.date">
          <div class="label">تاريخ الحجز</div>
          <div class="value">{{client.date}}</div>
        </div>

        <div class="field" v-if="client.shopId">
          <div class="label">رقم المحل</div>
          <div class="value">{{client.shopId}}</div>
        </div>
        
        <div class="field" v-if="client.meterPrice">
          <div class="label">سعر المتر</div>
          <div class="value">{{client.meterPrice}}</div>
        </div>
        
        <div class="field" v-if="client.totalPrice">
          <div class="label">اجمالي المحل</div>
          <div class="value">{{client.totalPrice}}</div>
        </div>
        
        

        <div class="field" v-if="client.notes">
          <div class="label">ملاحظات</div>
          <div class="value">{{client.notes}}</div>
        </div>
        
        <div class="btn-group">
          <v-btn router :to="{name: 'ClientsList'}">قائمة العملاء</v-btn>
          <v-btn v-if="client.shopId" router :to="{name: 'Shop', params: {shop_id: client.shopId}}">عرض المحل</v-btn>
        </div>
        <v-btn class="deleter" @click="deleteClient()">حذف العميل</v-btn>
      </v-card>

      <!-- Edit Dialog -->
      <v-dialog v-model="dialog" width="700px">
        <v-form autocomplete="off" class="form ma-0" @submit.prevent>
          <v-container>
            <h1>تعديل بيانات الحجز</h1>
            <!-- Fields -->
            <v-text-field outlined v-model="clientName" label="الإسم الرباعي"></v-text-field>
            <v-text-field outlined v-model="phone" label="رقم التليفون"></v-text-field>
            <v-text-field outlined v-model="shopId" label="رقم المحل"></v-text-field>
            <div class="d-flex">
              <v-text-field outlined v-model="meterPrice" label="سعر المتر"></v-text-field>
              <v-text-field outlined v-model="totalPrice" label="اجمالي المحل"></v-text-field>
            </div>
            <v-text-field outlined v-model="paid" label="قيمة الحجز"></v-text-field>
            <!-- <v-menu
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
            </v-menu> -->
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
            <v-btn :loading="loading" color="warning" class="d-block mx-auto bold" large @click="editBooking()">تعديل</v-btn>
          </v-container>
        </v-form>
      </v-dialog>
    </v-container>

    <v-snackbar v-model="snackbar">
      تم تسجيل العميل بنجاح
      <v-btn text color="primary" @click.native="snackbar = false">اغلاق</v-btn>
    </v-snackbar>
  </main>
</template>

<script>
import db from '../firebase'
import store from '../store/index'

export default {

  data() {
    return {
      shop: null,
      client: null,

      // Edit vars
      dialog: false,
      clientName: null,
      phone: null,
      shopId: null,
      paid: null,
      meterPrice: null,
      totalPrice: null,
      notes: null,
      notesArr: [],
      date: null,
      bookingDate: null,
      menu: false,
      bookingMenu: false,
      loading: false,
      snackbar: false
    }
  },

  watch: {

    shopId: {
      handler(val) {
        if(val) {
          this.shopId = val.toUpperCase()
          this.getShopInfo(val)
        }
      }
    },

    notes: { handler(val) {store.state.dealWithNotes(val)} }
  },

  mounted() {
    this.getClientData()
  },

  methods: {

    getClientData() {
      db.collection('booking').doc(this.$route.params.client_id).get()
        .then(res => {
          this.client = res.data()
          console.log(this.client)
          this.clientName = this.client.clientName
          this.phone = this.client.phone
          this.shopId = this.client.shopId
          this.meterPrice = this.client.meterPrice
          this.paid = this.client.paid
          this.totalPrice = this.client.totalPrice
          this.notes = this.client.notes
          this.date = this.client.date
          this.bookingDate = this.client.bookingDate
        })
    },

    deleteClient() {
      if(this.client.shopId) {
        db.collection('shops').doc(this.client.shopId).get()
          .then(doc => {
            if(doc.exists) {
              db.collection('shops').doc(this.client.shopId).update({booked: false})
                .then(() => {
                  db.collection('booking').doc(this.client.cardNum).delete()
                  this.$router.push({name: 'ClientsList'})
                })
                .then(() => console.log('deleted'))
            } else {
                db.collection('booking').doc(this.client.cardNum).delete()
                this.$router.push({name: 'ClientsList'})
            }
          })
      }
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
          })
          .catch(() => false)
      }
    },

    editBooking() {
      this.loading = true
      db.collection('booking').doc(this.$route.params.client_id).update({
        clientName: this.clientName,
        phone: this.phone,
        shopId: this.shopId,
        paid: this.paid,
        meterPrice: this.meterPrice,
        totalPrice: this.totalPrice,
        notesArr: this.notesArr,
        date: this.date,
        // bookingDate: this.bookingDate
      })
      .then(() => {
        this.getClientData()
        this.loading = false
        this.dialog = false
        store.state.setShopAsNotBooked(client.shopId)
        store.state.setShopAsBooked(this.shopId, this.cardNum)
      })
    }
  }
}
</script>

<style lang="scss">
$green: #28a745;
$red: crimson;
$blue: #27496d;

.Booking {
    padding: 20px 5px;

  .client-card {
    padding: 20px 50px;
    width: 800px;
    margin: auto;

    h1 {
      text-align: center;
      font-family: 'Cairo';
      margin-top: 50px;
      color: $blue !important;
    }

    .group {
      display: flex;
    }

    .field {
      margin: 20px 0;
      padding: 10px;
      border: 1px solid #999;
      text-align: center;
      flex-grow: 1;
      margin-bottom: 0;
      font-size: 1.2em;

      .label {
        color: $blue;
        margin-bottom: 5px;
        font-weight: bold;
      }

      .value {
        color: $blue;
        font-weight: bold;
      }

    }

    .btn-group {
      display: flex;
      max-width: 500px;
      margin: 50px auto 10px;

      .v-btn {
        color: #FFF;
        margin: 30px auto;
        width: 200px ;
        font-size: 1.2em;
        height: 60px;
        font-weight: bold;

        &:nth-child(1) {
          background: $green !important;
        }

        &:nth-child(2) {
          background: $green !important;
        }
      }
    }

    .deleter {
      background: $red !important;
      display: block;
      color: #FFF;
      margin: 30px auto;
      width: 200px ;
      font-size: 1.2em;
      height: 60px;
      font-weight: bold;
    }

  }
}
</style>