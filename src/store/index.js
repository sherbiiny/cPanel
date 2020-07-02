import Vue from 'vue'
import Vuex from 'vuex'
import db from '../firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    dealWithNotes(val) {
      if(val) this.notesArr = val.split(/\r?\n/)
      console.log(this.notesArr)
    },

    setShopAsBooked(shopId, cardNum) {
      db.collection('shops').doc(shopId).get()
        .then(doc => {
          console.log(doc)
          if(doc.exists) db.collection('shops').doc(shopId).update({ booked: true, owner: cardNum })
        })
    },

    setShopAsNotBooked(shopId) {
      db.collection('shops').doc(shopId).get()
        .then(doc => {
          if(doc.exists) db.collection('shops').doc(shopId).update({ booked: false, owner: null })
        })
    },

    convertNumToEng(str) {
      
      let persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
      let arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]

      if (typeof str === 'string') {
        for (var i = 0; i < 10; i++) {
          str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i)
        }
      }

      return str

    }

  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
