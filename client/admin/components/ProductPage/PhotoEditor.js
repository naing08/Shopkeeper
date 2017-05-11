/**
 * Created by ChitSwe on 1/31/17.
 */
import React,{PropTypes} from 'react';
import FilePickerHidden from '../../../common/FilePickerHidden';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ToggleStar from 'material-ui/svg-icons/Toggle/star';
import ContentClear from 'material-ui/svg-icons/Content/clear';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {photoInitialData} from '../../reducer/Product'
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import PhotoManager from '../../../../common/PhotoManager';
import {Card,CardHeader,CardActions,CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import {saveProductPhoto,setProductDefaultPhoto,deleteProductPhoto} from '../../apollo/Product';
class PhotoEditor extends React.Component{
    onFileAccepted(accepted,rejected,e){
        let photos = accepted.map((file,i)=>(Object.assign({},photoInitialData,{url:file.preview,ProductId:this.props.ProductId,uploading:true})));

        this.props.addPhoto(photos);

        accepted.reverse().forEach((file,i)=>{
            this.uploadPhoto(file,i);
        });
    }

    uploadPhoto(file,index){
        let {editPhoto,saveProductPhoto,ProductId} = this.props;
        editPhoto(index,{uploading:true});
        PhotoManager.Product.upload(file)
            .then(({secure_url,format,public_id})=>{
                saveProductPhoto(ProductId,{FileName:public_id,Format:format}).
                    then(result=>{
                        let {data} = result ? result : {};
                        let {savedPhoto} = data? data: {};
                        if(savedPhoto){
                            let {FileName,Format,id,url} = savedPhoto;
                            editPhoto(index,{FileName,Format,id,url,uploading:false,id});
                        }
                    }).catch(error=>{
                        editPhoto({uploading:false,errorText:error.message});
                    });
            }).catch((error)=>{
            editPhoto(index,{uploading:false,errorText:error.message});

        });
    }

    setDefaultPhoto(photo){
        if(photo.id){
            let {setProductDefaultPhoto,editPhoto,ProductId,Photo} = this.props;
            let index = Photo.indexOf(photo);
            editPhoto(index,{uploading:true});
            setProductDefaultPhoto(ProductId,photo.id).then(()=>{
                editPhoto(index,{uploading:false});
                this.props.setDefaultPhoto(photo);
            })
            .catch(error=>{
                editPhoto(index,{uploading:false,errorText:error.message});
            })
            
        }
    }

    deleteProductPhoto(index){
        let {deleteProductPhoto,ProductId,Photo,setDefaultPhoto,removePhoto,editPhoto} = this.props;
        let photo = Photo[index];
        editPhoto(index,{uploading:true})
        deleteProductPhoto(ProductId,photo.id).then(product=>{
            let {DefaultPhoto} = product;
            if(DefaultPhoto)
                setDefaultPhoto(product.DefaultPhoto)
            removePhoto(index);
        }).catch(error=>{
            editPhoto(index,{uploading:false,errorText:error.message});
        });
    }

    render(){
        let {Photo,removePhoto,DefaultPhotoId,style} = this.props;

        return (
            <Card style={Object.assign(style,{position:'relative'})}>
                <CardHeader title="Product Photo"/>
                <CardText>
                    <div className="row">
                        {
                            Photo.map((p,i)=>(
                                <div key={i} className="grid-item product-photo">
                                    <img src={p.url} style={{border:'1px solid #000'}}/>
                                    <FloatingActionButton mini={true} secondary={true} onClick={()=>{this.setDefaultPhoto(p);}} style={{position:'absolute',top:10,right:10}}>
                                        <ToggleStar style={{fill:DefaultPhotoId===p.id? this.props.muiTheme.palette.primary1Color:'white'}}/>
                                    </FloatingActionButton>
                                    <FloatingActionButton mini={true}  style={{position:'absolute',top:10,right:60}} onClick={()=>{this.deleteProductPhoto(i);}}>
                                        <ContentClear/>
                                    </FloatingActionButton>
                                    {p.uploading? <CircularProgress style={{position:'absolute',top:'50%',right:'50%',marginTop:'-20px',marginRight:'-20px'}}/>:null}
                                    {
                                        p.errorText?
                                        (<span
                                        style={{
                                            position:'absolute',
                                            left:'10px',
                                            bottom:'10px',
                                            right:'10px',
                                            height:'80px',
                                            backgroundColor:'#fff',
                                            color:'red',
                                            display:'block'
                                        }}
                                    >{p.errorText}</span>):null
                                    }
                                </div>
                            ))
                        }
                    </div>
                </CardText>
                <CardActions>
                    <FlatButton label="Add Photo(s)" primary={true}  onClick={()=>{this.filePickerHidden.click();}}/>
                    <FilePickerHidden ref={ el => this.filePickerHidden = el} multiple={true} accept="image/*" onFilesAccepted={this.onFileAccepted.bind(this)}/>
                </CardActions>
            </Card>
        );
    }
}

PhotoEditor.PropTypes={
    ProductId:PropTypes.number.isRequired,
    DefaultPhotoId:PropTypes.number.isRequired,
    Photo:PropTypes.arrayOf({
        FileName:PropTypes.string,
        Format:PropTypes.string,
        IsDefault:PropTypes.bool,
        IsThumbnail:PropTypes.bool,
        ProductId:PropTypes.number,
        url:PropTypes.string
    })
};

export default compose(
    muiThemeable(),
    connect(
        (state)=>({Photo:state.Product.photo}),
        (dispatch)=>({
            addPhoto:(photos)=>{
                dispatch({
                    type:'PRODUCT_PHOTO_ADD',
                    photo:photos
                });
            },
            removePhoto:(index)=>{
                dispatch({
                    type:'PRODUCT_PHOTO_DESTROY',
                    index
                });
            },
            editPhoto:(index,edit)=>{
                dispatch({
                    type:'PRODUCT_PHOTO_EDIT',
                    index,
                    edit
                });
            },
            setDefaultPhoto:(photo)=>{
                dispatch({
                    type:'PRODUCT_DEFAULT_PHOTO_EDIT',
                    DefaultPhoto:photo
                });
            }
        })
    ),
    saveProductPhoto,
    setProductDefaultPhoto,
    deleteProductPhoto
)(PhotoEditor);