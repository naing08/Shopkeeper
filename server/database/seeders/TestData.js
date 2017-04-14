/**
 * Created by ChitSwe on 3/2/17.
 */
const models = require('../../models/index');
const faker = require('faker');
const seeder = {
    getRandomProductBrands:(brands)=>{
       let min = 0;
       let max = brands.length;
       let index=Math.floor(Math.random()*(max-min+1)+min);
       return brands[index];
    },
    productGroup:(t,parentGroup)=>{
        if(parentGroup)
            return parentGroup.createChildGroup({
                Alias:faker.lorem.word(),
                Name:faker.lorem.words()
            },{
                fields:['Alias','Name'],
                transaction:t
            });
        else
            return models.ProductGroup.create({
               Alias:faker.lorem.word(),
                Name:faker.lorem.words()
            },{
                fields:['Alias','Name'],
                transaction:t
            });
    },
    products:(t,productGroup,brand,count)=>{
        const promises = [];
        let c = count? count:20;
        for(var i = 0; i< c;i++){
            promises.push(
                seeder.product(t,productGroup,brand)
            );
        }
        return Promise.all(promises);
    },
    product:(t,productGroup,brand)=>{
        let promise = productGroup?
            productGroup.createProduct({
                Alias:faker.lorem.word(),
                Name:faker.lorem.words(),
                Price:faker.commerce.price(),
                Description:faker.lorem.paragraph()
            },{
                transaction:t,
                fields:['Alias','Name','Price','Description']
            }):
            models.Product.create(
                {
                    Alias:faker.lorem.word(),
                    Name:faker.lorem.words(),
                    Price:faker.commerce.price(),
                    Description:faker.lorem.paragraph()
                },{
                    transaction:t,
                    fields:['Alias','Name','Price','Description']
                }
            );
        if(brand)
            promise = promise.then(product=>{
                return seeder.productSpec(t,product).then(()=>{
                    return product.setProductBrand(brand);
                });
        });
        return promise;
    },
    productSpec:(t,product)=>{
        const promises = [];
        for(var i = 0; i<5;i++){
            let promise = product?
                product.createProductSpecification({
                    Name:faker.lorem.word(),
                    Value:faker.lorem.sentence()
                },{
                    fields:['Name','Value'],
                    transaction:t
                }):
                models.Product.create({
                    Name:faker.lorem.word(),
                    Value:faker.lorem.sentence()
                });
            promises.push(promise);
        }
        return Promise.all(promises);
    },
    productBrands:(t)=>{
        const promises = [];
        for(var i = 0;i<10;i++){
            promises.push(
                models.ProductBrand.create({
                    Alias:faker.lorem.word(),
                    Name:faker.lorem.words()
                },{
                    fields:['Alias','Name'],
                    transaction:t
                })
            );
        }
        return Promise.all(promises);
    },
    up:(queryInterface,Sequelize)=>{
        return queryInterface.sequelize.transaction(t=>{
            return seeder.productBrands(t)
                .then(brands=>{
                    const iPromises = [];
                    iPromises.push(seeder.products(t,null,seeder.getRandomProductBrands(brands),50));
                    for(var i=0;i<8;i++){
                        iPromises.push(
                            seeder.productGroup(t).then(iGroup=>{
                                const iiPromises=[];
                                iiPromises.push(seeder.products(t,iGroup,seeder.getRandomProductBrands(brands)));
                                for(var ii=0;ii<8;ii++){
                                    iiPromises.push(
                                        seeder.productGroup(t,iGroup).then(iiGroup=>{
                                            const iiiPromises=[];
                                            iiiPromises.push(seeder.products(t,iiGroup,seeder.getRandomProductBrands(brands)));
                                            for(var iii=0;iii<10;iii++){
                                                iiiPromises.push(
                                                    seeder.productGroup(t,iiGroup).then(iiiGroup=>{
                                                        return seeder.products(t,iiiGroup,seeder.getRandomProductBrands(brands));
                                                    })
                                                );
                                            }
                                            return Promise.all(iiiPromises);
                                        })
                                    );
                                }
                                return Promise.all(iiPromises);

                            })
                        );
                    }
                    return Promise.all(iPromises);
                });
        });
    },
    down:(queryInterface,Sequelize)=>{
        return models.Product.destroy({force:true,cascade:true,truncate:true})
            .then(()=>{
            return models.ProductGroup.destroy({force:true,cascade:true,truncate:true})
                .then(()=>{
                    return models.ProductBrand.destroy({force:true,cascade:true,truncate:true});
                });
            });
    }
};

module.exports = seeder;