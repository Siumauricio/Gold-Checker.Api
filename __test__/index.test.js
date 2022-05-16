const formatDate = require('../index').formatDate;
const getLast5Years = require('../index').getLast5Years;
const fetchGold = require('../index').fetchGold;
const getRateGold = require('../index').getRateGold;

describe('Calculator tests', () => {
   test('Should return the current date and transform to YYYY-MM-DD ', () => {
      let res = formatDate();
      expect(res).toBe('2022-05-16');
   });
   test('Should return the date transform to YYYY-MM-DD using a custom Date', () => {
      // Month have a range between 0-11
      let previousDate = new Date(2015, 1, 1);
      let res = formatDate(previousDate);
      expect(res).toBe('2015-02-01');

      previousDate = new Date(2020, 5, 25);
      res = formatDate(previousDate);
      expect(res).toBe('2020-06-25');

      previousDate = new Date(2022, 11, 22);
      res = formatDate(previousDate);
      expect(res).toBe('2022-12-22');
   });

   test('Get the last 5 years from (DATE) ', () => {
      const expectedOuput = ['2010-12-22', '2011-12-22', '2012-12-22', '2013-12-22', '2014-12-22', '2015-12-22'];
      let date = new Date(2015, 11, 22); //Means the initial date
      let res = getLast5Years(date);
      expect(res).toStrictEqual(expectedOuput);
   });

   test('Should get the response from the api with the last 5 years ', () => {
      let expectedOuput = ['2010-12-22', '2011-12-22', '2012-12-22', '2013-12-22', '2014-12-22', '2015-12-22'];
      let date = new Date(2015, 11, 22); //Means the initial date
      let res = getLast5Years(date);
      expect(res).toStrictEqual(expectedOuput);

      expectedOuput = ['2015-02-01', '2016-02-01', '2017-02-01', '2018-02-01', '2019-02-01', '2020-02-01'];
      date = new Date(2020, 1, 1); //Means the initial date
      res = getLast5Years(date);
      expect(res).toStrictEqual(expectedOuput);
   });

   test('Should return there is no data available if no data available in the api ', async () => {
      const responseApi = 'Sorry there is no data available for the range date please set another range';
      let date = new Date(2015, 11, 22); //Means the initial date
      let res = await fetchGold(date);
      expect(res).toStrictEqual(responseApi);

      date = new Date(2025, 11, 22);
      res = await fetchGold(date);
      expect(res).toStrictEqual(responseApi);
   });

   test('Should return the biggest and lowest value of gold in the history ', async () => {
      let expectedOuput = {
         lowest: {cena: 130.85, data: '2015-07-27'},
         highest: {cena: 197.18, data: '2019-09-04'},
      };
      let date = new Date(2019, 11, 22); //Means the initial date
      let rate = await getRateGold(date);
      expect(rate).toStrictEqual(expectedOuput);

      expectedOuput = {
         lowest: {cena: 139.32, data: '2018-09-28'},
         highest: {cena: 248.08, data: '2021-11-22'},
      };

      date = new Date(2022, 0, 1);
      rate = await getRateGold(date);
      expect(rate).toStrictEqual(expectedOuput);
   });

   test('Should return no data available if api not found data given a date range', async () => {
      const responseApi = 'Sorry there is no data available for the range date please set another range';
      let date = new Date(1900, 11, 22); //Means the initial date
      let rate = await getRateGold(date);
      expect(rate).toStrictEqual(responseApi);

      date = new Date(2012, 11, 25);
      rate = await getRateGold(date);
      expect(rate).toStrictEqual(responseApi);
   });
});
