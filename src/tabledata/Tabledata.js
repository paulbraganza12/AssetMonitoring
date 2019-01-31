/*Imports*/
import React,{Component} from 'react';
import './Tabledata.css';
import $ from 'jquery'
import ReactTooltip from 'react-tooltip';
import {Line,Bar} from 'react-chartjs-2';
import "./Graphdata.css";
/*Global Decalarations*/
const options=
{
    pan:{
        enabled:true,
        mode:'x'
    },
    zoom:{
        enabled:true,
        mode:'xy'
    }
}

var from,to,id,dates,idd;
var tempdata=[],chartData=[]
var TotalGaps,PacketLoss,totalPackets;

/*Class*/
class Tabledata extends Component{

    constructor(props){
        super(props);
        this.state={assetId:'',jsonObj:[],data:[],data1:[]};
        this.handleSubmit=this.handleSubmit.bind(this);//form submit
        this.handleAssetIdChange=this.handleAssetIdChange.bind(this);//input box
        this.handleDatetimeChange=this.handleDatetimeChange.bind(this);//datetime
        this.selectAll=this.selectAll.bind(this)//checkBox;
        this.Rowclick=this.Rowclick.bind(this)//Row Click
        this.filterData=this.filterData.bind(this)//filter
        this.setprev=this.setprev.bind(this)
    }

/*Event Handling Methods*/

    filterData(event)
    {
        var id=$('#fit').val();
        this.state.data=this.state.data1;
        tempdata=[];
        console.log(id);
        if(id=="A")
        {
            for(var i=0;i<this.state.data.length;i++)
            {
                if(this.state.data[i].mark_loc=='1')
                {
                    tempdata.push(this.state.data[i])
                }
            }
            this.setState({data : tempdata});
            this.state.data=this.state.data1;
        }
        if(id=="0")
        {
            this.setState({data :this.state.data1});
        }
        if(id=="B")
        {
            for(var i=0;i<this.state.data.length;i++)
            {
                if(this.state.data[i].mark_loss=='1')
                {
                    tempdata.push(this.state.data[i])
                }
            }
            this.setState({data : tempdata});
            this.state.data=this.state.data1;
        }
       
    }

    handleAssetIdChange(event)
    {
        this.setState({assetId:event.target.value});
        TotalGaps=0;
        PacketLoss=0;
        totalPackets=0;
        tempdata=[];
        idd='';
        chartData=[];
        this.setState({ chartData });
        this.setState({
            jsonObj:[],
            data:[],
            data1:[]            
        });
    }

    handleDatetimeChange(event)
    {
        this.setState({assetId:event.target.value});
        TotalGaps=0;
        PacketLoss=0;
        tempdata=[];
        totalPackets=0;
        idd='';
        chartData=[];
        this.setState({ chartData });
        this.setState({
            jsonObj:[],
            data:[],
            data1:[]            
        });
    }

    selectAll(event)
    {
        let ref = 'cdcd';

        if(!this.refs[ref].checked )
        {
            this.state.jsonObj=[];
            this.props.tableRowClickCallBack(this.state.jsonObj);
        }
        else{
            var temp=[];
            var item={};
            
            this.state.jsonObj=[];
            for(var i=0;i<this.state.data.length;i++){ 
                item={
                    "lat":parseFloat(this.state.data[i].lat),
                    "lng":parseFloat(this.state.data[i].long),
                }; 
                this.state.jsonObj.push(item);
                        
            }
            //console.log(this.state.jsonObj);
                this.props.tableRowClickCallBack(this.state.jsonObj);
        } 
    }

    setprev(event)
    {
        this.state.data=this.state.data1;
        this.setState({data : this.state.data});
    }

    
    Rowclick(row,i)
    {

        let ref = 'ref_' + i;
        var temp=[];
        var item={};
        item ["lat"] = parseFloat(row.lat);
        item ["lng"] = parseFloat(row.long);

        if(this.refs[ref].checked)
        {
           
            this.state.jsonObj.push(item);
            console.log(this.state.jsonObj)
           this.state.jsonObj=this.state.jsonObj.filter((x, i)=> {
            if (temp.indexOf(x.lat) < 0 &&(temp.indexOf(x.lng) < 0)) {
                temp.push(x.lat);
                temp.push(x.lng);
                return true;
            }
            return false;
            })
            //console.log(this.state.jsonObj);
            this.props.tableRowClickCallBack(this.state.jsonObj);
        }
        else
        {
            this.state.jsonObj.pop(item); 
            console.log(this.state.jsonObj);
            this.props.tableRowClickCallBack(this.state.jsonObj);
        }

     
       
    }

    handleSubmit(event)
    {
        chartData=[];
        this.setState({ chartData });
        this.setState({
            jsonObj:[],
            data:[],
            data1:[]            
        });
        this.props.tableRowClickCallBack(this.state.jsonObj);
        var dt=$('#dt').val();
        id=this.state.assetId;
        dates=dt.split('-');
        
        var date1=new Date(dates[0]);
        var date2=new Date(dates[1]);

        from=date1.getTime()/1000.0;
        to=date2.getTime()/1000.0;

        from=parseInt(from);
        to=parseInt(to);

        totalPackets=0;
        TotalGaps=0;
        PacketLoss=0;

        var url=`http://localhost:8000/`+id+'/'+from+'/'+to;
        console.log(url)
        fetch(url).
        then(response => 
            {
                if(!response.ok)
                {
                    throw Error("Network request failed")
                }
                return response
            }
        ).then(d => d.json()).
        then(d => {
         if(d!=null)
          {
           for(var i=0;i<d.length;i++){
            totalPackets=totalPackets+1;
               this.state.data.push(d[i])
               if(parseInt(this.state.data[i].flag_loss)==1)
               {
                 TotalGaps=TotalGaps+1
               }
               PacketLoss=PacketLoss+parseInt(this.state.data[i].loss)
            }
            //console.log(this.state.data);
            this.state.data1=this.state.data;
            //console.log(this.state.data1);
        } 
        else
        {
         alert("No Records Found");
        }

        chartData = {
            labels: this.state.data.map(k => k.tis),
            datasets: [
              {
                 fill: false,
                label: 'speed',
                data: this.state.data.map(d => d.speed),
                borderColor: 'rgb(10, 58, 135)',             
                backgroundColor: '#4FC3F7',
                borderCapStyle: 'butt',
              },
              {
               fill: false,
                label: 'Battery1',
                data: this.state.data.map(d => d.bs1),
                backgroundColor: '#1B5E20',              
                borderColor: '#00E676',
                borderCapStyle: 'butt', 
              },
              {
               fill: false,
                label: 'Battery2',
                data: this.state.data.map(d => d.bs2),
                backgroundColor: '#D81B60',              
                borderColor: '#F06292',
                borderCapStyle: 'butt', 
              },
              {
               fill: false,
                label: 'Battery3',
                data: this.state.data.map(d => d.bs3),
                backgroundColor: '#455A64',              
                borderColor: '#B0BEC5',
                borderCapStyle: 'butt', 
              }
            ]
          }
          this.setState({ chartData });         // alert(chartData); snivios code for chart here
                this.setState({
                  
              });
              //comment
              $('.page').html(''); 
              var trnum = 0 ;         
              var maxRows = 300;    
              var totalRows = $('#table-id').find('tr').length;  
              if(maxRows==0)
              {
                maxRows=totalRows;
              } 
      
             $('#table-id tr:gt(0)').each(function(){    
                trnum++;            
                if (trnum > maxRows ){        
                  $(this).hide();   
                }if (trnum <= maxRows ){
          
                $(this).show();}
             });
      
             if (totalRows > maxRows){    
                var pagenum = Math.ceil(totalRows/maxRows); 
                for (var i = 1; i <= pagenum ;){     
                $('.page').append('<li onChange={this.setprev} class="page-item" data-page="'+i+'">\
                              <a class="page-link">'+ i++ +'</a>\
                            </li>').show();
                }                    
            }
            
            $('.page li:first-child').addClass('active'); 
            $('.page li').on('click',function(e){   
                e.preventDefault();
                var pageNum = $(this).attr('data-page');  
                var trIndex = 0 ;             
                $('.page li').removeClass('active');  
                $(this).addClass('active');         
                 $('#table-id tr:gt(0)').each(function(){   
                  trIndex++;               
                  if (trIndex > (maxRows*pageNum) || trIndex <= ((maxRows*pageNum)-maxRows)){
                      $(this).hide();   
                    }else {$(this).show();}        
                 });                   
            });   
            //comment             
              }, () => {
                     this.setState({
                       requestFailed: true
                     })
                   })
                 event.preventDefault();
      }

    render(){

        var rows =this.state.data.map((row,index)=>{
            idd=this.state.data[0].assetID;
            return <tr className={'dataRow row'+row.mark_loss+' row_'+row.mark_loc}  id={'row'+row.flag} id="rowT" key={index} >
                <td className="td1 tc" align="center"><input className="ch" value="0" onClick={()=>this.Rowclick(row,index)} onChange={this.toggleChange} type="checkbox" ref={'ref_' + index} id={'ref_' + index} /></td>
                <td className="td1 lat" align="center">{row.lat}</td>
                <td className="td1 lon" align="center">{row.long}</td>
                <td className="td1" align="center">{row.tis_raw}</td>
                <td className="td1" align="center">{row.tis}</td>
                <td className="td1" align="center">{row.tis_diff}</td>
                <td className="td1" align="center">{row.speed} Km/h</td>
                <td className="td1 lon" align="center">{row.dist_delta}</td>
                <td className="td1" align="center">{row.bs1}</td>
                <td className="td1" align="center">{row.bs2}</td>
                <td className="td1" align="center">{row.bs3}</td>
                <td className="td1" align="center">{row.ign}</td>
                <td className="td1" align="center">{row.comment}</td>
              </tr>
            });


        return(

        <div>
            <div className="parent">
                <div className="formDiv">
                    <form onSubmit={this.handleSubmit}>
                    <input type="text" className="form-control formCompID col-3" value={this.state.assetId} onChange={this.handleAssetIdChange} placeholder="Asset ID"/>
                    <input type="text" id="dt" name="daterange" className="datetime formCompDate col-3" onChange={this.handleDatetimeChange}/>
                    <button type="submit" className="btn btn-primary col-2 formCompSearch">Search</button>
                    <a  href={"http://localhost:8000/"+idd+"/"+from+"/"+to+"/download"} ><button type="button" className="btn btn-primary col-2 formCompDownload">Download</button>
                    </a></form>
                </div>
                <div className="AssetInfoDiv">
                   <div className="AssetInfo1 col-3">
                    <b>Asset ID - </b><b className="asset">{idd}</b>
                    </div>
                   <div className="AssetInfo2 col-7">
                   <b className="col-4"> Total Packet : {totalPackets}</b><b className="col-4"> Total Gaps :  {TotalGaps}</b><b className="col-4"> Total Packet Loss :  {PacketLoss}</b>
                    </div>
                </div>
                <div className="AssetDataDiv">
                <table className="table table-bordered table-sm table-responsive-sm DataTable" id= "table-id">
                    <thead className="thead-default">
                        <tr>
                            <th><input id="CheckAll" ref={"cdcd"} onClick={this.selectAll} value="selectAll" type="checkbox" /></th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Timestamp</th>
                            <th>Timestamp(IST)</th>
                            <th>Time Gap</th>
                            <th>Speed</th>
                            <th>Distance Traveled</th>
                            <th data-tip data-for='v1'>V1</th>
                            <th data-tip data-for='v2'>V2</th>
                            <th data-tip data-for='v3'>V3</th>
                            <th data-tip data-for='ign'>Ign</th>
                            <th>Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
                </div>
                <div className="TableFoot">
                <div className="number col-12">
                        <select onChange={this.setprev} className  ="form-control selectBox col-4 " name="state" id="maxRows">
                            <option value="300" selected>300</option>
                            <option value="400">400</option>
                            <option value="500">500</option>
                            <option value="600">600</option>
                            <option value="0">All Entries</option>
                        </select>
                 </div>
                 <div className='paginationl'>
                        <ul className="pagination page">

                        </ul>       
                </div>
                 <div className="Filter">
                        <select onChange={this.filterData}  id="fit" className  ="form-control selectBox col-4 " name="state">
                            <option value="0" selected>No Filter</option>
                            <option value="A">Location Discrepancies</option>
                            <option value="B">Packet Gaps</option>
                        </select>
                 </div>
             </div>
            </div>

            <div className="parentGraph1"> 

                <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle mar" type="button" data-toggle="dropdown">Line
                </button>
                    <ul className="dropdown-menu">
                    <li className="bar-btn"><a>Bar</a></li>
                    </ul>
                </div>                 
                <Bar  data={this.state.chartData} options={options}  height="60%" /> 
                </div>
                <div className="parentGraph2">
                <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle  mar" type="button" data-toggle="dropdown">Bar
                    </button>
                    <ul className="dropdown-menu">
                    <li className="line-btn"><a>Line</a></li>
                    </ul>
                </div>   
                <Line  data={this.state.chartData} options={options} height="60%" />
                </div>
        
                    
                <ReactTooltip id='v1' type='light'>
                <span>Vehicle battery voltage</span>
                </ReactTooltip>
                <ReactTooltip id='v2' type='light'>
                <span>NU battery voltage</span>
                </ReactTooltip>
                <ReactTooltip id='v3' type='light'>
                <span> Ignition battery voltage</span>
                </ReactTooltip>
                <ReactTooltip id='ign' type='light'>
                <span> Vehicle ignition status</span>
                </ReactTooltip>
                    </div>

        );
        
    }
} 
export default Tabledata;