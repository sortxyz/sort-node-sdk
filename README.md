# Official Node.js Client for Sort.xyz

## Installation

```
npm i sort-xyz
```

## Quick Start

```javascript
const { Sort }  = require('sort-xyz');

// initialize Sort client using free api key from sort.xyz
let sort = new Sort({ api_key: 'ce4c9316-f7ce-4955-b6b3-2292a8be7afa' });

let result = await sort.query("select * from ethereum_latest.transaction_log l where l.name = 'Nested' limit 10");
```

## Initialization

#### Import&#x20;

```javascript
const { Sort }  = require('sort-xyz');
```

#### Configure Client - API Key (Required)

```javascript
let sort = new Sort({api_key: 'ce4c9316-f7ce-4955-b6b3-2292a8be7afa' });
```

It's simple to create a free api key for Sort:

* Visit [sort.xyz](https://sort.xyz)
* Click 'login / signup'
* After signup, click avatar -> Account Home -> API Keys

#### Configure Client - Options

* api\_key - required
* namespace - optional

A namespace is used for storing historical decoded transactions available to the API and SQL queries. The namespace 'ethereum\_latest' is the default, and contains the last 7 days of decoded transactions.

* debug - optional

Output extra statements to help in debugging, such as SQL queries used by the Sort client.

#### Initialization example with all options

```javascript
let sort = new Sort({
    api_key: 'ce4c9316-f7ce-4955-b6b3-2292a8be7afa',
    namespace: 'user282222',
    debug: true 
});
```

## Latest decoded contract transactions&#x20;

```javascript
// get latest 100 transactions for the OpenSea Seaport contract
let result = await sort.contractTransactions(
  '0x00000000006c3852cbef3e08e8df289169ede581');

// get latest 10 transactions for the OpenSea Seaport contract
let result = await sort.contractTransactions(
  '0x00000000006c3852cbef3e08e8df289169ede581', 10);
```

| Parameter                                                                                                                                  | Default | Optional |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------- | -------- |
| **contract\_address** - the contract address to fetch decoded transactions for, by default, only transactions in the past 7 days are shown |         | no       |
| **limit** - number of results                                                                                                              | 100     | yes      |

## Latest decoded contract events / logs&#x20;

```javascript
// get latest 100 events/logs for the OpenSea Seaport contract
let result = await sort.contractEvents(
  '0x00000000006c3852cbef3e08e8df289169ede581');

// get latest 10 events/logs for the OpenSea Seaport contract
let result = await sort.contractEvents(
  '0x00000000006c3852cbef3e08e8df289169ede581', 10);
```

| Parameter                                                                                                                                | Default | Optional |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------- |
| **contract\_address** - the contract address to fetch decoded events/logs for, by default, only events/logs in the past 7 days are shown |         | no       |
| **limit** - number of results                                                                                                            | 100     | yes      |

## Run a SQL query

```javascript
// send a SQL query to sort

let result = await sort.query("select _id as hash, value_eth as amount, timestamp, t.function.params[1].value as punkId from ethereum_latest.transaction t where t.to = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb' and t.function.name = 'buyPunk' order by timestamp desc limit 100");
```

| Parameter                                                                                                                                                                                                                                         | Default | Optional |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------- |
| **query** - the SQL query to execute against the Sort in-memory column store. By default, decoded transactions for the past 7 days are queryable, to add historical transactions, please see [https://sort.xyz/pricing](https://sort.xyz/pricing) |         | no       |

## Run a SQL query by ID

```javascript
// query id obtained from the id at sort.xyz
// -> create a query on sort.xyz
// -> save the query
// -> obtain the query id from the URL: https://sort.xyz/query/<QUERY ID>

let result = await sort.queryById('62f7d1001a096c757ce8f355');
```

| Parameter                                                                    | Default | Optional |
| ---------------------------------------------------------------------------- | ------- | -------- |
| **queryid** - queryid of the query created and saved on the sort.xyz website |         | no       |

## Decoded transaction by hash

```javascript
let result = await sort.transaction("0x32ef066346ed78ceac0f6fdb888adf44819856564b8268985c3f09a68c8c4ddb");
```

| Parameter                                                       | Default | Optional |
| --------------------------------------------------------------- | ------- | -------- |
| **transaction\_hash** - hash of the transaction to view decoded |         | no       |

In the default namespace (ethereum\_latest), only transactions for the past 7 days are visible. To view historical transactions, a contract address for historical transactions must be specified in your account.&#x20;

## Decoded transaction events / logs by hash

```javascript
let result = await sort.transactionEvents("0x32ef066346ed78ceac0f6fdb888adf44819856564b8268985c3f09a68c8c4ddb");
```

| Parameter                                                               | Default | Optional |
| ----------------------------------------------------------------------- | ------- | -------- |
| **transaction\_hash** - hash of the transaction to view logs/events for |         | no       |

In the default namespace (ethereum\_latest), only transactions for the past 7 days are visible. To view historical transactions, a contract address for historical transactions must be specified in your account.&#x20;
