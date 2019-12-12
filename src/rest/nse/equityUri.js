import httpSvc from '../httpSvc'

export default {
  getListOfCompanies: async (symbol) => {
    const queryResults = await httpSvc.get('/fetchCompanyList?query=' + symbol);
    return queryResults;
  },
  fetchEquity: async (symbol, duration) => {
    const equityData = await httpSvc.get('/search?symbol=' + symbol + '&duration=' + duration);
    return equityData;
  }
}
