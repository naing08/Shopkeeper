import React from 'react';
import FilePickerHidden from '../../../common/FilePickerHidden';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import PhotoManager from '../../../../common/PhotoManager';
import CircularProgress from 'material-ui/CircularProgress';

class PaymentSlipUploader extends React.Component{
	constructor(){
		super(...arguments);
		this.state={
			attachmentUrl:null,
			errorText:''
		}
	}
	onFileAccepted(accepted,rejected,e){
		let file = accepted[0];
		this.setState({attachmentUrl:file.preview});
		let {setUploadingStatus,setAttachment} = this.props;
		setUploadingStatus(true);
		PhotoManager.BankTransfer.upload(file)
		.then(({secure_url,format,public_id})=>{
			this.setState({attachmentUrl:secure_url});
			setAttachment(public_id);
			setUploadingStatus(false);
		}).catch(errors=>{
			setUploadingStatus(false);
			setAttachment("");
			this.setState({errorText:'Could not upload attachment.' + errors.message});
		});
	}
	render(){
		let {attachmentUrl} = this.state;
		let {className} = this.props;
		return (
				<div 
					className={className}
					onClick={()=>{this.filePickerHidden.click();}}
					style={{
						height:'200px',
						border:'1px solid rgb(167,168,169)',
						display:'flex',
						alignItems:'center',
						justifyContent:'center',
						margin:'16px 0'
					}}
				>
					{attachmentUrl? <img style={{maxWidth:'100%', maxHeight:'100%'}} src={attachmentUrl}/> : <div style={{fontSize:'18px',fontWeight:'300'}}>Click here to upload bank transfer slip.</div>}
					<FilePickerHidden ref={ el => this.filePickerHidden = el} multiple={false} accept="image/*" onFilesAccepted={this.onFileAccepted.bind(this)}/>
				</div>
			);
	}
}

export default compose(
		connect(
				state=>({SlipAttachment:state.Checkout.Payment.BankTransfer.Attachment}),
				dispatch=>({
					setAttachment:(attachment)=>{
						dispatch({type:'CHECKOUT_PAYMENT_BANKTRANSFER_EDIT',edit:{Attachment:attachment}})
					},
					setUploadingStatus:(status)=>{
						dispatch({type:'CHECKOUT_PAYMENT_BANKTRANSFER_EDIT',edit:{attachmentUploading:status}});
					}
				})
			)
	)(PaymentSlipUploader)