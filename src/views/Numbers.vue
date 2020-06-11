<template>
  <main class="Numbers">
    <v-container>
      <form>
        <v-dialog v-model="addDialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="success" v-bind="attrs" v-on="on" class="form-trigger">
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
        <v-text-field label="البحث" class="searchInput"></v-text-field>
      </form>

      <div class="number-container">
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
                <v-list-item>المتصل -- {{ num.caller }}</v-list-item>
                <v-list-item v-if="num.status == 'no-answer'">الحالة -- لم يرد</v-list-item>
                <v-list-item v-if="num.status == 'waiting'">الحالة -- انتظار</v-list-item>
                <v-list-item v-if="num.status == 'agreed'">الحالة -- تم الاتفاق علي ميعاد</v-list-item>
                <v-list-item v-if="num.notes">ملاحظات -- {{ num.notes }}</v-list-item>
                <v-list-item>
                  <v-dialog v-model="editDialog" persistent max-width="600px">
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

export default {
  data() {
    return {
      numbers: [],
      filteredNumbers: [],
      addDialog: false,
      editDialog: false,
      number: null,
      name: null,
      notes: null,
      status: null,
      caller: null,
      notesE: null,
      statusE: null,
      callerE: null,
      snackbar: false,
      snackbarContent: '',
      selectItems: [
        {text: 'لم يرد', value: 'no-answer'},
        {text: 'تم الاتفاق علي ميعاد', value: 'agreed'},
        {text: 'ويتنج', value: 'waiting'}
      ]
    }
  },

  mounted() {
    this.getData()
  },

  methods: {

    getData() {
      this.numbers = []
      db.collection('numbers').get()
        .then(res => {
          res.docs.forEach(doc => this.numbers.push(doc.data()))
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
    }

  },
}
</script>

<style lang="scss">
.Numbers {
  direction: rtl;

  form {
    display: flex;
  }

  .form-trigger {
    margin-right: 50px;
    margin-top: 15px;
    font-size: 22px;
  }

  .searchInput {
    max-width: 500px;
    margin: auto;
    // display: block;
  }

  .number-container {
    margin-top: 50px;
  }

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
</style>