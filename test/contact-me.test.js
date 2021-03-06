/* eslint guard-for-in: "off" */

describe('contactMe plugin', function() {
  var options = {
    token: '62bb61431348e22850828a5829c4373faafe29c1',
    secret: '51a266c2844ccd5cac83d88de88d82d05358aa51',
    fields: {
      state: ['PR', 'SC', 'SP', 'RS'],
      level: ['Iniciante', 'Intermediário', 'Avançado', 'Ninja']
    },
    endpoint: '/api/users'
  };

  describe('execution', function() {
    beforeEach(function() {
      this.$form = $('<div class="form">');
      $('body').append(this.$form);
    });

    afterEach(function() {
      this.$form.remove();
      this.$form = null;
    });

    it('should throw an error if no endpoint specified', function() {
      expect(function() {
        this.$form.contactMe();
      }.bind(this)).toThrow();
    });

    it('should accept endpoint option as endpoint', function() {
      var endpoint = '/api/users';
      var $form = this.$form;

      expect(function() {
        $form.contactMe({
          endpoint: endpoint
        });
      }).not.toThrow();

      expect($form.find('.cm-form').attr('action')).toEqual(endpoint);
    });

    it('should accept data-endpoint attribute as endpoint', function() {
      var endpoint = '/api/users';
      var $form = this.$form;

      expect(function() {
        $form[0].dataset.endpoint = endpoint;
        $form.contactMe();
      }).not.toThrow();

      expect($form.find('.cm-form').attr('action')).toEqual(endpoint);
    });
  });

  describe('initialization', function() {
    beforeAll(function() {
      this.$form = $('<div class="form">');
      $('body').append(this.$form);
      this.$form.contactMe(options);
    });

    afterAll(function() {
      this.$form.remove();
      this.$form = null;
    });

    it('should create a form.cm-form element', function() {
      expect(this.$form.find('.cm-form').length).toBeGreaterThan(0);
    });

    it('should create elements from the "fields" option', function() {
      for (var field in options.fields) {
        expect(this.$form.find('[name=' + field + ']').length)
          .toBeGreaterThan(0);
      }
    });

    it('should create a submit button', function() {
      expect(this.$form.find('button[type=submit]').length).toBeGreaterThan(0);
    });
  });

  describe('usage', function() {
    beforeAll(function() {
      this.$form = $('<div class="form">');
      $('body').append(this.$form);
      this.$form.contactMe(options);

      var $form = this.$form;

      this.$form.fillMe = function(data) {
        for (var key in data) {
          $form.find('[name=' + key + ']').val(data[key]);
        }
      };
    });

    afterAll(function() {
      this.$form.remove();
      this.$form = null;
    });

    it('should submit data to the endpoint when submit button is clicked',
      function(done) {
        var user = {
          name: 'Lucas',
          email: 'rinaldi.lcs@email.com',
          state: 'sc',
          level: 'ninja'
        };
        var $form = this.$form;

        if ($form.find('[type=submit]').length === 0) {
          done();
        }

        $form.fillMe(user);
        $form.find('form').on('submit', function(e) {
          e.preventDefault();

          $.post(options.endpoint, $form.find('form').serialize(),
            function(data) {
              $.get(options.endpoint, {id: data.id}, function(data) {
                delete data.id;
                user.token = options.token;
                user.secret = options.secret;
                expect(user).toEqual(data);
                done();
              });
            });
        });
        $form.find('[type=submit]').click();
      });
  });
});
