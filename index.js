const axios = require('axios').default;
const moment = require('moment');
const API_URL = 'http://api.nbp.pl/api/cenyzlota/';
const _ = require('lodash');

const getLast5Years = (initDate = new Date()) => {
   return Array.from({length: 6}, (_, k) => {
      const formatDate = moment(initDate, 'YYYY-MM-DD').subtract(k, 'years').format('YYYY-MM-DD');
      return formatDate;
   }).reverse();
};
const fetchGold = async (initDate = new Date()) => {
   const goldListPromises = [];
   const data = [];
   const years = getLast5Years(initDate);
   for (let i = 0; i < years.length - 1; i++) {
      const currentYear = years[i];
      const previousYear = years[i + 1];
      const request = axios.get(API_URL + `${currentYear}/${previousYear}`);
      goldListPromises.push(request);
   }
   try {
      const promisesGoldList = await Promise.all(goldListPromises);
      for (let i = 0; i < promisesGoldList.length; i++) {
         const yearData = await promisesGoldList[i].data;
         data.push(yearData);
      }
   } catch (error) {
      return 'Sorry there is no data available for the range date please set another range';
   }
   return data.flat();
};
const isValid = (d) => moment(d, 'YYYY-MM-DD', true).format('YYYY-MM-DD') === d;

const getRateGold = async (initDate = new Date()) => {
   const goldData = await fetchGold(initDate);
   if (typeof goldData !== 'string') {
      const maxRate = _.maxBy(goldData, 'cena');
      const minRate = _.minBy(goldData, 'cena');
      return {
         highest: maxRate,
         lowest: minRate,
      };
   }
   return goldData;
};
(async () => {
   const args = process.argv.slice(2);
   if (args.length === 0 || !isValid(args[0])) {
      console.log('Please set a date in format YYYY-MM-DD Like 2022-02-12');
   } else if (isValid(args[0])) {
      const rs = await getRateGold(args[0]);
      if (typeof rs === 'object') {
         const invest = 135000;
         console.log(`This was the best time to sell gold -> Highest rate: ${rs.highest.cena} $ on ${rs.highest.data}`);
         console.log(`This was the best time to buy gold -> Lowest rate: ${rs.lowest.cena} $ on ${rs.lowest.data}`);
         console.log(`Investment: ${invest} $`);
      } else {
         console.log(rs);
      }
   }
})();

module.exports = {
   fetchGold,
   getRateGold,
   isValid,
   getLast5Years,
};
