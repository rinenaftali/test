'use strict';

describe('The main view', function () {
  var page;

  beforeEach(function () {
    browser.get('http://localhost:9000/index.html');
    page = require('./main.po');
  });

  it('should include jlogin page', function() {
    expect(page.legend.getText()).toBe('Login');
  });

  

});
