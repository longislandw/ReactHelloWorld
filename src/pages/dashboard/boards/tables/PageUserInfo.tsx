import React, {useState} from 'react';
import {Input, Button, Form, InputNumber,Space} from "antd";
import {dateRangePresets, onDateRangeChange, RangePicker} from "component/ui/dataRangePicker/DateRangePicker";
import TableUserInfo from "./TableUserInfo";
import userDataPack from "data/userInfo.json";
import Swal from "sweetalert2";
import dayjs from "dayjs";

export interface UserDataPack {
    status: number
    data: UserInfo[]
}

export interface UserInfo {
    key:    number;
    id:     string;
    name:   string;
    age:    number;
    dateOfBirth:  string;
    // dateOfBirth:  dayjs.Dayjs;
    address:      string;
    registerDate: string;
    // registerDate: dayjs.Dayjs;
    level:        string;
    interest:    string;
    memo: string;
}

export type updateDataFn<type>=(id:string, row:type)=>Promise<[status:number, response:string]>;

const PageUserInfo:React.FC<{ tableW: number }>=(props:{tableW:number})=>{
    const {tableW}= props;
    const [searchForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    // const [userDataPack, setUserDataPack] = useState<UserDataPack>();
    const [userData, setUserData] = useState<UserInfo[]>([])

    const doSearch = (values: any) => {
        // 處理時間元件(格式)
        let start = ""
        let end = ""
        if (values['dateRange']!=null){
            if(values['dateRange'][0]!=null){
                start = values['dateRange'][0].format('YYYY-MM-DD')
            }
            if(values['dateRange'][1]!=null){
                end = values['dateRange'][1].format('YYYY-MM-DD')
            }
        }

        // 建立要用來搜尋的資料
        const fieldValues = {
            'name': values['name'],
            'upperBond': values['upperBond'],
            'lowerBond': values['lowerBond'],
            'dateRange': [start, end],
        };

        // setSearch([fieldValues.upperBond, fieldValues.lowerBond, fieldValues.dateRange])
        console.log('Received values of form: ', fieldValues);
        getData(fieldValues.name,fieldValues.upperBond, fieldValues.lowerBond, fieldValues.dateRange)
    };

    const getData = (name:string, upBond:number,lowBond:number,dateRange:string[]) => {
        setLoading(true);
        const userinfodata = userDataPack
        if (userinfodata){
            if (userDataPack.status===200){
                let newData = userinfodata.data.filter((item)=>{
                    let result = true
                    if (name) result=result&& item.name.includes(name)
                    if (upBond) result=result&& item.age<upBond
                    if (lowBond) result=result&& item.age>lowBond
                    if (dateRange[0]) result=result&& dayjs(item.registerDate, 'YYYY-MM-DD')>dayjs(dateRange[0], 'YYYY-MM-DD')
                    if (dateRange[1]) result=result&& dayjs(item.registerDate, 'YYYY-MM-DD')<dayjs(dateRange[1], 'YYYY-MM-DD')
                    return result
                })
                // let newData2:UserInfo[]=[]
                // for(let i=0;i<newData.length;i++){
                //     newData2.push({...newData[i],dateOfBirth:dayjs(newData[i].dateOfBirth), registerDate:dayjs(newData[i].registerDate)})
                //     // newData[i].dateOfBirth= dayjs(newData[i].dateOfBirth)
                // }

                setTimeout(()=>{
                    setUserData(newData);
                    setLoading(false);
                },500)
            }else {
                console.log("FetchData Failed")
                Swal.fire({
                    icon: 'error',
                    title: userDataPack.status,
                    text: 'FetchData Failed',
                }).finally(()=>{setLoading(false)} )
            }
        }


        setTimeout(setLoading,1000,false)
        // setLoading(false);

        // let url = `http://192.168.8.16:8081/api/v1/totalLossPD?upB=${upBond}&lwB=${lowBond}&dRange=${dateRange}`
        // console.log(url)
        // fetch(url)
        //     .then((res) => res.json())
        //     .then(
        //         (data: UserDataPack) => {
        //             if (data !== undefined) {
        //                 setUser(data);
        //                 setShownData(data.data)
        //                 console.log(data);
        //             }
        //         })
        //     .then(
        //         ()=> {
        //             console.log("Fetch Data Succeed")
        //             setLoading(false);
        //         },
        //         ()=>{
        //             console.log("FetchData Failed")
        //             Swal.fire({
        //                 icon: 'error',
        //                 title: '連線失敗...',
        //                 text: '請檢查網路狀況，若仍無法連線請洽詢網站管理員',
        //             }).then(r =>{setLoading(false)} )
        //         })
        // ;

    }

    const updateData:updateDataFn<UserInfo>=async (id, row)=>{
        const newData = [...userData];
        if (newData){
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                // console.log(index)
                // console.log(item)
                // console.log(row)
                // console.log(newData)
                setUserData(newData);
                return [200,'edit succeed']
            } else {
                newData.push(row);
                setUserData(userData);
                return [200,'add succeed']
            }
        }else{
            return [404, 'data not exist']
        }


    }

    return(
        <>
            <Space direction={"vertical"} size={"middle"}>
                <h2 style={{marginBlockStart: 0, marginBlockEnd: 0}}>User Info Table</h2>
                <Form layout={"inline"} onFinish={doSearch} form={searchForm}>
                    <Form.Item name="name" label="名字">
                        <Input />
                    </Form.Item>
                    <Form.Item name="lowerBond" label="年齡高於">
                        <InputNumber min={0} formatter={(value) => `${value}歲`}/>
                    </Form.Item>

                    <Form.Item name="upperBond" label="年齡低於" >
                        <InputNumber min={0} formatter={(value) => `${value}歲`}/>
                    </Form.Item>

                    <Form.Item name="dateRange" label={<p style={{textAlign:"left", fontSize:14}}>註冊日期區間</p>}>
                        <RangePicker allowEmpty={[true,true]} presets={dateRangePresets} onChange={onDateRangeChange} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                        <Button type="primary" htmlType="submit">
                            查詢
                        </Button>
                        <Button onClick={() => { searchForm.resetFields();}}>
                            清空條件
                        </Button>
                        </Space>
                    </Form.Item>
                </Form>

                <TableUserInfo tableW={tableW} loading={loading} shownData={userData} updateUserInfoFn={updateData}/>
            </Space>
        </>
    )
}

export default PageUserInfo
