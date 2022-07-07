const { useSubscription } = require("@apollo/client")

module.exports = {
    Query: {
        getAllProducts: async (_, args, context) => {
            return context.prisma.amazonProduct.findMany({
                include: {
                    attributes: {
                        include: {
                            attribute: true
                        }
                    }
                }
            })
        },
        getProduct: async (_, args, context, info) => {
            console.log(args)
            const where = args.filter ? {
                OR: [{ asin: { equals: args.filter } },],
            }
                : {}

            const prods = await context.prisma.amazonProduct.findMany({
                where,
            })
            return prods;
        },
        getAllAttributes: (_, args, context) => {
            console.log(context.prisma.attribute.findMany())
            return context.prisma.attribute.findMany({
                include: {
                    AmazonProducts: {
                        include: {
                            amazonProduct: true
                        }
                    }
                }
            })
        },
    },

    Mutation: {
        addAmazonProduct: async (_, args, context, info) => {
            const newProduct = context.prisma.amazonProduct.create({
                data: {
                    asin: args.asin,
                    name: args.name,
                    size: args.size,
                    weight: args.weight,
                    attributes: {
                        create: args.attributes.map(attrId => ({
                            attribute: {
                                connect: {
                                    id: parseInt(attrId)
                                }
                            }
                        }))
                    },
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
        },
        addAttributeToProduct: (_, args, context, info) => {
            const updateProd = context.prisma.amazonProduct.update({
                where: {
                    asin: args.asin
                }, 
                data: {
                    attributes: {
                        create: {
                            attribute: {
                                connect: {
                                    id: parseInt(args.attribute)
                                }
                            }
                        }
                    }
                }
            })
            return updateProd
        },
        deleteAttributeFromProduct: (_, args, context, info) => {
            const updateProd = context.prisma.amazonProduct.update({
                where: {
                    asin: args.asin
                }, 
                data: {
                    attributes: {
                        deleteMany:{
                            AttributeId: parseInt(args.attribute)
                        }
                    }
                }
            })
            return updateProd
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