# Warehouse Typescript Challenge

Typescript Challenge for medior/senior

> Build a warehouse packaging line.

Build packages based on the `orders` list found on the API.

- Build complete packages of required articles
    - Connect an invoice with total price & articles
- Produce a restocking list for items that will run out of stock soon
- Throw helpful warnings when orders are unable to be executed
- 💥BONUS💥: unit test your code with `jest`

### Requirements

- Solution must be in Typescript
- You can make use of the powerful JS/TS ecosystem
- No need to build an interface, output in console is fine
- Fork this repo, do your thing, and push to your public Github repo.

## Setting up

Run `npm install`.

## Run the data server

The data you need is provided via API. Run locally with `npm run serve`.

## Run your solution

Your solution should be runnable with `npm run start`.

## Run tests

Run tests with `npm run test`.

## Solution description

My idea was to skim through the orders list and create a package for each order sequentially. 
If we do not have enough items in the inventory for a package, we display a warning and skip this order altogether. 
In this process we also reduce the stock amount of the items successfully packed in a package. 

I used two HashMaps for this: `itemsByArticle` for quick inventory lookup and `orderItemCounts` for each order 
to keep track of how many items should be included in the current package. 
If there is an entry in the `orderItemCounts` where the stock amount is greater than in the corresponding entry 
in `itemsByArticle`, we cannot form this package. If there is no such entry, then we decrease the stock amount.

## TODO

- Better warning messages on insufficient items (display which type of item is insufficient)
- More tests on Packager.packageItems
- Return a list of skipped orders
