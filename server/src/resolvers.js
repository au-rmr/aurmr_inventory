const { useSubscription } = require("@apollo/client")

module.exports = {
    Query: {
       getAllProducts: () => `This is somethng`,
       getProduct: async (parent, args, context) => {
        return context.prisma.AmazonProduct.findMany()
       },
    }, 

    Mutation: {
        addAmazonProduct: (parent, args, context, info) => {
            const newProduct = context.prisma.AmazonProduct.create({
                data: {
                    asin: args.asin,
                    name: args.name,
                    size: args.size,
                    weight: args.weight
                },
            })
            return newProduct
        }, 
    },

    AmazonProduct: {
        id: (parent) => parent.id, 
        asin: (parent) => parent.asin,
        name: (parent) => parent.name,
        weight: (parent) => parent.weight,
        size: (parent) => parent.size
    }
}