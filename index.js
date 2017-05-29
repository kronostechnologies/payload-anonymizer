const Faker = require('./faker-extend');
const { cloneDeep, forIn, isPlainObject, isString } = require('lodash');

function Anonymizer(map, data, opts = {}) {
  const faker = new Faker();

  const seed = opts.seed || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  faker.seed(seed);

  const anonymizeRecursively = (current_map, current_data) => {
    if(isPlainObject(current_map) && isPlainObject(current_data)) {
      current_data = cloneDeep(current_data);
      forIn(current_map, (value, key) => {
        if(current_data[key]) {
          if(isString(value) && Array.isArray(current_data[key])) {
            current_data[key] = current_data[key].map(() => faker.fake(value));
          }
          else if(isString(value)) {
            current_data[key] = faker.fake(value);
          }
          else if(typeof value === 'function') {
            current_data[key] = value(faker);
          }
          else if(isPlainObject(value) || Array.isArray(value)) {
            current_data[key] = anonymizeRecursively(value, current_data[key]);
          }
        }
      });
      return current_data;
    }
    else if(Array.isArray(current_data)) {
      return current_data.map((value, index) => anonymizeRecursively(current_map, value));
    }
  };

  return anonymizeRecursively(map, data);
}

module.exports = Anonymizer;
