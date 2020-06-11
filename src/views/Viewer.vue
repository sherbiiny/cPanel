<template>
  <main class="Viewer">
    <v-container>
      <v-card class="client-card" v-if="client">
        <h1>{{ client.clientName }}</h1>

        <div class="field" v-if="client.phone">
          <div class="label">رقم التليفون</div>
          <div class="value">{{client.phone}}</div>
        </div>
        

        <div class="field" v-if="client.reason">
          <div class="label">سبب الزيارة</div>
          <div class="value">{{client.reason}}</div>
        </div>

        <div class="field" v-if="client.shopId">
          <div class="label">رقم المحل</div>
          <div class="value">{{client.shopId}}</div>
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
    db.collection('viewers').doc(this.$route.params.client_id).get()
      .then(res => this.client = res.data())
  },

  methods: {
    deleteClient() {

      if(this.client.shopId) {
        db.collection('shops').doc(this.client.shopId).update({booked: false})
          .then(() => db.collection('viewers').doc(this.client.phone).delete())
          .then(() => console.log('deleted'))
      }
    }
  }
}
</script>

<style lang="scss">
$green: #28a745;
$red: crimson;
$blue: #27496d;

.Viewer {
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
        background: $green !important;
      }

      &:nth-child(2) {
        background: $green !important;
      }

      &.deleter {
        background: $red !important;
        display: block;
      }
    }
  }
}
</style>