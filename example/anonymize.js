const Anonymizer = require('../index');

const anonymization_map = {
  firstName: '{{name.firstName}}',
  lastName: '{{name.lastName}}',
  title: (faker) => faker.fake('{{name.title}}'),
  birthDate: '{{custom.dob}}',
  emails: '{{internet.email}}',
  phones: '{{custom.phoneNumberE164}}',
  addresses: {
    streetNumber: '{{random.number}}',
    streetName: '{{address.streetName}}',
    suite: () => null,
    city: '{{address.city}}',
    state: '{{address.stateAbbr}}',
    zipCode: '{{address.zipCode}}',
    country: '{{address.countryCode}}'
  }
};

const payload = {
  id: 123,
  firstName: 'first name',
  lastName: 'last name',
  title: 'Dr',
  birthDate: '1970-01-01',
  favoriteColor: 'red',
  emails: [
    'first-name.last-name@example.com',
    'flastname@example.com'
  ],
  phones: [
    '+18885551234',
    '+15555551234'
  ],
  addresses: [{
    streetNumber: 123,
    streetName: 'General Avenue',
    suite: 101,
    city: 'New York',
    state: 'New York',
    zipCode: '90210',
    country: 'United States'
  }]
};

console.log(Anonymizer(anonymization_map, payload, { seed: payload.id }));
