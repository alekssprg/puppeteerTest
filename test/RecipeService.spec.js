const assert = require('chai').assert;
let soap = require('soap');

describe('LgotaWeb RecipeService', async  () => {
    
    it('LgotaWeb RecipeService method RecipeFind highlevel',(done) => {
        //адрес сервиса
        var url = 'http://localhost:60003/RecipeService.asmx?wsdl';
        //аргументы
        var args = { clientId:147, seria: "4716", number:"8000012", saleDate:"2016-11-23" };
        soap.createClient(url, function(err, client) {
            //вызываем метод нашего сервиса
            client.RecipeFind(args, function(err, result) {
                assert(err == null, "Запрос завершился с ошибкой: " + err);
                assert(result.RecipeFindResult != null, "Запрос вернул пустой результат");
                assert(result.RecipeFindResult.Seria == args.seria, "Серия найденного рецепта не совпадает с отправленной.");
                assert((!result.RecipeFindResult.Invalid), "Сервис вернул объект в ошибкой.");
                done(); //обязательно вызывать callback функцию, чтобы сообщить, что все проверки завершены иначе тест завершится до этого
            });
        });
    });
});