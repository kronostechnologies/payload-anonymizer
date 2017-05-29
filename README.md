# payload-anonymizer

Generates a copy of a plain object with fake data generated from [Faker.js](https://github.com/marak/Faker.js). This way, you can log/extract data causing bugs without the fear of leaking crucial user information.

Since it does not rely on the data to anonymize, the original data cannot be retrieved in any way. 



## Installation

```
npm install payload-anonymizer
```


## Usage

A map of fields to anonymize must be provided in order to know what fields must be anonymized. Use the name of the fields to anonymize as keys and Faker.js strings as values so we can pass the string to Faker.js.

Custom methods can also be provided. The Faker.js is given as the first parameters of those custom methods.

When the data is an array of object, an object with the keys must be provided to know the fields to anonymize. The structure of the payload will be kept accordingly.

When the data is an array of scalar, a string with the method to use to anonymize must be provided. The structure of the payload will be kept accordingly.

```javascript
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
```

Send the map alongside the data and an optional Faker.js seed to anonymize the payload. Note that it is not garanteed that the seed cannot be retrived from the generated data, so use it wisely.

```javascript
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

const Anonymizer = require('../index');
const anonymized_data = Anonymizer(anonymization_map, payload, { seed: payload.id });
```


## Running the example

```
npm run example
```


## Running tests

```
npm test
```
