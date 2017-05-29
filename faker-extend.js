const Faker = require('faker/lib');
const SIN = require('social-insurance-number');
const moment = require('moment');
const phone = require('phone');

const areaCodeCA = ['204', '226', '236', '249', '250', '289', '306', '343', '365', '403', '416',
  '418', '431', '437', '438', '450', '506', '514', '519', '579', '581', '587', '600', '604',
  '613', '639', '647', '705', '709', '778', '780', '807', '819', '867', '873', '902', '905'];

function fakeDOB() {
  return moment(this.date.past(50, '1990-01-01')).format('YYYY-MM-DD');
}

function fakeDatePast() {
  return moment(this.date.past(50)).format('YYYY-MM-DD');
}

function fakeDateFuture() {
  return moment(this.date.future(50)).format('YYYY-MM-DD');
}

function fakeSIN() {
  return SIN.generate();
}

function fakePhoneNumberE164() {
  const phone_area_code = this.random.arrayElement(areaCodeCA);
  const phone_number = this.random.number({ min: 1000000, max: 9999999 });
  const e614Phone = phone('' + phone_area_code + phone_number, 'CA');

  return  e614Phone[0] || '+12045555555';
}

function getFaker() {
  const faker = new Faker({ locale: 'en_CA', localeFallback: 'en' });
  faker.locales['en_CA'] = require('faker/lib/locales/en_CA');
  faker.locales['en'] = require('faker/lib/locales/en');

  faker.custom = {};
  faker.custom.dob = fakeDOB.bind(faker);
  faker.custom.pastDate = fakeDatePast.bind(faker);
  faker.custom.futureDate = fakeDateFuture.bind(faker);
  faker.custom.sin = fakeSIN.bind(faker);
  faker.custom.phoneNumberE164 = fakePhoneNumberE164.bind(faker);

  return faker;
}

module.exports = getFaker;
