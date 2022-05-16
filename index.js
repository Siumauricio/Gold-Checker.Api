const axios = require('axios').default;

const formatDate = (date = new Date()) => {
   let d = new Date(date);
   let month = (d.getMonth() + 1).toString(); // + 1 because getMonth() returns month from 0 to 11
   let day = d.getDate().toString();
   let year = d.getFullYear();
   if (month.length < 2) {
      month = '0' + month;
   }
   if (day.length < 2) {
      day = '0' + day;
   }
   return [year, month, day].join('-');
};
const getLast5Years = (initDate = new Date()) => {
   let date = formatDate(initDate);
   const last5Years = [date];

   for (let i = 0; i < 5; i++) {
      let previousDate = initDate.setFullYear(initDate.getFullYear() - 1);
      date = formatDate(previousDate);
      last5Years.push(date);
   }
   return last5Years.reverse();
};

// 2019-05-16 -> YYYY-MM-DD
const fetchGold = async (initDate = new Date()) => {
   const API_URL = 'http://api.nbp.pl/api/cenyzlota/';
   const goldListPromises = [];
   const years = getLast5Years(initDate);
   for (let i = 0; i < years.length - 1; i++) {
      const currentYear = years[i];
      const previousYear = years[i + 1];
      const request = axios.get(API_URL + `${currentYear}/${previousYear}`);
      goldListPromises.push(request);
   }
   const data = [];
   try {
      const promisesGoldList = await Promise.all(goldListPromises);
      for (let i = 0; i < promisesGoldList.length; i++) {
         const yearData = await promisesGoldList[i].data;
         data.push(yearData);
      }
   } catch (error) {
      return 'Sorry there is no data available for the range date please set another range';
   }
   return data;
};

const getRateGold = async (initDate = new Date()) => {
   const goldData = await fetchGold(initDate);
   let rate = {
      lowest: {
         cena: Number.MAX_VALUE,
         data: '',
      },
      highest: {
         cena: 0,
         data: '',
      },
   };
   for (let i = 0; i < goldData.length; i++) {
      const currentYear = await goldData[i];
      Object.keys(currentYear).forEach((key) => {
         if (currentYear[key].cena > rate.highest['cena']) {
            rate.highest['cena'] = currentYear[key].cena;
            rate.highest['data'] = currentYear[key].data;
         }
         if (currentYear[key].cena < rate.lowest['cena']) {
            rate.lowest['cena'] = currentYear[key].cena;
            rate.lowest['data'] = currentYear[key].data;
         }
      });
   }
   return typeof goldData === 'string' ? goldData : rate;
};

(async () => {
   const date = new Date();
   const rs = await getRateGold(date);
   if (typeof rs === 'object') {
      const invest = 135000;
      console.log(`This was the best time to sell gold -> Highest rate: ${rs.highest.cena} $ on ${rs.highest.data}`);
      console.log(`This was the best time to buy gold -> Lowest rate: ${rs.lowest.cena} $ on ${rs.lowest.data}`);
      console.log(`Investment: ${invest} $`);
      // console.log(`Profit: ${((rs.highest.cena - invest) * 100) / invest} %`);
   } else {
      console.log(rs);
   }
})();

module.exports = {
   fetchGold,
   getRateGold,
   formatDate,
   getLast5Years,
};
