<template>
  <v-container>
      <v-layout row wrap>
          <v-flex xs12>
            <v-card>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm5>
                      <v-autocomplete v-model="chosenSymbol" :loading="searchInProgress" :search-input.sync="symbol" :items="companiesList" hide-no-data hide-selected label="Symbol / Organization" prepend-icon="mdi-office-building" return-object></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-select prepend-icon="mdi-clock" v-model="duration" :items="durationItems" label="Duration"></v-select>
                    </v-flex>
                    <v-flex xs6 sm3 align-self-center v-if="!chosenSymbol && chosenSymbol != ''" >
                      <v-btn disabled color="primary" text @click="fetchEquityData()">Search</v-btn>
                    </v-flex>
                    <v-flex xs6 sm3 align-self-center v-else>
                      <v-btn color="primary" text @click="fetchEquityData()">Search</v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 v-show="noResults" class="text-center">
            <br/>
            <v-alert text type="warning">
              No data to display
            </v-alert>
          </v-flex>
          <v-flex xs12 v-if="eqData" class="infoCard">
            <v-card>
              <v-container fluid>
        				<v-layout row wrap>
                  <v-card-title>ISIN {{eqData[ISIN_KEY]}}</v-card-title>
                  <v-flex xs12 sm3 class="circleContainer">
                    <info-in-circle title="Face Value" :value="eqData[FACE_VALUE_KEY]"></info-in-circle>
                  </v-flex>
                  <v-flex xs12 sm3 class="circleContainer">
                    <info-in-circle title="Paid Up Value" :value="eqData[PAID_UP_VALUE_KEY]"></info-in-circle>
                  </v-flex>
                  <v-flex xs12 sm3 class="circleContainer">
                    <info-in-circle title="Market Lot" :value="eqData[MARKET_LOT_KEY]"></info-in-circle>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4>
            <v-card class="infoCard" v-if="eqData">
              <v-card-title class="justify-center">
                Company Information
              </v-card-title>
              <v-card-text v-html="eqData.marketInfo.information"></v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4>
            <v-card class="infoCard" v-if="eqData">
              <v-card-title class="justify-center">
                Announcements
              </v-card-title>
              <v-card-text v-html="eqData.marketInfo.announcements"></v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4>
            <v-card class="infoCard" v-if="eqData">
              <v-card-title class="justify-center">
                Corporate Actions
              </v-card-title>
              <v-card-text v-html="eqData.marketInfo.actions"></v-card-text>
            </v-card>
          </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
import dashboardConstants from '../constants/dashboardConstants'
import httpSvc from '../rest/nse/equityUri';
import { mapMutations } from 'vuex';
import infoInCircle from '../components/infoInCircle';


export default {
  name: 'home',
  data () {
    return {
      symbol: "",
      ISIN_KEY: dashboardConstants.ISIN_KEY,
      MARKET_LOT_KEY: dashboardConstants.MARKET_LOT_KEY,
      FACE_VALUE_KEY: dashboardConstants.FACE_VALUE_KEY,
      PAID_UP_VALUE_KEY: dashboardConstants.PAID_UP_VALUE_KEY,
      chosenSymbol: null,
      durationItems: dashboardConstants.durationItems,
      duration: dashboardConstants.defaultDuration,
      awaitingSearch: false,
      companiesList: [],
      searchInProgress: false,
      eqData: null,
      noResults: false
    }
  },
  components: {
    infoInCircle
  },
  methods: {
    ...mapMutations(['UPDATE_APPLICATION_STATE']),
    async fetchCompanies () {
      const vm = this;
      const queryResults = await httpSvc.getListOfCompanies(vm.symbol);
      vm.companiesList = queryResults.data;
      vm.searchInProgress = false;
    },
    async fetchEquityData () {
      const vm = this;
      vm.UPDATE_APPLICATION_STATE();
      const orgSymbol = vm.chosenSymbol.split(' ')[0];
      const equityData = await httpSvc.fetchEquity(orgSymbol, vm.duration);
      vm.eqData = equityData.data[0];
      if(vm.eqData) {
        vm.noResults = false;
      } else {
        vm.noResults = true;
      }
      vm.UPDATE_APPLICATION_STATE();
    }
  },
  watch: {
    symbol: function (query) {
      const vm = this;
      vm.companiesList = [];
      if(query && vm.symbol !== vm.chosenSymbol && query !== '') {
        if (!vm.awaitingSearch) {
          vm.searchInProgress = true;
          setTimeout(() => {
            vm.fetchCompanies();
            vm.awaitingSearch = false;
          }, 1000); // 1 sec delay
        }
        vm.awaitingSearch = true;
      }
    }
  }
}
</script>

<style scoped>
.infoCard {
  margin: 1%;
}
.infoCard >>> table {
  color: rgba(0,0,0,.87) !important;
}
.infoCard >>> a {
  text-decoration: none !important;
}
.circleContainer {
  text-align: center !important;
}
</style>
