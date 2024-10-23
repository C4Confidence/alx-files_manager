/* eslint-disable import/no-named-as-default */
import dbClient from '../../utils/db';

describe('+ AuthController', () => {
  const mockUser = {
    email: 'kaido@beast.com',
    password: 'hyakuju_no_kaido_wano',
  };
  let token = '';

  before(function (done) {
    this.timeout(10000);
    dbClient.usersCollection()
      .then((usersCollection) => {
        usersCollection.deleteMany({ email: mockUser.email })
          .then(() => {
            request.post('/users')
              .send({
                email: mockUser.email,
                password: mockUser.password,
              })
              .expect(201)
              .end((requestErr, res) => {
                if (requestErr) {
                  return done(requestErr);
                }
                expect(res.body.email).to.eql(mockUser.email);
                expect(res.body.id.length).to.be.greaterThan(0);
                done();
              });
          })
          .catch((deleteErr) => done(deleteErr));
      }).catch((connectErr) => done(connectErr));
  });

  describe('+ GET: /connect', () => {
    it('+ Fails with no "Authorization" header field', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/connect')
          .expect(401)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    it('+ Fails for a non-existent user', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/connect')
          .auth('foo@bar.com', 'raboof', { type: 'basic' })
          .expect(401)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    it('+ Fails with a valid email and wrong password', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/connect')
          .auth(mockUser.email, 'raboof', { type: 'basic' })
          .expect(401)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    it('+ Fails with an invalid email and valid password', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/connect')
          .auth('zoro@strawhat.com', mockUser.password, { type: 'basic' })
          .expect(401)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    it('+ Succeeds for an existing user', function () {
      return new Promise((done) => {
        this.timeout(5000);
        request.get('/connect')
          .auth(mockUser.email, mockUser.password, { type: 'basic' })
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body.token).to.exist;
            expect(res.body.token.length).to.be.greaterThan(0);
            token = res.body.token;
            done();
          });
      });
    });
  });

  describe('+ GET: /disconnect', () => {
    // eslint-disable-next-line jest/prefer-expect-assertions
    it('+ Fails with no "X-Token" header field', function () {
      // eslint-disable-next-line jest/no-test-return-statement
      return new Promise((done) => {
        this.timeout(5000);
        // eslint-disable-next-line no-undef
        request.get('/disconnect')
          .expect(401)
          // eslint-disable-next-line consistent-return
          .end((requestErr, res) => {
            if (requestErr) {
              return done(requestErr);
            }
            // eslint-disable-next-line jest/valid-expect
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    // eslint-disable-next-line jest/prefer-expect-assertions, func-names
    it('+ Fails for a non-existent user', function () {
      // eslint-disable-next-line jest/no-test-return-statement
      return new Promise((done) => {
        this.timeout(5000);
        // eslint-disable-next-line no-undef
        request.get('/disconnect')
          .set('X-Token', 'raboof')
          .expect(401)
          // eslint-disable-next-line consistent-return
          .end((requestErr, res) => {
            if (requestErr) {
              return done(requestErr);
            }
            // eslint-disable-next-line jest/valid-expect
            expect(res.body).to.deep.eql({ error: 'Unauthorized' });
            done();
          });
      });
    });

    it('+ Succeeds with a valid "X-Token" field', () => new Promise((done) => {
      // eslint-disable-next-line no-undef
      request.get('/disconnect')
        .set('X-Token', token)
        .expect(204)
        // eslint-disable-next-line consistent-return
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          // eslint-disable-next-line jest/valid-expect
          expect(res.body).to.deep.eql({});
          // eslint-disable-next-line jest/valid-expect
          expect(res.text).to.eql('');
          // eslint-disable-next-line no-unused-expressions, jest/valid-expect
          expect(res.headers['content-type']).to.not.exist;
          // eslint-disable-next-line no-unused-expressions, jest/valid-expect
          expect(res.headers['content-length']).to.not.exist;
          done();
        });
    }));
  });
});
