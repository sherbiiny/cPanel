<template>
  <main class="Shop">
    <v-card class="shop-card" :class="shop.booked ? 'pinkish' : 'blueish'">

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
        </div>
        
      </div>

      <div class="group">

        <div class="field">
          <div class="label">المساحة</div>
          <div class="value">{{ shop.area }}</div>
        </div>

        <div class="field">
          <div class="label">مميز</div>
          <div class="value" v-if="shop.premium">نعم</div>
          <div class="value" v-if="!shop.premium">لا</div>
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
      </div>

    </v-card>
  </main>
</template>

<script>
import db from '../firebase'
import $ from 'jquery'

export default {
  data() {
    return {
      shop: {},
      shop_id: null
    }
  },

  mounted() {
    this.shop_id = this.$route.params.shop_id
    db.collection('shops').doc(this.shop_id).get()
      .then(res => {
        this.shop = res.data()
        this.shop.id = this.shop_id
      })
  },
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
    }

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

.roboto {
  font-family: 'Roboto';
}
</style>
