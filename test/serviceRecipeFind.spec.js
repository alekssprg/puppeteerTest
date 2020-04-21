const assert = require('chai').assert;
const { expect } = require('chai');
const chai = require('chai')
  , chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('LgotaWeb RecipeService lowlevel chaiHttp', async  () => {
    
    it('LgotaWeb RecipeService method RecipeFind lowlevel chaiHttp',(done) => {
       chai.request('localhost:60003')
                .post('/RecipeService.asmx')
                .set('Content-Type', 'text/xml')
                .set('charset', 'utf-8')
                .send(`<?xml version="1.0" encoding="utf-8"?>
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                  <soap:Body>
                    <RecipeFind xmlns="http://tempuri.org/">
                      <clientId>147</clientId>
                      <seria>4716</seria>
                      <number>8000012</number>
                      <saleDate>2016-11-23</saleDate>
                    </RecipeFind>
                  </soap:Body>
                </soap:Envelope>`)
                .end((err, res) => {
                    expect(res.status).to.eq(200);
                    expect(res).to.have.property('text');
                    expect(res.text).to.have.length.above(300);
                    expect(res.text.includes('exception')).to.be.equal(false);
                    assert(res.text.includes('ошибка') == false, "Найдено слово ошибка в ответе от сервера");
                    done(); //обязательно вызывать callback функцию, чтобы сообщить, что все проверки завершены иначе тест завершится до этого
                });
     });

     it('LgotaWeb RecipeService method RecipeFind lowlevel chaiHttp 2 variant', async () => {
        let result = await chai.request('localhost:60003')
                .post('/RecipeService.asmx')
                .set('Content-Type', 'text/xml')
                .set('charset', 'utf-8')
                .send(`<?xml version="1.0" encoding="utf-8"?>
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                  <soap:Body>
                    <RecipeFind xmlns="http://tempuri.org/">
                      <clientId>147</clientId>
                      <seria>4716</seria>
                      <number>8000012</number>
                      <saleDate>2016-11-23</saleDate>
                    </RecipeFind>
                  </soap:Body>
                </soap:Envelope>`);
        expect(result.status).to.eq(200);
        expect(result).to.have.property('text');
        expect(result.text).to.have.length.above(300);
        expect(result.text.includes('exception')).to.be.equal(false);
        assert(result.text.includes('ошибка') == false, "Найдено слово ошибка в ответе от сервера");
    });
});