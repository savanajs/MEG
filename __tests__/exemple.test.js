jest.dontMock('../src/assets/js/utils');

describe('Test exemple', function(){

    it('Should return the text "Hello"', function(){

        var util = require('../src/assets/js/utils').default;

        expect(util.msg).toBe("Hello");

    });

});
