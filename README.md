# Getting started with the project
> Questions??: Feel free to contact Atharva Kashyap (atharva2@uw.edu)

## How to get the project onto local machine and run the app?

1. First, clone the repository onto your preferred folder inside your local machine. 
2. Then, `cd` into the repository folder on your local machine. 
3. If you wish to create a branch and work inside that branch, make sure you perform `git checkout -b "<your-branch-name>"`. This is to create a new branch. You can then perform `git status` to check if your branch was created successfully. 
4. Now, perform `yarn install`. This is to make sure all the `yarn` packages are installed into your local project. 
5. Then, change directory into `server`, which you can do by running `cd server`. 
6. Now, perform `yarn install` again inside the `server` folder to make sure to install necessary modules inside this folder. 
7. This should set-up your project on the local machine. You can now change directory by going back one level. You can do this by performing `cd ..`. Then, you should be able to run `yarn start` and a reactapp should get started on your web browser. 

## How to start graphql playground? 
For Your Information: graphql playground is something that runs on `localhost:4000` that provides a space for you to write and test out queries and mutations before making it official and adding it to your app. It also provides you a nice UI that prompts you suggestions when writing your queries and mutations. To get this working, please follow the steps below.

1. First, perform `cd server` so that you are in your `server` folder.
2. Then, perform `npx prisma generate`
3. Finally, perform `node src/index.js`

## Important things to keep in mind:
1. You should stop, run `npx prisma generate`, and then re-run `node src/index.js` after any edit within your `server` folder. Then refresh your playground to see changes. 
2. If you make any edits to `schema.prisma`, it is important to run `prisma migrate dev --name <give-your-migration-a-name>`. This is because you made some edits to your database and you want those changes to be reflected. 
3. The column names of models that you define in your schema must be exactly same as the models you define in your `graphql.schema`. In other words, the column names that you have for your prisma table needs to be exactly the same as the column names that you give to your graphql schema. 
4. *Extra (high-level) information about how the server side of things are working*: graphql serves to provide a "front-end" experience, which means this is what you use in the reactapp to query and get information from. graphql then contacts prisma through a mode called `resolvers.js`, which then contacts the database to obtain the data. 

## Schema Outline
Here is the link to the Schema file: [Schema](https://github.com/au-rmr/aurmr_inventory/blob/main/server/prisma/schema.prisma)

### AmazonProduct
Each row of this table keeps track of one Amazon Product. It has columns that keeps track of asin, size, weight, and list of [Attributes](#attribute).
```
model AmazonProduct {
  id           Int                      @id @default(autoincrement())
  createdAt    DateTime                 @default(now())
  asin         String                   @unique
  name         String
  size_length  Float?
  size_width   Float?
  size_height  Float?
  size_units   String?
  weight       Float?
  weight_units String?
  attributes   AmazonProductAttribute[]
  bins         ProductBin[]
}
```

### Attribute
Each row of this table keeps track of a particular attribute. The value of the attribute is unique. In other words, having two attributes with the name value is not possible. 
```
model Attribute {
  id             Int                      @id @default(autoincrement())
  value          String                   @unique
  AmazonProducts AmazonProductAttribute[]
}
```

### AmazonProductAttribute
Connects products to attributes. Each product can have multiple Attributes. 
```
model AmazonProductAttribute {
  AttributeId     Int
  AmazonProductId Int
  attribute       Attribute?     @relation(fields: [AttributeId], references: [id])
  amazonProduct   AmazonProduct? @relation(fields: [AmazonProductId], references: [id])

  @@id([AttributeId, AmazonProductId])
}
```

### Overview of Evaluation
> [Evaluation](#evaluation): An "Experiment" that has various [products](#amazonproduct) in various [bins](#bin) and various [picks](#pick). It can be thought of as a setup. 

> [Bin](#bin): Each row of this table keeps track of a BinId (as specified by the QR code stickers on the bins). It also keeps track of a list of [ProductBin](#ProductBin) combination of all the products inside the bin. 

> [ProductBin](#productbin): This keeps track of a Product, the bin its placed in, the evaluation for which it is part of, and a unique id. There can be multiple of the same product in the same bin (but each of them will have a unique id). 

> [Pick](#pick): A pick that specifies a particular ProductBin's unique id to simulate a pick. 

### Pick
```
model Pick {
  id              Int            @id @default(autoincrement())
  ProductBinId Int
  ProductFromBin ProductBin @relation(fields: [ProductBinId], references: [id])
  Outcome         Boolean?
  TimeTakenSec    Float?
}
```

### Bin
```
model Bin {
  id             Int            @id @default(autoincrement())
  BinId          String         @unique
  AmazonProducts ProductBin[]
}
```

### ProductBin 
```
model ProductBin {
  id Int @id @default(autoincrement())
  AmazonProductId Int
  binId        String
  evalId          Int
  amazonProduct   AmazonProduct? @relation(fields: [AmazonProductId], references: [id])
  bin             Bin?           @relation(fields: [binId], references: [BinId])
  evaluation      Evaluation?    @relation(fields: [evalId], references: [id])
  picks Pick[]
}
```

### Evaluation
```
model Evaluation {
  id    Int            @id @default(autoincrement())
  name  String         @unique
  Setup ProductBin[]
}
```

## Queries and Mutations Outline
Coming Soon...

## How to query the database from Python?
Coming Soon...
