const csvtojson = require("csvtojson")

csvtojson()
  .fromString(
    `questionIndex,type,question,image,score,options.0,options.1,options.2,options.3,answer
    0,"TEXT","What is the currency of the United States?","NULL",30,"Dollar","Euro","Pound","Yen","0"
    1,"TEXT_WITH_IMAGE","What is the image shown?", "https://example.com/images/coin.png",30,"Coin","Banknote","Credit Card","Receipt","0"
    2,"TEXT","Which country has the highest currency value?","NULL",30,"Kuwait","United States","Switzerland","Japan","0"
    3,"TEXT_WITH_IMAGE","What is the image shown?", "https://example.com/images/piggybank.png",30,"Piggy Bank","Wallet","ATM","Checkbook","0"
    4,"TEXT","What is the smallest unit of Bitcoin?","NULL",30,"Satoshi","Litecoin","Ethereum","Ripple","0"
    5,"TEXT_WITH_IMAGE","What is the image shown?", "https://example.com/images/creditcard.png",30,"Credit Card","Debit Card","ID Card","Gift Card","0"
    6,"TEXT","What is the currency of Japan?","NULL",30,"Yen","Dollar","Euro","Pound","0"
    7,"TEXT_WITH_IMAGE","What is the image shown?", "https://example.com/images/check.png",30,"Check","Receipt","Invoice","Bank Statement","0"
    8,"TEXT","Which country uses the euro as its currency?","NULL",30,"Germany","France","Italy","Spain","0"
    9,"TEXT_WITH_IMAGE","What is the image shown?", "https://example.com/images/wallet.png",30,"Wallet","Purse","Money Clip","Card Holder","0"`
  )
  .then(json => console.log(json))
