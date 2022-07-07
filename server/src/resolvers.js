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
                include: {
                    attributes: {
                        include: {
                            attribute: true
                        }
                    }
                }
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
                    size_length: args.size_length,
                    size_width: args.size_width,
                    size_height: args.size_height,
                    size_units: args.size_units,
                    weight: args.weight,
                    weight_units: args.weight_units,
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
        weight_units: (parent) => parent.weight_units,
        size_length: (parent) => parent.size_length,
        size_width: (parent) => parent.size_width,
        size_height: (parent) => parent.size_height,
        size_units: (parent) => parent.size_units
    },

    Attribute: {
        id: (parent) => parent.id,
        value: (parent) => parent.value,
    },
}