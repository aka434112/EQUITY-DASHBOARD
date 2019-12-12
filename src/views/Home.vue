<template>
  <v-container>
      <v-layout row wrap>
          <v-flex xs12>
            <v-card>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm4>
                      <v-autocomplete v-model="chosenSymbol" :loading="searchInProgress" :search-input.sync="symbol" :items="companiesList" hide-no-data hide-selected label="Symbol / Organization" prepend-icon="mdi-office-building" return-object></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-select prepend-icon="mdi-clock" v-model="duration" :items="durationItems" label="Duration"></v-select>
                    </v-flex>
                    <v-flex xs6 sm4 align-self-center>
                      <v-btn color="primary" text @click="fetchEquityData()">Search</v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
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
import httpSvc from '../rest/nse/equityUri'

export default {
  name: 'home',
  data () {
    return {
      symbol: "",
      chosenSymbol: null,
      durationItems: dashboardConstants.durationItems,
      duration: dashboardConstants.defaultDuration,
      awaitingSearch: false,
      companiesList: [],
      searchInProgress: false,
      eqData: null
    }
  },
  methods: {
    async fetchCompanies () {
      const vm = this;
      const queryResults = await httpSvc.getListOfCompanies(vm.symbol);
      vm.companiesList = queryResults.data;
      vm.searchInProgress = false;
    },
    async fetchEquityData () {
      const vm = this;
      const orgSymbol = vm.chosenSymbol.split(' ')[0];
      const equityData = await httpSvc.fetchEquity(orgSymbol, vm.duration);
      vm.eqData = equityData.data[0];
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
</style>
