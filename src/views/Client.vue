<template>
  <main class="Client">
    <v-container>
      <v-card class="client-card" v-if="client">
        <h1>{{ client.clientName }}</h1>
        <div class="field" v-if="client.cardNum">
          <div class="label">الرقم القومي</div>
          <div class="value">{{client.cardNum}}</div>
        </div>
        <div class="field" v-if="client.phone">
          <div class="label">رقم التليفون</div>
          <div class="value">{{client.phone}}</div>
        </div>
        <div class="field" v-if="client.shopId">
          <div class="label">رقم المحل</div>
          <div class="value">{{client.shopId}}</div>
        </div>
        <div class="group">
          <div class="field" v-if="client.firstDate">
            <div class="label">تاريخ دفعة بعد 6 اشهر</div>
            <div class="value">{{ client.firstDate }}</div>
          </div>
          <div class="field" v-if="client.date">
            <div class="label">تاريخ الحجز</div>
            <div class="value">{{ client.date }}</div>
          </div>
        </div>

        <div class="field" v-if="client.install">
          <div class="label">القسط</div>
          <div class="value">{{ client.install }}</div>
        </div>
        
      <div class="btn-group">
        <v-btn router :to="{name: 'ClientsList'}">قائمة العملاء</v-btn>
        <v-btn v-if="client.shopId" router :to="{name: 'Shop', params: {shop_id: client.shopId}}">عرض المحل</v-btn>
      </div>
      </v-card>
    </v-container>
  </main>
</template>

<script>
import db from '../firebase'

export default {
  data() {
    return {
      shop: null,
      client: null
    }
  },

  
  mounted() {
    db.collection('clients').doc(this.$route.params.client_id).get()
      .then(res => this.client = res.data())

    // Get client shop data
    if(this.client) {
      db.collection('shops').doc(this.client.shopId).get()
        .then(res => this.shop = res.data())
    }
  }
}
</script>

<style lang="scss">
$green: #28a745;
$red: crimson;
$blue: #27496d;

.Client {
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
</style>