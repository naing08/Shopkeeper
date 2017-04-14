/**
 * Created by ChitSwe on 3/4/17.
 */
import update from 'react-addons-update';
const initialData = {
    errors:{},
    id:null,
    FullName:'',
    UserName:'',
    Photo:'',
    PhotoFormat:'',
    UserAccountId:null,
    createdAt:null,
    updatedAt:null
};

function validateUser(user){
    let {FullName,errors} = user;
    errors =errors? errors: {};
    let isValid = true;
    if(!FullName) {
        errors.FullName = "Full Name is required."
        isValid = false;
    }else
        errors.FullName="";
    return {isValid,errors};
}

const User=(state={edit:initialData,create:initialData,creating:false},action)=>{
    action.edit = action.edit? action.edit:initialData;
    switch(action.type){
        case 'USER_EDIT':
            let newUser=Object.assign({},state.edit,action.edit);
            newUser = Object.assign(newUser,validateUser(newUser));
            return update(state,{
                edit:{
                    $set:newUser
                }
            });
            break;
        case 'USER_CREATE':
            let createUser=Object.assign({},state.create,action.create);
            createUser = Object.assign(createUser,validateUser(createUser));
            return update(state,{
                create:{
                    $set:createUser
                }
            });
            break;
        case 'USER_CREATE_CARD_SHOW':
            return update(state,{creating:{$set:true}});
            break;
        case 'USER_CREATE_CARD_HIDE':
            return update(state,{creating:{$set:false}});
            break;  
        case 'USER_VALIDATE':
            return update(state,{
                edit:{
                    $set:Object.assign({},state.edit,validateUser(state.edit))
                },
                create:{
                    $set:Object.assign({},state.create,validateUser(state.create))
                }
            });
            break;
        default:
            return state;
    }
};

export {initialData};
export default User;