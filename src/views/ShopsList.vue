<template>
  <main class="ShopsList">
    <v-container>

      <!-- Form -->
      <v-form>
        <v-select :items="floorItems" v-model="floor" label="الدور" class="mr-10"></v-select>
        <v-text-field v-model="block" maxlength="1" label="البلوك" class="mr-10"></v-text-field>
        <v-text-field v-model="sNum" type="number" min="1" max="9" label="رقم المحل" class="mr-10"></v-text-field>
      </v-form>
      <v-icon large @click="$router.push({name: 'Home'})">fa fa-home</v-icon>

      <!-- Shops -->
      <v-row class="mt-10">
        <v-col lg="2" md="3" sm="4" v-for="shop in filteredShops" :key="shop.id" cols="12">
          <v-card class="shop" :class="shop.premium ? 'premium' : 'normal'" router :to="{name: 'Shop', params: {shop_id: shop.id}}">
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

      // Select Items
      floorItems: [
        {text: "الكل", value: null},
        {text: "الدور الأرضي", value: 1},
        {text: "الدور الأول", value: 2},
        {text: "الدور الثاني", value: 3},
      ],

      // Form Values
      floor: null,
      block: null,
      sNum: null,
    }
  },

  // Track the change of form values
  watch: {
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
  },

  // When page load
  mounted() {
    db.collection('shops').get()
      .then(res => {
        res.docs.forEach(doc => {
          let shopData = doc.data()
          shopData.id = doc.id
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