/**
 * Created by ChitSwe on 1/2/17.
 */
module.exports=(sequelize,DataTypes)=>{
    var ProductPhoto=sequelize.define("ProductPhoto",{
        IsThumbnail:DataTypes.BOOLEAN,
        Format:{
            type:DataTypes.STRING(10),
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'Format is required',
                },
                len:{
                    args:[[0,10]],
                    msg:'Need to be less than 10 char'
                }
            }
        },
        FileName:{
            type:DataTypes.STRING(255),
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'File name is required',
                },
                len:{
                    args:[[,0,255]],
                    msg:'Need to be less than 255 char'
                }
            }
        }
    });
    return ProductPhoto;
};