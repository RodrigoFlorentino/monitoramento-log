var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '0556e82f-e5c5-46b3-9589-f50a2ed64b5b',
  'password': 'OjYMo1SOp4Y6',
  'version_date': '2017-02-27'
});




 var nluWatson = {
     analisar : function(req, res) {
       //console.log('Param '+texto);
       //console.log('Param '+req.params.url);

       var parameters;
       if(!(req.params.url == "undefined")){
           parameters = {
                   'url': req.params.url,
                   'language':'en',
                   'features': {
                     'entities': {
                       'emotion': true,
                       'sentiment': true,
                       'limit': 6
                     },
                     'keywords': {
                       'emotion': true,
                       'sentiment': true,
                       'limit': 6
                     },
                     'emotion': {'limit': 6},
                     'concepts': {'limit': 6}
                   }
            }
       }
       if(!(req.params.texto == "undefined")){
                parameters = {
                  'text': req.params.texto,
                  'language':'pt',
                  'features': {
                    'entities': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 6
                    },
                    'keywords': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 6
                    },
                    'emotion': {'limit': 6},
                    'concepts': {'limit': 6}
                  }
                }
       }
      // 'IBM is an American multinational technology company headquartered in Armonk, New York, United States, with operations in over 170 countries.'


        console.log('Param '+parameters);

        natural_language_understanding.analyze(parameters, function(err, response) {
          if (err)
            console.log('error:', err);
          else{
            console.log('Executando..'+JSON.stringify(response));
            res.status(200).json(response);
            }
        });
     }
}
module.exports = nluWatson;