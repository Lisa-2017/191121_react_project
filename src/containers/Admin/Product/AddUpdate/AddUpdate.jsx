import React, { Component } from 'react'
import {Card,Button,Form,Input,Select, message} from 'antd'
import {connect} from 'react-redux'
import {saveCategoryAsync} from '@/redux/actions/category'
import {ArrowLeftOutlined} from '@ant-design/icons';
import {reqAddProduct} from '@/api'
import PictureWall from './PictureWall/PictureWall'
import RichText from './RichText/RichText'

const {Item} = Form
const {Option} = Select

@connect(
	state =>({categoryList:state.categoryList}),//映射状态
	{saveCategoryAsync}//映射操作状态的方法
)
class AddUpdate extends Component {

	onFinish = async(values)=>{
		values.imgs = this.refs.pictureWall.getImgNameArr()
		values.detail = this.refs.richText.getRichText()
		let result = await reqAddProduct(values)
		const {status,msg} = result
		if(status === 0) {
			message.success('商品添加成功')
			this.props.history.replace('/admin/prod_about/product')
		}
		else message.error(msg)
	}

	componentDidMount(){
		const {categoryList,saveCategoryAsync} = this.props
		if(categoryList.length === 0) saveCategoryAsync()
	}

	render() {
		return (
			<Card 
				title={
					<div>
						<Button 
							onClick={()=>{this.props.history.goBack()}}
							type="link"
						>
							<ArrowLeftOutlined/>返回
						</Button>	
						<span>添加商品</span>
					</div>
				}
			>
				<Form
					initialValues={{categoryId:''}}
					onFinish={this.onFinish}
				>
					<Item
						name="name"
						rules={[{required:true,message:'商品名称必须输入'}]}
						label="商品名称"
						wrapperCol={{span:6}}
					>
						<Input placeholder="商品名称"/>
					</Item>
					<Item
						name="desc"
						rules={[{required:true,message:'商品描述必须输入'}]}
						label="商品描述"
						wrapperCol={{span:6}}
					>
						<Input placeholder="商品描述"/>
					</Item>
					<Item
						name="price"
						rules={[{required:true,message:'商品价格必须输入'}]}
						label="商品价格"
						wrapperCol={{span:6}}
					>
						<Input 
							type="number"
							addonAfter="元" 
							addonBefore="￥" 
							placeholder="商品价格"
						/>
					</Item>
					<Item
						name="categoryId"
						rules={[{required:true,message:'必须选择一个分类'}]}
						label="所属分类"
						wrapperCol={{span:6}}
					>
						<Select>
							<Option value="">请选择分类</Option>
							{
								this.props.categoryList.map((categoryObj)=>{
									return <Option key={categoryObj._id} value={categoryObj._id}>{categoryObj.name}</Option>
								})
							}
						</Select>
					</Item>
					<Item
						label="商品图片"
						wrapperCol={{span:6}}
						style={{marginLeft:'12px'}}
					>
						<PictureWall ref="pictureWall"/>
					</Item>
					<Item
						label="商品详情"
						wrapperCol={{span:14}}
						style={{marginLeft:'12px'}}
					>
						<RichText ref="richText"/>
					</Item>
					<Item>
						<Button type="primary" htmlType="submit">提交</Button>
					</Item>
				</Form>	
			</Card>
		)
	}
}

export default AddUpdate
