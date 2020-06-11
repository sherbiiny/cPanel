<template>
  <main class="Login">
    <v-card>
      <h1>تسجيل دخول</h1>
      <v-form autocomplete="off" @submit.prevent="submit()">
        <v-text-field v-model="email" class="my-5" outlined type="email" label="الايميل"></v-text-field>
        <v-text-field v-model="password" class="my-5" outlined type="password" label="كلمة السر"></v-text-field>
        <v-btn type="submit">تسجيل</v-btn>
        <p v-if="feedback" class="red--text">{{ feedback }}</p>
      </v-form>
    </v-card>
  </main>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    }
  },

  mounted() {
    console.log(firebase.auth().currentUser)
  },

  methods: {
    submit() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(() => this.$router.push({name: 'Home'}))
        .catch(err => this.feedback = err.message)
    }
  }
}
</script>

<style lang="scss">
$prim: #27496d;
$sec: crimson;

.Login {
  .v-card {
    width: 500px;
    padding: 30px;
    margin: 100px auto;
    text-align: center;

    h1 {
      margin: 30px 0;
    }

    .v-btn[type='submit'] {
      display: block;
      background: $prim !important;
      color: #FFF;
      margin: 20px auto;
      font-size: 1.5em;
      width: 200px;
      height: 60px;
      font-weight: bold;
    }
  }
}
</style>