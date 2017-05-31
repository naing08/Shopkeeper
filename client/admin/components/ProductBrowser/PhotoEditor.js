/**
 * Created by ChitSwe on 1/31/17.
 */
import React,{PropTypes} from 'react';
import FilePickerFabButton from '../../../common/FilePickerFabButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ToggleStar from 'material-ui/svg-icons/toggle/star';
import ContentClear from 'material-ui/svg-icons/content/clear';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {photoInitialData} from '../../reducer/Product'
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import PhotoManager from '../../../../common/PhotoManager';
import CircularProgress from 'material-ui/CircularProgress';
class PhotoEditor extends React.Component{
    onFileAccepted(accepted,rejected,e){
        let photos = accepted.map((file,i)=>(Object.assign({},photoInitialData,{url:file.preview,ProductId:this.props.ProductId,uploading:true})));

        this.props.addPhoto(photos);

        accepted.reverse().forEach((file,i)=>{
            this.uploadPhoto(file,i);
        });
    }

    uploadPhoto(file,index){
        this.props.editPhoto(index,{uploading:true});
        PhotoManager.Product.upload(file)
            .then(({secure_url,format,public_id})=>{
                this.props.editPhoto(index,{FileName:public_id,Format:format,url:secure_url,uploading:false});
            }).catch((error)=>{
            this.props.editPhoto(index,{uploading:false});
        });
    }

    setDefaultPhoto(photo){
        if(photo.id){
            this.props.setDefaultPhoto(photo.id);
        }
    }

    render(){
        let {Photo,removePhoto,DefaultPhotoId} = this.props;

        return (
            <div style={{position:'relative'}}>
                <div className="row">
                    {
                        Photo.map((p,i)=>(
                            <div key={i} className="grid-item product-photo">
                                <img src={p.url}/>
                                <FloatingActionButton mini={true} secondary={true} onClick={()=>{this.setDefaultPhoto(p);}} style={{position:'absolute',top:10,right:10}}>
                                    <ToggleStar style={{fill:DefaultPhotoId===p.id? this.props.muiTheme.palette.primary1Color:'white'}}/>
                                </FloatingActionButton>
                                <FloatingActionButton mini={true}  style={{position:'absolute',top:10,right:60}} onClick={()=>{removePhoto(i);}}>
                                    <ContentClear/>
                                </FloatingActionButton>
                                {p.uploading? <CircularProgress style={{position:'absolute',top:'50%',right:'50%',marginTop:'-20px',marginRight:'-20px'}}/>:null}
                            </div>
                        ))
                    }
                </div>
                <FilePickerFabButton onFilesAccepted={this.onFileAccepted.bind(this)} multiple={true} accept="image/*" style={{position:'absolute',bottom:10,right:10}} icon={<ContentAdd/>}/>
            </div>
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
        ()=>({}),
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
            setDefaultPhoto:(id)=>{
                dispatch({
                    type:'PRODUCT_EDIT',
                    edit:{DefaultPhoto:{id}}
                });
            }
        })
    )
)(PhotoEditor);