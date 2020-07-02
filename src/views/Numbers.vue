<template>
  <main class="Numbers">
    <v-container>
      <!-- "Add new" dialog -->
      <v-dialog v-model="addDialog" max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="success" v-bind="attrs" v-on="on" class="add-dialog-trigger">
            اضافة
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="mx-auto bold my-5">اضافة مكالمة</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form @submit='submit()'>
                <v-text-field outlined label="الاسم" v-model="name"></v-text-field>
                <v-text-field outlined label="الرقم" v-model="number"></v-text-field>
                <v-text-field outlined label="المتصل" v-model="caller"></v-text-field>
                <v-select outlined label="الحالة" :items="selectItems" v-model="status"></v-select>
                <v-textarea outlined label="ملاحظات" v-model="notes"></v-textarea>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions class="text-center card-actions">
            <v-btn color="red" text @click="addDialog = false">الغاء</v-btn>
            <v-btn color="success" @click="submit()">اضافة</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Searvh bar -->
      <v-form submit.prevent class="search-form">
        <v-select height="45px" :items="searchByItems" v-model="searchBy" label="بحث بواسطة" class="mr-10"></v-select>
        <v-select height="45px" :items="statusFilterItems" v-model="statusFilter" label="الحالة" class="mr-10"></v-select>
        <v-text-field height="45px" label="البحث" class="searchInput" v-model="searchKey"></v-text-field>
      </v-form>

      <div class="number-container">
        <!-- Numbers list -->
        <v-expansion-panels>
          <v-expansion-panel class="panel my-1" v-for="(num, i) in filteredNumbers" :key="i">
            <v-expansion-panel-header class="header">
              {{ num.number }} - {{ num.name }}
              <v-icon small :class="num.status" v-if="num.status == 'no-answer'">fa fa-close</v-icon>
              <v-icon small :class="num.status" v-if="num.status == 'waiting'">fa fa-exclamation-triangle</v-icon>
              <v-icon small :class="num.status" v-if="num.status == 'agreed'">fa fa-check</v-icon>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="content">
              <v-list>
                <v-list-item><span>المتصل</span>: {{ num.caller }}</v-list-item>
                <v-list-item v-if="num.status == 'no-answer'"><span>الحالة</span>: لم يرد</v-list-item>
                <v-list-item v-if="num.status == 'waiting'"><span>الحالة</span>: انتظار</v-list-item>
                <v-list-item v-if="num.status == 'agreed'"><span>الحالة</span>: تم الاتفاق علي ميعاد</v-list-item>
                <v-list-item v-if="num.notes"><span>ملاحظات</span>: {{ num.notes }}</v-list-item>
                <v-list-item class="mt-5">

                  <!-- Edit dialog -->
                  <v-dialog v-model="editDialog" max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="warning" @click="assign(num.status, num.notes, num.caller)" v-bind="attrs" v-on="on">
                        تعديل
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="mx-auto bold my-5">تعديل</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-form @submit='edit(num.number)'>
                            <v-text-field outlined label="المتصل" v-model="callerE">{{ num.caller }}</v-text-field>
                            <v-select outlined label="الحالة" :items="selectItems" v-model="statusE" :value="num.status"></v-select>
                            <v-textarea outlined label="ملاحظات" v-model="notesE">{{ num.notes }}</v-textarea>
                          </v-form>
                        </v-container>
                      </v-card-text>
                      <v-card-actions class="text-center card-actions">
                        <v-btn color="red" text @click="editDialog = false">الغاء</v-btn>
                        <v-btn color="warning" @click="edit(num.number)">تعديل</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-btn color="success" class="mr-5" v-clipboard:copy="num.number" v-clipboard:success="copied">نسخ الرقم</v-btn>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-container>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar">
      {{ snackbarContent }}
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
      // Search vars
      searchKey: null,
      searchBy: 'phone',
      searchByItems: [
        {text: "الرقم", value: "phone"},
        {text: "الاسم", value: "name"}
      ],

      // Filter by status vars
      statusFilter: "all",
      statusFilterItems: [
        {text: "الجميع", value: "all"},
        {text: "لم يرد", value: "no-answer"},
        {text: "تم الاتفاق", value: "answered"},
        {text: "انتظار", value: "waiting"}
      ],

      // Numbers vars
      numbers: [],
      filteredNumbers: [],

      // Add dialog vars
      addDialog: false,
      number: null,
      name: null,
      notes: null,
      status: null,
      caller: null,

      // Edit dialog vars
      editDialog: false,
      notesE: null,
      statusE: null,
      callerE: null,
      selectItems: [
        {text: 'لم يرد', value: 'no-answer'},
        {text: 'تم الاتفاق علي ميعاد', value: 'agreed'},
        {text: 'ويتنج', value: 'waiting'}
      ],

      // Others
      snackbar: false,
      snackbarContent: ''
    }
  },

  mounted() {
    this.getData()
  },

  watch: {
    searchKey: {
      handler(val) {
        console.log(val)
      }
    }
  },

  methods: {

    getData() {
      this.numbers = []
      db.collection('numbers').get()
        .then(res => {
          res.docs.forEach(doc => this.numbers.push(doc.data()))
          this.numbers.map(num => num.number = store.state.convertNumToEng(num.number))
          this.filteredNumbers = this.numbers
        })
    },

    submit() {
      if(this.name && this.number && this.status) {
        db.collection('numbers').doc(this.number).set({
          number: this.number,
          name: this.name,
          status: this.status,
          caller: this.caller,
          notes: this.notes
        }).then(() => {
          this.snackbarContent = 'تمت اضافة المكالمة بنجاح'
          this.snackbar = true
          this.addDialog = false
          this.getData()
        })

      }
    },

    assign(status, notes, caller) {
      this.statusE = status
      this.notesE = notes
      this.callerE = caller
    },

    edit(number) {
      db.collection('numbers').doc(number).update({
        caller: this.callerE,
        notes: this.notesE,
        status: this.statusE,
      }).then(() => {
        this.editDialog = false
        this.snackbarContent = 'تم تعديل البيانات'
        this.snackbar = true
        this.getData()
      })
    },

    copied() {
      this.snackbarContent = 'تم نسخ الرقم بنجاح'
      this.snackbar = true
    },

    filter(val) {
      
    }

  },
}
</script>

<style lang="scss">
.Numbers {
  direction: rtl;

  .search-form {
    display: flex;
  }

  .add-dialog-trigger {
    margin-right: 50px;
    margin-top: 15px;
    font-size: 22px;
  }

  .number-container {
    margin-top: 50px;
  }

  .card-actions {
    display: flex;
    justify-content: center;
    padding-bottom: 50px;
  }

  .bold {
    font-weight: 600;
  }

  .v-expansion-panel-header__icon {
    margin-right: 20px;
  }

  .header {
    position: relative;
  }

  i {
    display: inline !important;


    &.agreed {
      color: #43A040 !important;
    }

    &.no-answer {
      color: crimson !important;
    }

    &.waiting {
      color: #FFB300 !important;
    }
  }
}

</style>