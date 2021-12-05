import dotenv from 'dotenv'
dotenv.config()

import OpenAPI, { MarketInstrument } from '@tinkoff/invest-openapi-js-sdk';
const apiURL = 'https://api-invest.tinkoff.ru/openapi';
const sandboxApiURL = 'https://api-invest.tinkoff.ru/openapi/sandbox/';
const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
const secretToken = process.env.TOKEN; // токен для боевого api
const sandboxToken = process.env.SANDBOX_TOKEN; // токен для сандбокса
const api = new OpenAPI({ apiURL: sandboxApiURL, secretToken: sandboxToken as string, socketURL });

!(async function run() {
  try {
    await api.sandboxClear();

    const marketInstrument = await api.searchOne({ticker: 'ET'}) as MarketInstrument;
    const {figi} = marketInstrument;
    console.log(await api.setCurrenciesBalance({ currency: 'USD', balance: 1000 })); // 1000$ на счет
    // console.log(await api.portfolioCurrencies());
    console.log(await api.instrumentPortfolio({ figi })); // В портфеле ничего нет
    console.log(await api.limitOrder({operation: 'Buy', figi, lots: 1, price: 100})); // Покупаем ET
    console.log(await api.instrumentPortfolio({ figi })); // Сделка прошла моментально
    console.log(await api.orderbookGet({ figi })); // получаем стакан по ET

    // console.log(
    //   await api.candlesGet({
    //     from: '2021-12-03T11:00:00.131642+07:00',
    //     to: '2021-12-03T12:00:00.131642+07:00',
    //     figi,
    //     interval: '1min',
    //   }) // Получаем свечи за конкретный промежуток времени.
    // );
    //
    // api.orderbook({ figi, depth: 10 }, (x) => {
    //   console.log(x.bids);
    // });
    // api.candle({ figi }, (x) => {
    //   console.log(x.h);
    // });
  } catch (e) {
    console.log(e)
  }
})();
