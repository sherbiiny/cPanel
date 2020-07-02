<template>
  <main class="Home">
    <h1>الجمعية التعاوينة للبناء و الإسكان لأهالي المنصورة  قراها</h1>
    <h2>نظام إدارة الحسابات و المحلات</h2>
    <div class="btn-contaienr">
      <router-link :to="{name: 'ShopInput'}">اضافة محل</router-link>
      <router-link :to="{name: 'ClientInput'}">اضافة عميل</router-link>
      <router-link :to="{name: 'BookInput'}">اضافة حجز</router-link>
      <router-link :to="{name: 'ShopsList'}">قائمة المحلات</router-link>
      <router-link :to="{name: 'ClientsList'}">قائمة العملاء</router-link>
      <router-link :to="{name: 'Numbers'}">ادارة المكالمات</router-link>
    </div>
  </main>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  mounted() {
    console.log(firebase.auth().currentUser)
  },
}
</script>

<style lang="scss">
$prim: #27496d;
$sec: crimson;

.Home {
  height: 100%;
  width: 100%;
  padding-top: 50px;
  text-align: center;

  h1 {
    color: $prim;
  }

  h2 {
    color: $prim;
    position: relative;
    width: 100%;
    z-index: 2;
    border-bottom: 4px solid $sec;
    padding-bottom: 30px;
    margin: 30px 0;
  }

  .btn-contaienr {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    max-width: 900px;
    margin: auto;
  }
  a {
    background: $prim;
    display: grid;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 100px;
    text-decoration: none !important;
    color: #FFF !important;
    font-size: 1.3em;
    margin: 30px auto;
    font-weight: bold;
    transition: .3s;

    &:hover {
      transform: scale(1.015);
    }
  }

  @media screen and(max-width: 780px) {
    .btn-contaienr {
      grid-template-columns: 1fr !important;
    }
  }
}


</style>