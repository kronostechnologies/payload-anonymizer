const expect = require('chai').expect;
const Anonymizer = require('../index');

describe('Anonymizer', () => {
  it('replaces the data key when the map key is a string', () => {
    const map = { name: '{{name.firstName}}'};
    const data = { name: '123456' };

    const anonymized = Anonymizer(map, data);

    expect(anonymized.name).to.not.equal('123456');
  });

  it('loops over the data when it\'s an array', () => {
    const map = { name: '{{name.firstName}}' };
    const data = [{ name: '123456' }, { name: '789012'}];

    const anonymized = Anonymizer(map, data);

    expect(anonymized[0].name).to.be.a('string');
    expect(anonymized[0].name).to.not.equal('123456');

    expect(anonymized[1].name).to.be.a('string');
    expect(anonymized[1].name).to.not.equal('789012');
  });

  it('anonymizes the scalars in arrays', () => {
    const map = { names: '{{name.firstName}}' };
    const data = { names: [ '123456', '789012' ] };

    const anonymized = Anonymizer(map, data);

    expect(anonymized.names).to.be.an('array');
    expect(anonymized.names[0]).to.be.a('string');
    expect(anonymized.names[0]).to.not.equal('123456');
    expect(anonymized.names[1]).to.be.a('string');
    expect(anonymized.names[1]).to.not.equal('789012');
  });

  it('returns the same structure', () => {
    const map = { contact: { name: '{{name.firstName}}' } };
    const data = { contact: { name: '123456' } };

    const anonymized = Anonymizer(map, data);

    expect(anonymized.contact).to.be.ok;
    expect(anonymized.contact.name).to.be.ok;
    expect(anonymized.contact.name).to.not.equal('123456');
  });

  it('returns the same structure also when array', () => {
    const map = { contact: { name: '{{name.firstName}}' } };
    const data = [{ contact: {name: '123456' } },
                { contact: { name: '789012' } }];

    const anonymized = Anonymizer(map, data);

    expect(anonymized[0].contact).to.be.ok;
    expect(anonymized[0].contact.name).to.be.ok;
    expect(anonymized[0].contact.name).to.not.equal('123456');

    expect(anonymized[1].contact).to.be.ok;
    expect(anonymized[1].contact.name).to.be.ok;
    expect(anonymized[1].contact.name).to.not.equal('789012');
  });

  it('deals with different structure type on same level', () => {
    const map = { name: '{{name.firstName}}', address: { value: '{{address.streetAddress}}' } };
    const data = { name: '123456', address: { value: 'abc' } };

    const anonymized = Anonymizer(map, data);

    expect(anonymized.name).to.not.equal('123456');
    expect(anonymized.address.value).to.be.ok;
    expect(anonymized.address.value).to.not.equal('abc');
  });

  it('deals with different structure type of same level also when array', () => {
    const map = { name: '{{name.firstName}}', address: { value: '{{address.streetAddress}}' } };
    const data = { name: '123456', address: [{ value: 'abc' }, { value: 'def' }] };

    const anonymized = Anonymizer(map, data);

    expect(anonymized.address[0]).to.be.ok;
    expect(anonymized.address[0].value).to.be.a('string');
    expect(anonymized.address[0].value).to.not.equal('abc');

    expect(anonymized.address[1]).to.be.ok;
    expect(anonymized.address[1].value).to.be.a('string');
    expect(anonymized.address[1].value).to.not.equal('abc');
  });

  it('does not add map fields to the data', () => {
    const map = { name: '{{name.firstName}}', age: '{{random.number}}' };
    const data = { name: '123456' };

    const anonymized = Anonymizer(map, data);

    expect(anonymized.age).to.not.be.ok;
  });

  it('does not replaces null with random data', () => {
    const map = { name: '{{name.firstName}}' };
    const data = { name: null };

    const anonymized = Anonymizer(map, data);

    expect(anonymized.name).to.be.null;
  });

  it('uses the provided seed if it exists', () => {
    const map = { name: '{{name.firstName}}' };
    const data1 = { name: 'name1' };
    const data2 = { name: 'name2' };
    const opts = { seed: 1000 };

    const anonymized1 = Anonymizer(map, data1, opts);
    const anonymized2 = Anonymizer(map, data2, opts);

    expect(anonymized1.name).to.equal(anonymized2.name);
  });

  it('returns a random valid CA phone number', () => {
    const map = { phone: '{{custom.phoneNumberE164}}' };
    const data = { phone: '(555) 555-5555' };

    const anonymized = Anonymizer(map, data);

    expect(anonymized.phone).to.not.equal('(555) 555-5555');
    expect(anonymized.phone.charAt(0)).to.equal('+');
  });

  it('returns a random valid date of birth', () => {
    const map = { dob: '{{custom.dob}}' };
    const data = { dob: '1970-01-01' };

    const anonymized = Anonymizer(map, data);

    expect(anonymized.dob).to.not.equal('1970-01-01');
  });

  it('return a random valid sin', () => {
    const map = { sin: '{{custom.sin}}' };
    const data = { sin: '999 999 998' };

    const anonymized = Anonymizer(map, data);

    expect(anonymized.sin).to.not.equal('999 999 999');
  });

  it('returns the callback result if map is callable', () => {
    const map1 = { name: () => null };
    const map2 = { name: () => 'name' };
    const data = { name: { firstName: 'firstName' } };

    const anonymized1 = Anonymizer(map1, data);
    const anonymized2 = Anonymizer(map2, data);

    expect(anonymized1.name).to.be.null;
    expect(anonymized2.name).to.equal('name');
  });
});
