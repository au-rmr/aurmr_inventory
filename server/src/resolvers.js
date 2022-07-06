const { useSubscription } = require("@apollo/client")

let products = [{}]

module.exports = {
    Query: {
       getAllProducts: async (_, args, context) => {
        console.log((await context.prisma.amazonProduct.findMany({
            include: {
                attributes: {
                    select: {
                        attribute: {
                            select: {
                                value: true
                            }
                        }
                    }
                }
            }            
        })))
        return context.prisma.amazonProduct.findMany({
            include: {
                attributes: {
                    select: {
                        attribute: {
                            select: {
                                value: true
                            }
                        }
                    }
                }
            }            
        })
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
        console.log(context.prisma.attribute.findMany())
        return context.prisma.attribute.findMany()
       },
    },

    Mutation: {
        addAmazonProduct: async (_, args, context, info) => {
            // console.log(context.prisma.attribute)
            // const a = await context.prisma.attribute.findMany({
            //     where: {
            //         id: {in: args.attributes.map(parseInt)},
            //     }
            // });
            // console.log(a[0].id);
            // console.log(await context.prisma.amazonProduct.create({
            //     data: {
            //         asin: args.asin,
            //         name: args.name,
            //         size: args.size,
            //         weight: args.weight,
            //         attributes: await context.prisma.attribute.findMany({
            //             where: {
            //                 id: {in: a[0].id},
            //             }
            //         }),
            //     },
            // }))
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