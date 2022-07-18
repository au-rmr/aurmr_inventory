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
                    }, 
                    picks: true
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

        filterProdByAttr: (_, args, context) => {
            console.log(args.attributes)
            const where = args.attributes ? {
                OR: args.attributes.map(attrId => [{
                    attributes: {
                        attribute: { equals: parseInt(attrId) }
                    }
                }])
            }
                : {}
            const prods = context.prisma.amazonProduct.findMany({
                where,
                include: {
                    attributes: {
                        include: {
                            attribute: true
                        }
                    }
                }
            })
            return prods
        }, 

        getAllEvals: (_, args, context) => {
            const evals = context.prisma.evaluation.findMany({})
            return evals
        }, 

        getAllBins: (_, args, context) => {
            const bins = context.prisma.bin.findMany({
                include: {
                    AmazonProducts: {
                        include: {
                            amazonProduct: true
                        }
                    }
                }
            })
            return bins
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
                        deleteMany: {
                            AttributeId: parseInt(args.attribute)
                        }
                    }
                }
            })
            return updateProd
        },

        updateSize: (_, args, context, info) => {
            const updateProd = context.prisma.amazonProduct.update({
                where: {
                    asin: args.asin
                },
                data: {
                    size_length: args.size_length,
                    size_height: args.size_height,
                    size_width: args.size_width,
                    size_units: args.size_units,
                }
            })
            return updateProd
        },

        updateWeight: (_, args, context, info) => {
            const updateProd = context.prisma.amazonProduct.update({
                where: {
                    asin: args.asin
                },
                data: {
                    weight: args.weight,
                    weight_units: args.weight_units,
                }
            })
            return updateProd
        },

        deleteProduct: async (_, args, context, info) => {
            const delRelation = context.prisma.amazonProductAttribute.deleteMany({
                where: {
                    AmazonProductId: parseInt((await context.prisma.amazonProduct.findMany({
                        where: {
                            asin: args.asin
                        }
                    }))[0].id)
                }
            })
            const delProd = context.prisma.amazonProduct.delete({
                where: {
                    asin: args.asin
                }
            })

            const transaction = context.prisma.$transaction([delRelation, delProd])

            return transaction
        },

        deleteAttribute: async (_, args, context, info) => {
            const delRelation = context.prisma.amazonProductAttribute.deleteMany({
                where: {
                    AttributeId: parseInt((await context.prisma.attribute.findMany({
                        where: {
                            id: parseInt(args.attribute)
                        }
                    }))[0].id)
                }
            })
            const delAttr = context.prisma.attribute.delete({
                where: {
                    id: parseInt(args.attribute)
                }
            })

            const transaction = context.prisma.$transaction([delRelation, delAttr])

            return transaction
        },

        addPick: async (_, args, context, info) => {
            const updateProd = context.prisma.amazonProduct.update({
                where: {
                    asin: args.asin
                },
                data: {
                    picks: {
                        create: {
                            Outcome: args.Outcome,
                            TimeTakenSec: args.TimeTakenSec,
                        }
                    }
                }
            })
            return updateProd
        }, 

        addEval: async (_, args, context, info) => {
            const addeval = context.prisma.evaluation.create({
                data: {
                    name: args.name, 
                }
            })
            return addeval
        }, 

        createBin: async (_, args, context, info) => {
            const addBin = context.prisma.bin.create({
                data: {
                    BinId: args.BinId
                }
            })
            return addBin
        }, 

        addProdToBin: async (_, args, context, info) => {
            const prodToBin = context.prisma.productBin.create({
                data: {
                    AmazonProductId: parseInt((await context.prisma.amazonProduct.findMany({
                        where: {
                            asin: args.asin
                        }
                    }))[0].id), 
                    binId: args.binId, 
                    evalId: parseInt((await context.prisma.evaluation.findMany({
                        where: {
                            name: args.evalName
                        }
                    }))[0].id)
                }
            })
            return prodToBin
        }, 


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