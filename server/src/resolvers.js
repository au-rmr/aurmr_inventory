const { useSubscription } = require("@apollo/client")

let products = [{}]

module.exports = {
    Query: {
       getAllProducts: (_, args, context) => {
        return context.prisma.amazonProduct.findMany()
       },
       getProduct: async (_, args, context, info) => {
        console.log(args)
        const where = args.filter ? {
            OR: [{asin: {equals: args.filter}},],
        }
        : {}
        
        const prods = await context.prisma.amazonProduct.findMany({
            where,
        })

        return prods;
       },
       getAllAttributes: (_, args, context) => {
        return context.prisma.attribute.findMany()
       },
    },

    Mutation: {
        addAmazonProduct: (_, args, context, info) => {
            const newProduct = context.prisma.amazonProduct.create({
                data: {
                    asin: args.asin,
                    name: args.name,
                    size: args.size,
                    weight: args.weight, 
                    attributes: args.attributes
                },
            })
            return newProduct
        }, 
        addAttribute: (_, args, context, info) => {
            
            const newAttribute = context.prisma.attribute.create({
                data: {
                    value: args.value
                },
            })
            console.log(newAttribute)
            return newAttribute
        }
    },

    AmazonProduct: {
        id: (parent) => parent.id, 
        asin: (parent) => parent.asin,
        name: (parent) => parent.name,
        weight: (parent) => parent.weight,
        size: (parent) => parent.size
    },

    Attribute: {
        id: (parent) => parent.id,
        value: (parent) => parent.value,
    },
}