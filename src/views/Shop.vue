<template>
  <main class="Shop">
    <v-card class="shop-card" :class="shop.booked ? 'pinkish' : 'blueish'">

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

      <v-btn
        absolute
        dark
        fab
        bottom
        elevation="1"
        left
        class="pink"
        @dblclick="deleteShop()"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <h1>{{ shop.id }}</h1>

      <span v-if="shop.booked" class="booked unavailable">غير متاحة</span>
      <span v-if="!shop.booked" class="booked available">متاحة</span>

      <div class="group">
        <div class="field">
          <div class="label">رقم المحل</div>
          <div class="value">{{ shop.sNum }}</div>
        </div>

        <div class="field">
          <div class="label">البلوك</div>
          <div class="value roboto">{{ shop.block }}</div>
        </div>

        <div class="field">
          <div class="label">الدور</div>
          <div class="value" v-if="shop.floor == 1">الدور الأرضي</div>
          <div class="value" v-if="shop.floor == 2">الدور الأول</div>
          <div class="value" v-if="shop.floor == 3">الدور الثاني</div>
          <div class="value" v-if="shop.floor == 4">الدور الثالث</div>
          <div class="value" v-if="shop.floor == 5">الدور الرابع</div>
          <div class="value" v-if="shop.floor == 6">الدور الخامس</div>
        </div>
        
      </div>

      <div class="group">

        <div class="field">
          <div class="label">المساحة</div>
          <div class="value">{{ shop.area }}</div>
        </div>

        <div class="field">
          <div class="label">مميز</div>
          <div class="value" v-if="shop.premium == 'premium'">نعم</div>
          <div class="value" v-if="shop.premium == 'halfPremium'">نصف مميز</div>
          <div class="value" v-if="shop.premium == 'notPremium'">غير مميز</div>
        </div>

      </div>

      <div class="group">

        <div class="field">
          <div class="label">المقدم</div>
          <div class="value">{{ shop.invest }}</div>
        </div>

        <div class="field">
          <div class="label">السعر الإجمالي</div>
          <div class="value">{{ shop.totalPrice }}</div>
        </div>

        <div class="field">
          <div class="label">سعر المتر</div>
          <div class="value">{{ shop.meterPrice }}</div>
        </div>
  
      </div>

      <div class="group">
        

        <div class="field">
          <div class="label">القسط الشهري</div>
          <div class="value">{{ ( shop.totalPrice - ( shop.first + shop.invest ) ) / 60 }}</div>
        </div>
        
        <div class="field">
          <div class="label">المتبقي</div>
          <div class="value">{{ shop.totalPrice - ( shop.first + shop.invest ) }}</div>
        </div>

        <div class="field">
          <div class="label">دفعة بعد 6 اشهر</div>
          <div class="value">{{ shop.first }}</div>
        </div>

      </div>

      <div class="btn-group">
        <v-btn router :to="{name: 'ShopsList'}">عودة الي البحث</v-btn>
        <v-btn v-if="!shop.booked" router :to="{name: 'ClientInput', params:{shop_id}}">احجز الان</v-btn>
        <v-btn v-if="shop.owner" router :to="{name: 'Client', params:{client_id: shop.owner}}">بيانات العميل</v-btn>
      </div>

    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="mx-auto bold my-5 headline"> ( {{ shop.id }} ) تعديل محل</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form @submit="edit()">
              <v-text-field outlined label="المساحة" v-model="area"></v-text-field>
              <v-select :items="selectItems" outlined label="مميز" v-model="premium"></v-select>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="text-center card-actions">
          <v-btn color="red" text @click="dialog = false">الغاء</v-btn>
          <v-btn color="warning" @click="edit()">تعديل</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="success" v-model="snackbar">تم تعديل المحل بنجاح</v-snackbar>
  </main>
</template>

<script>
import db from '../firebase'
import $ from 'jquery'

export default {
  data() {
    return {
      shop: {},
      shop_id: null,

      // Dialog
      dialog: false,
      area: null,
      premium: null,
      floor: null,
      meterPrice: null,
      totalPrice: null,
      invest: null,
      first: null,

      // Select items
      selectItems: [
        {text: 'مميز', value: 'premium'},
        {text: 'غير مميز', value: 'notPremium'},
        {text: 'نصف مميز', value: 'halfPremium'}
      ],
      snackbar: false
    }
  },

  mounted() {
    this.shop_id = this.$route.params.shop_id
    this.getShopData()
  },

  methods: {

    getShopData() {
      db.collection('shops').doc(this.shop_id).get()
        .then(res => {

          // Get shop data
          this.shop = res.data()
          this.shop.id = this.shop_id

          // Set some data
          this.area = this.shop.area
          this.premium = this.shop.premium
          this.totalPrice = this.shop.totalPrice
          this.meterPrice = this.shop.meterPrice
          this.first = this.shop.first
          this.invest = this.shop.invest
          this.floor = this.shop.floor
        })
    },

    deleteShop() {
      db.collection('shops').doc(this.shop_id).delete() 
        .then(() => this.$router.push({name: 'ShopsList'}))
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

    edit() {

      // Calculate meter price
      this.calcMeterPrice()

      // Calculate total price
      this.totalPrice = this.meterPrice * this.area

      // Calculate invest
      if(this.premium == 'premium') this.invest = .15 * this.totalPrice
      else this.invest = .1 * this.totalPrice

      // Calculate first
      this.first = 0.1 * this.totalPrice

      db.collection('shops').doc(this.shop_id).update({
        area: this.area,
        premium: this.premium,
        invest: this.invest,
        first: this.first,
        totalPrice: this.totalPrice,
        meterPrice: this.meterPrice,

      }) 
        .then(() => {
          this.snackbar = true
          this.dialog = false
          this.getShopData()
        })
    }

  }
}
</script>

<style lang="scss">
$green: #28a745;
$red: crimson;
$blue: #27496d;

.Shop {
  padding: 100px 250px;

  .shop-card {
    padding: 20px 50px;

    &.pinkish {
      border: 1px solid $red;
      box-shadow: 2px 2px 5px rgba($color: $red, $alpha: .5);

      .value {
        color: $blue
      }
    }

    &.blueish {
      box-shadow: 2px 2px 5px rgba($color: $green, $alpha: .5);
      border: 2px solid $green;

      .value {
        color: $blue;
      }
    }

    h1 {
      text-align: center;
      letter-spacing: 10px;
      font-family: 'Roboto';
      margin-top: 50px;
      color: $blue !important;
    }

    .group {
      display: flex;
    }

    .field {
      margin: 30px 0;
      padding: 10px;
      border: 1px solid #999;
      text-align: center;
      flex-grow: 1;
      margin-bottom: 0;
      font-size: 1.2em;

      .label {
        color: $blue;
        font-weight: bold;
      }

      .value {
        font-weight: bold;
      }

    }
    .booked {
      display: block;
      margin: 30px auto;
      margin-bottom: 0;
      padding: 5px 10px;
      max-width: 180px;
      text-align: center;
      border-radius: 5px !important;
      font-size: 1.5em;
      font-weight: bold;
      
      &.available {
        border: 3px solid $green;
        color: $green;
      }

      &.unavailable {
        border: 3px solid $red;
        color: $red;
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
          background: $red !important;
        }

        &:nth-child(2) {
          background: $green !important;
        }
      }
    }

  }
}

.roboto {
  font-family: 'Roboto';
}
</style>
