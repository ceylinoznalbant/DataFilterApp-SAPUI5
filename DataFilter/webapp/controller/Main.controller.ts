import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import formatter from "../model/formatter";
import JSONModel from "sap/ui/model/json/JSONModel";
import Select from "sap/m/Select";
import ComboBox from "sap/m/ComboBox";
import Input from "sap/m/Input";
import CheckBox from "sap/m/CheckBox";
import Button from "sap/m/Button";
import Dialog from "sap/m/Dialog";

/**
 * @namespace com.myorg.filterapp.controller
 */
export default class Main extends BaseController {
	private MyModel = new JSONModel(); //default model
	private SearchModel = new JSONModel(); //aramadan sonra gelen model
	private ComboModel = new JSONModel(); //combobox
	private ShuffleModel = new JSONModel(); //shuffle tıkladıktsn sonra gelen model
	private fragmentModel =  new JSONModel(); //diğerlerinin modeli
	private genderModel = new JSONModel(); //gender model
	private myDialog = new Dialog();
	private filterOpModel = new JSONModel(); //operatöre göre filtreleme yaptıktan sonra gelen model
	private  filtered_type : string;
	public onInit() {

		this.MyModel.loadData("../jdata/MOCK_DATA.json") //dosya okuma

		let myView = this.getView();
		myView.setModel(this.MyModel);
		this.selectoption_cb();

			

	}
	public selectoption_cb(){
		
		const selectOptions = [

			{key: 'id' , value: 'ID'},
			
			{key: 'username' , value: 'Kullanıcı Adı'},
			
			{key: 'name' , value: 'Adı'},
			
			{key: 'surname' , value: 'Soyadı'},
			
			{key: 'email' , value: 'Eposta'},
			
			{key: 'gender' , value: 'Cinsiyet'},
			
			]
			this.ComboModel.setData(selectOptions);
			this.getView().setModel(this.ComboModel,"cm_model")
	}
	public selectoption_filtercb( idValue : string ){
		const filtered1 = {
			
			items:[{key: '>'},
			{key: '<'  },
			{key: '>=' },
			{key: '<=' },
			{key: '=' },
			{key: '!=' }
			],
			title: idValue ,
			visible:true,
		}
		const filtered2 = {	

			items:[
			{key: 'Female'  },
			{key: 'Male' },
			{key: 'Genderfluid' },				
			{key: 'Bigender' },
			{key: 'Agender' },
			{key: 'Genderqueer' }
			],
			visible:false,

			title: idValue ,
		}

		if (idValue === "gender"){
			console.log(filtered2);
			this.fragmentModel.setData(filtered2);	
		}
		else{
			console.log(filtered1);
			this.fragmentModel.setData(filtered1);	
		}
		this.getView().setModel(this.fragmentModel,"fm_model");


	} 
	public setShuffleNumber(array: any[]): void {
    	for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	filter_fonk(){

		let comboBoxSel = (this.getView().byId("combobox") as ComboBox).getSelectedKey();
		let inputFromUser = (this.getView().byId("search_value") as Input).getValue();
		let shuffled = (this.getView().byId("shuffleCheckbox") as CheckBox).getSelected();

		const filteredData = this.MyModel.getData().filter(
			(item: { [key: string ]: string | number }) => item[comboBoxSel] === inputFromUser);

		if(shuffled)
			this.setShuffleNumber(filteredData);
			

		this.SearchModel.setData(filteredData);
		this.getView().byId("table").setModel(this.SearchModel);
		
	}

	handleDelete (event: any) : void{
		//filtre shuffle kontrol et id ye göre silme yap sıkıntı çıkarırsa

		let oTable = event.getSource().getId();
		let substring =oTable.substring(oTable.length-1,oTable.length);
		let int_id: number = parseInt(substring);
		console.log(int_id);
		// let personid =(this.getView().byId("int_id"));
		this.MyModel.getData().splice(int_id,1);
		this.MyModel.setData(this.MyModel.getData());

		this.SearchModel.getData().splice(int_id,1);
		this.SearchModel.setData(this.SearchModel.getData());

		this.ShuffleModel.getData().splice(int_id,1);
		this.ShuffleModel.setData(this.ShuffleModel.getData());

	}
	filter_remaining(event: any) : void{

		let oTable = event.getSource().getId();
		let splitted =oTable.split("--",3);
		let Button_split = splitted[2];
		 this.filtered_type = Button_split.substring(7,Button_split.length);
		if (this.filtered_type == "gender") {
			this.selectoption_filtercb(this.filtered_type);
		}
		else{
			this.selectoption_filtercb(this.filtered_type);
		}
		this.getDialogBox();
		
	}
	afterFilter(){
		this.filteredToOperator();
		this.onClose();
	}
	
	filteredToOperator(){
		let comboBoxOp = (this.getView().byId("filteredbox") as ComboBox).getSelectedKey();
		let inputFromUser = (this.getView().byId("filter_value") as Input).getValue();
		if (comboBoxOp == "=") {
			const filteredData = this.MyModel.getData().filter(
				(item: { [key: string ]: string | number }) => item[this.filtered_type] === inputFromUser);
				this.filterOpModel.setData(filteredData);
				this.getView().byId("table").setModel(this.filterOpModel);
		}
		else if (comboBoxOp==">"){
			const filteredData = this.MyModel.getData().filter(
				(item: { [key: string ]: string | number }) => item[this.filtered_type] > inputFromUser);
				this.filterOpModel.setData(filteredData);
				this.getView().byId("table").setModel(this.filterOpModel);
		}
		else if (comboBoxOp==">="){
			const filteredData = this.MyModel.getData().filter(
				(item: { [key: string ]: string | number }) => item[this.filtered_type] >= inputFromUser);
				this.filterOpModel.setData(filteredData);
				this.getView().byId("table").setModel(this.filterOpModel);
		}
		else if (comboBoxOp=="<"){
			const filteredData = this.MyModel.getData().filter(
				(item: { [key: string ]: string | number }) => item[this.filtered_type] < inputFromUser);
				this.filterOpModel.setData(filteredData);
				this.getView().byId("table").setModel(this.filterOpModel);
		}
		
		else if (comboBoxOp=="<="){
			const filteredData = this.MyModel.getData().filter(
				(item: { [key: string ]: string | number }) => item[this.filtered_type] <= inputFromUser);
				this.filterOpModel.setData(filteredData);
				this.getView().byId("table").setModel(this.filterOpModel);
		}
		else if (comboBoxOp=="!="){
			const filteredData = this.MyModel.getData().filter(
				(item: { [key: string ]: string | number }) => item[this.filtered_type] != inputFromUser);
				this.filterOpModel.setData(filteredData);
				this.getView().byId("table").setModel(this.filterOpModel);
		}
	}

	getDialogBox(){
		const dialog_call = this.getView();
		let path : string = "com.myorg.filterapp.view.filter";
		this.myDialog = dialog_call.byId("dg_id") as Dialog;
		if (!this.myDialog) {
			this.myDialog = sap.ui.xmlfragment(dialog_call.getId(),
												path,
												this
			) as Dialog;
			dialog_call.addDependent(this.myDialog);
		}
		this.myDialog.open();
	}
	onClose(){
		this.myDialog.close();
		this.myDialog.destroy();
	}

	
}
