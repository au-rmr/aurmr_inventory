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
                    bins: {
                        include: {
                            bin: true,
                            evaluation: true
                        }
                    },

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
                OR: args.attributes.map(attrId => ({ id: { equals: parseInt(attrId) } }),),
            }
                : {}
            const allProds = context.prisma.attribute.findMany({
                where,
                include: {
                    AmazonProducts: {
                        include: {
                            amazonProduct: true
                        }
                    }
                }
            })
            return allProds
        },

        getAllEvals: (_, args, context) => {
            const evals = context.prisma.evaluation.findMany({
                include: {
                    Setup: {
                        include: {
                            amazonProduct: true,
                            bin: true,
                            picks: {
                                include: {
                                    ProductFromBin: {
                                        include: {
                                            amazonProduct: true,
                                            bin: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            return evals
        },

        getOneEval: async (_, args, context) => {
            const evals = context.prisma.evaluation.findMany({
                where: {
                    name: args.evalName,
                },
                include: {
                    Setup: {
                        include: {
                            amazonProduct: true,
                            bin: true,
                            picks: {
                                include: {
                                    ProductFromBin: {
                                        include: {
                                            amazonProduct: true,
                                            bin: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            return evals
        },

        getAmazonProductFromBinEval: async (_, args, context) => {
            const prods = context.prisma.productBin.findMany({
                where: {
                    AND: [
                        {
                            bin: {
                                BinName: {
                                    equals: args.binName
                                },
                                TableName: {
                                    equals: args.tableName
                                }                                
                            }
                        },
                        {
                            evaluation: {
                                name: {
                                    equals: args.evalName
                                }
                            }
                        }
                    ]
                },
                include: {
                    bin: true,
                    evaluation: true,
                    amazonProduct: true
                }
            })
            return prods;
        },

        getAmazonProductFromBinIdEval: async (_, args, context) => {
            const prods = context.prisma.productBin.findMany({
                where: {
                    AND: [
                        {
                            bin: {
                                BinId: {
                                    equals: args.binId
                                },
                                TableName: {
                                    equals: args.tableName
                                }                                
                            }
                        },
                        {
                            evaluation: {
                                name: {
                                    equals: args.evalName
                                }
                            }
                        }
                    ]
                },
                include: {
                    bin: true,
                    evaluation: true,
                    amazonProduct: true
                }
            })
            return prods;
        },

        getAmazonProductFromEval: (_, args, context) => {
            const prods = context.prisma.productBin.findMany({
                where: {
                    evaluation: {
                        name: args.evalName
                    }, 
                    amazonProduct: {
                        asin: args.asin
                    }
                }, 
                include: {
                    amazonProduct: true, 
                    bin: true
                }
            })
            return prods;
        },

        getProductBinFromAmazonProductBinEval: (_, args, context) => {
            const prodBins = context.prisma.productBin.findMany({
                where: {
                    bin: {
                        BinId: args.binId
                    },
                    evaluation: {
                        name: args.evalName
                    },
                    amazonProduct: {
                        asin: args.asin
                    },
                }
            })
            return prodBins;
        },

        getAllBins: (_, args, context) => {
            const bins = context.prisma.bin.findMany({
                include: {
                    AmazonProducts: {
                        include: {
                            amazonProduct: {
                                include: {
                                    bins: {
                                        include: {
                                            evaluation: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            return bins
        },

        getBinByTable: (_, args, context) => {
            const bins = context.prisma.bin.findMany({
                where: {
                    TableName: args.tableName
                },
                include: {
                    AmazonProducts: {
                        include: {
                            amazonProduct: {
                                include: {
                                    bins: {
                                        include: {
                                            evaluation: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                } 
            })
            return bins
        },

        getPicksFromProductBin: (_, args, context) => {
            const picks = context.prisma.pick.findMany({
                where: {
                    ProductBinId: args.ProductBinId
                },
                include: {
                    ProductFromBin: {
                        include: {
                            bin: {
                                select: {
                                    BinName: true
                                }
                            }
                        }
                    }
                }
            })
            return picks;
        },

        getBinByBinNameTable: (_, args, context) => {
            const bin = context.prisma.bin.findFirst({
                where: {
                    TableName: args.tableName,
                    BinName: args.binName
                }
            })
            return bin;
        }, 

        getBinByBinId: (_, args, context) => {
            const bin = context.prisma.bin.findFirst({
                where: {
                    BinId: args.binId
                }, 
                include: {
                    AmazonProducts: {
                        include: {
                            amazonProduct: true
                        }
                    }
                }
            })
            return bin;
        }
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

            const delRelationBin = context.prisma.productBin.deleteMany({
                where: {
                    AmazonProductId: parseInt((await context.prisma.amazonProduct.findMany({
                        where: {
                            asin: args.asin
                        }
                    }))[0].id)
                }
            })

            const delAttr = context.prisma.amazonProduct.delete({
                where: {
                    asin: args.asin
                }
            })

            const transaction = context.prisma.$transaction([delRelation, delRelationBin, delAttr])

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
            const addPick = context.prisma.pick.create({
                data: {
                    Outcome: args.Outcome,
                    TimeTakenSec: args.TimeTakenSec,
                    ProductFromBin: {
                        connect: {
                            id: args.ProductBinId
                        }
                    }
                },
                include: {
                    ProductFromBin: {
                        include: {
                            amazonProduct: true,
                            bin: true,
                            evaluation: true
                        }
                    }
                }
            })
            return addPick
        },

        addPickWithOnlyProdBin: async (_, args, context, info) => {
            const addPick = context.prisma.pick.create({
                data: {
                    ProductFromBin: {
                        connect: {
                            id: args.ProductBinId
                        }
                    }
                },
                include: {
                    ProductFromBin: {
                        include: {
                            amazonProduct: true,
                            bin: true,
                            evaluation: true
                        }
                    }
                }
            })
            return addPick
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
                    BinId: args.BinId,
                    BinName: args.BinName,
                    TableId: args.TableId,
                    TableName: args.TableName, 
                    depth: args.depth,
                    width: args.width, 
                    height: args.height, 
                    dimensions_units: args.units
                }
            })
            return addBin
        },

        addProdToBin: async (_, args, context, info) => {
            const prodToBin = context.prisma.productBin.create({
                data: {
                    amazonProduct: {
                        connect: {
                            asin: args.asin
                        }
                    },
                    bin: {
                        connect: {
                            BinId: args.binId
                        }
                    },
                    evaluation: {
                        connectOrCreate: {
                            where: {
                                name: args.evalName
                            },
                            create: {
                                name: args.evalName
                            }
                        }
                    }
                },
                include: {
                    bin: true
                }
            })
            return prodToBin
        },

        deleteProdFromBin: async (_, args, context, info) => {
            const prodFromBin = context.prisma.productBin.delete({
                where: {
                    id: parseInt(args.id)
                }
            })
            return prodFromBin
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