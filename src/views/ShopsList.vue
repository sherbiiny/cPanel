<template>
  <main class="ShopsList">
    <v-container>

      <!-- Form -->
      <div class="info-group">
        <span>عدد المحلات <b> {{ shops.length }}</b></span>
        <span> عدد المحلات المتاحة <b>  {{ shops.length - bookedLength }}</b></span>
        <span> عدد المحلات المحجوزة <b>  {{ bookedLength }}</b></span>
      </div>
      <v-form>
        <v-select height="45px" :items="floorItems" v-model="floor" label="الدور" class="mr-10"></v-select>
        <v-text-field height="45px" v-model="block" maxlength="1" label="البلوك" class="mr-10"></v-text-field>
        <v-text-field height="45px" v-model="sNum" type="number" min="1" max="9" label="رقم المحل" class="mr-10"></v-text-field>
        <v-checkbox v-model="bookedOnly" label="عرض المحجوز فقط"></v-checkbox>
        <v-checkbox v-model="notBookedOnly" label="عرض المتاح فقط"></v-checkbox>
      </v-form>
      <v-icon large @click="$router.push({name: 'Home'})">fa fa-home</v-icon>

      <!-- Shops -->
      <v-row class="mt-10">
        <v-col lg="2" md="3" sm="4" v-for="shop in filteredShops" :key="shop.id" cols="12">
          <v-card class="shop premium" v-if="shop.premium == 'premium'" router :to="{name: 'Shop', params: {shop_id: shop.id}}">
            {{ shop.id }}
          </v-card>
          <v-card class="shop halfPremium" v-if="shop.premium == 'halfPremium'" router :to="{name: 'Shop', params: {shop_id: shop.id}}">
            {{ shop.id }}
          </v-card>
          <v-card class="shop normal" v-if="shop.premium == 'notPremium'" router :to="{name: 'Shop', params: {shop_id: shop.id}}">
            {{ shop.id }}
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </main>
</template>

<script>
import db from '../firebase'
import $ from 'jquery'

export default {
  data() {
    return {
      // Shops
      shops: [],
      filteredShops: [], 
      bookedOnly: false,
      notBookedOnly: false,
      bookedLength: 0,

      // Select Items
      floorItems: [
        {text: "الكل", value: null},
        {text: "الدور الأرضي", value: 1},
        {text: "الدور الأول", value: 2},
        {text: "الدور الثاني", value: 3},
        {text: "الدور الثالث", value: 4},
        {text: "الدور الرابع", value: 5},
        {text: "الدور الخامس", value: 6}
      ],

      // Form Values
      floor: null,
      block: null,
      sNum: null,
    }
  },

  // Track the change of form values
  watch: {

    // Search
    floor: {
      handler(val) {
        this.floorChange(val)
      }
    },
    block: {
      handler(val) {
        this.block = val.toUpperCase()
        this.blockChange(val)
      }
    },
    sNum: {
      handler(val) {
        this.sNumChange(val)
      }
    },

    // Booked Only 
    bookedOnly: {
      handler(val) {
        if(val) {
          this.notBookedOnly = false
          if(this.filteredShops) this.filteredShops = this.filteredShops.filter(shop => shop.booked)
          else this.filteredShops = this.shops.filter(shop => shop.booked)
        } else {
          this.filteredShops = this.shops
          this.floorChange(this.floor)
          this.blockChange(this.block)
          this.sNumChange(this.sNum)
        }
      }
    },

    notBookedOnly: {
      handler(val) {
        if(val) {
          this.bookedOnly = false
          if(this.filteredShops) this.filteredShops = this.filteredShops.filter(shop => !shop.booked)
          else this.filteredShops = this.shops.filter(shop => !shop.booked)
        } else {
          this.filteredShops = this.shops
          this.floorChange(this.floor)
          this.blockChange(this.block)
          this.sNumChange(this.sNum)
        }
      }
    }
  },

  // When page load
  mounted() {
    // let premiums = ['1A-1', '1A-8', '1B-1', '1B-6', '1B-7', '1C-1', '1C-4', '1C-5', '1C-8', '1D-1', '1D-3', '1D-5', '1D-6', '1D-7', '1E-1', '1E-2', '1F-1', '1F-6', '1H-1', '1H-3', '1M-1', '1M-3', '2A-4', '2A-5', '2A-6', '2A-7', '2B-1', '2B-2', '2B-6', '2B-7']                   
    db.collection('shops').get()
      .then(res => {
        res.docs.forEach(doc => {
          let shopData = doc.data()
          shopData.id = doc.id
          if(shopData.booked) this.bookedLength++
          this.shops.push(shopData)
        })
        this.filteredShops = this.shops
      })
  },

  methods: {

    // When floor value changes
    floorChange(val) {
      let filtered = null

      if(this.block) {
        if(!filtered) {
          filtered = this.shops.filter(shop => shop.block == this.block)
        }
        else {
          filtered = filtered.filter(shop => shop.block == this.block)
        }
      }

      if(this.sNum) {
        if(!filtered) {
          filtered = this.shops.filter(shop => shop.sNum == this.sNum)
        }
        else {
          filtered = filtered.filter(shop => shop.sNum == this.sNum)
        }
      }

      if(val) {

        if(filtered) filtered = filtered.filter(shop => shop.floor == val)
        else filtered = this.shops.filter(shop => shop.floor == val)

      } else {
        if(this.block) {
          if(!filtered) {
            filtered = this.shops.filter(shop => shop.block == this.block)
          }
          else {
            filtered = filtered.filter(shop => shop.block == this.block)
          }
        }

        else if(this.sNum) {
          if(!filtered) {
            filtered = this.shops.filter(shop => shop.sNum == this.sNum)
          }
          else {
            filtered = filtered.filter(shop => shop.sNum == this.sNum)
          }
        }

        else filtered = this.shops
      }

      this.filteredShops = filtered
    },
    
    // When block value changes
    blockChange(val) {
      let filtered = null

      if(this.floor) {
        if(!filtered) {
          filtered = this.shops.filter(shop => shop.floor == this.floor)
        }
        else {
          filtered = filtered.filter(shop => shop.floor == this.floor)
        }
      }

      if(this.sNum) {
        if(!filtered) {
          filtered = this.shops.filter(shop => shop.sNum == this.sNum)
        }
        else {
          filtered = filtered.filter(shop => shop.sNum == this.sNum)
        }
      }

      if(val) {

        if(filtered) filtered = filtered.filter(shop => shop.block == val)
        else filtered = this.shops.filter(shop => shop.block == val)

      } else {
        if(this.floor) {
          if(!filtered) {
            filtered = this.shops.filter(shop => shop.floor == this.floor)
          }
          else {
            filtered = filtered.filter(shop => shop.floor == this.floor)
          }
        }

        else if(this.sNum) {
          if(!filtered) {
            filtered = this.shops.filter(shop => shop.sNum == this.sNum)
          }
          else {
            filtered = filtered.filter(shop => shop.sNum == this.sNum)
          }
        }

        else filtered = this.shops
      }

      this.filteredShops = filtered
    },

    // When shop number value changes
    sNumChange(val) {
      let filtered = null

      if(this.block) {
        if(!filtered) {
          filtered = this.shops.filter(shop => shop.block == this.block)
        }
        else {
          filtered = filtered.filter(shop => shop.block == this.block)
        }
      }

      if(this.floor) {
        if(!filtered) {
          filtered = this.shops.filter(shop => shop.floor == this.floor)
        }
        else {
          filtered = filtered.filter(shop => shop.floor == this.floor)
        }
      }

      if(val) {

        if(filtered) filtered = filtered.filter(shop => shop.sNum == val)
        else filtered = this.shops.filter(shop => shop.sNum == val)

      } else {
        if(this.block) {
          if(!filtered) {
            filtered = this.shops.filter(shop => shop.block == this.block)
          }
          else {
            filtered = filtered.filter(shop => shop.block == this.block)
          }
        }

        else if(this.floor) {
          if(!filtered) {
            filtered = this.shops.filter(shop => shop.floor == this.floor)
          }
          else {
            filtered = filtered.filter(shop => shop.floor == this.floor)
          }
        }

        else filtered = this.shops
      }

      this.filteredShops = filtered
    },

  },
}
</script>

<style lang="scss">

.v-select__selections {
  line-height: 24px !important;
}
.ShopsList {

  .info-group {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;

    span {
      color: #888 !important;

      b {
        margin-right: 5px;
      }
    }
  }

  .v-form {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .container {
    padding: 50px 50px;
  }

  .shop {
    padding: 30px;
    border: 3px solid #DDD;
    display: flex;
    align-items: center;
    justify-content: center;
    font: 600 24px "Roboto";
    letter-spacing: 3px;
    color: #555 !important;
 
    &.premium {
      border: 3px solid gold;
    }

    &.halfPremium {
      border: 3px solid #bd9595;
    }
  }

  .fa-home {
    display: inline;
    position: absolute;
    top: 20px;
    right: 50px;
  }

  @media screen and(max-width: 780px) {
    .v-form {
      grid-template-columns: 1fr;
    }
  }
}
</style>