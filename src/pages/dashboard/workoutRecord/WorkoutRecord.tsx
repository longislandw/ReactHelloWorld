import React, {useState} from "react";
import {PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Form,
    InputNumber,
    Modal,
    Radio,
    Space,
    Table,
    Typography,
    TimePicker, Popconfirm, Statistic, FormInstance,
} from "antd";
import Swal from "sweetalert2";
import {dateRangePresets, onDateRangeChange, RangePicker} from "component/ui/dataRangePicker/DateRangePicker";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
import {ColumnsType} from "antd/es/table/interface";
import {roundTo} from "utils/mathUtils";
dayjs.extend(isBetween)

interface WorkoutRecordPack {
    status: number
    data: WorkoutRecordData[]
    message: string
    code?: number
}

interface WorkoutRecordData {
    key:    number;
    row_id: number;
    index:  number;
    date?:  string;
    start_time?:string;
    end_time?:  string;
    cost:   number;
    points?:    number;
}

function calPointsSpent(start_time:string, end_time:string):number{
    // 計算使用掉的點數
    // 並非是實際點數而是根據開始與結束時間計算出來的推算點數
    let points_spent = 0
    let basic_fee = 1   // 基礎費用
    let extra_fee = 0.3 // 尖峰時段的額外費用(每分鐘)
    let date = dayjs(start_time).format('YYYY/MM/DD ')
    let sp_start = date + '18:00:00'
    let sp_end = date + '20:00:00'

    points_spent = dayjs(end_time).diff(start_time, 'minute') * basic_fee   // 基礎費用

    if (dayjs(start_time).isBetween(sp_start, sp_end, null, '[]')){
        // |start, end|
        if (dayjs(end_time).isBetween(sp_start, sp_end, null, '[]')){
            points_spent += dayjs(end_time).diff(start_time, 'minute') * extra_fee
        }
        // |start|end
        else {
            points_spent += dayjs(sp_end).diff(start_time, 'minute') * extra_fee
        }
    } else {
        // start|end|
        if (dayjs(end_time).isBetween(sp_start, sp_end, null, '[]')){
            points_spent += dayjs(end_time).diff(sp_start, 'minute') * extra_fee
        }
        else {
            // start||end
            if (dayjs(sp_start).isBetween(start_time, end_time, null, '[]')){
                points_spent += dayjs(sp_end).diff(sp_start, 'minute') * extra_fee
            }
            // start,end||start, end
            else {
                // no extra fee
            }
        }
    }
    if (isNaN(points_spent)) points_spent=0

    return Math.round(points_spent)
}

function processDataPack(data_pack:WorkoutRecordPack, para:{start:string, end:string}){
    // 處理從後端回傳的資料
    // 處理後得到
    // 1. 查詢到的新的表單資料
    // 2. 從新資料中計算得到的cost 資料
    // console.log(data_pack);
    if (data_pack !== undefined) {
        let newData = data_pack.data.filter((item)=>{
            let result = true
            if (para.start && item.date) result=result && dayjs(item.date, 'YYYY-MM-DD')>=dayjs(para.start, 'YYYY-MM-DD')
            if (para.end && item.date) result=result && dayjs(item.date, 'YYYY-MM-DD')<=dayjs(para.end, 'YYYY-MM-DD')
            return result
        })

        // 設定 index
        // 更新 total_cost, total_time, points_spent
        let total_money = 0
        let time = 0
        let actual_points = 0
        let cal_points = 0
        for (let i =0;i<newData.length;i++){
            // index
            newData[i].index = i

            // Cost
            let cost1= isNaN(newData[i].cost)?0:Number(newData[i].cost)
            total_money += cost1

            // Time, calPoints
            if (typeof newData[i].start_time != "undefined" && typeof newData[i].end_time != "undefined") {
                let cost2 = dayjs(newData[i].end_time).diff(dayjs(newData[i].start_time), 'minute')
                if (cost2>0) time += cost2
                cal_points += calPointsSpent(newData[i].start_time!, newData[i].end_time!)
            }

            // Actual Points
            if ((i-1) >= 0 && (typeof newData[i]?.points != "undefined")&& (typeof newData[i-1]?.points != "undefined")) {
                actual_points += newData[i-1].points! + newData[i].cost - newData[i].points!
            }
        }
        actual_points = roundTo(actual_points, 1)


        return  {
            data: newData,
            totalCost: {
                'cost': total_money,
                'time': time,
                'points_actual': actual_points,
                'points_cal': cal_points,
            }
        }
    } else {
        return null
    }
}
const WorkoutRecord:React.FC=()=>{
    const [insertForm] = Form.useForm();
    const [searchForm] = Form.useForm();
    const [modifyForm] = Form.useForm();
    const [cost, setCost] = useState(1);
    const [loading, setLoading] = useState(false);
    const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecordData[]>([])
    const [openPopupForm, setOpenPopupForm] = useState(false);
    const [modifyFormKey, setModifyFormKey] = useState<number>(NaN);
    const [totalCost, setTotalCost] = useState({
        'cost':0,
        'time':0,
        'points_actual':0,
        'points_cal':0,
    });
    const [searchParam, setSearchParam] = useState({
        start:dayjs().add(-1, 'month').format('YYYY-MM-DD'),
        end:dayjs().format('YYYY-MM-DD'),
    })

    async function insertRec  (values: any){
        setLoading(true);

        // console.log({
        //     action: 'insert',
        //     cost: values.cost,
        //     points: values.points,
        // })

        let url = "https://script.google.com/macros/s/AKfycbw2sQdscUlfVt7UkykCj8ptxGsRv2rR_SQtZRkeK1ZY_T_v7BUisCSbDmIccS15KFgw/exec"
        const response = await fetch(url,{
            method: 'POST',
            body: JSON.stringify({
                action: 'insert',
                cost: values.cost,
                points: values.points,
            })
        }).catch((error)=>{console.log(error)});

        if (response){
            let dataPack = await response.json();
            if (dataPack !== undefined) {
                let newData = processDataPack(dataPack, searchParam)
                if (newData){
                    // console.log(newData);
                    setWorkoutRecords(newData.data);
                    setTotalCost(newData.totalCost);
                }
            }
            let message = dataPack.message
            console.log(response.status)
            console.log(message)
            if (response.status===200){
                Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: '新增完畢',
                    text: message,
                    showConfirmButton: true,
                    timer: 1000
                })

            }else {
                console.log(response.status)
                Swal.fire({
                    icon: 'error',
                    title: response.status,
                    text: response.statusText,
                    footer: '請洽詢網站管理者尋求協助'
                })
            }
            setLoading(false);

        }else{
            console.log("Data Modify Failed")
            Swal.fire({
                icon: 'error',
                title: '連線失敗...',
                text: '請檢查網路狀況',
            })
            setLoading(false);
        }
    }

    async function modifyRec (key: number, form:FormInstance){
        setLoading(true);

        // 取得 要修改的資料
        const row = (await form.validateFields());
        let date = row.date;
        if (date){
            date = date.format('YYYY-MM-DD')
        }else{
            date = ''
        }
        let start_time = row.start_time
        if (start_time){
            start_time = start_time.format('YYYY-MM-DD HH:mm:ss')
        }
        else start_time = ''
        let end_time = row.end_time
        if (end_time){
            end_time = end_time.format('YYYY-MM-DD HH:mm:ss')
        } else end_time = ''

        // console.log(({
        //     action: 'update',
        //     row_id: key,
        //     date: date,
        //     start_time: start_time,
        //     end_time: end_time,
        //     cost: row.cost,
        //     points: row.points,
        // }))

        let url = "https://script.google.com/macros/s/AKfycbw2sQdscUlfVt7UkykCj8ptxGsRv2rR_SQtZRkeK1ZY_T_v7BUisCSbDmIccS15KFgw/exec"
        const response = await fetch(url,{
            method: 'POST',
            body: JSON.stringify({
                action: 'update',
                row_id: key,
                date: date,
                start_time: start_time,
                end_time: end_time,
                cost: row.cost,
                points: row.points,
            })
        }).catch((error)=>{console.log(error)});

        if (response){
            let dataPack = await response.json();
            if (dataPack !== undefined) {
                let newData = processDataPack(dataPack, searchParam)
                if (newData){
                    console.log(newData);
                    setWorkoutRecords(newData.data);
                    setTotalCost(newData.totalCost);
                }
            }
            let message = dataPack.message
            console.log(response.status)
            console.log(message)
            if (response.status===200){
                Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: '修改完畢',
                    text: message,
                    showConfirmButton: true,
                    timer: 1000
                })
            }else {
                console.log(response.status)
                Swal.fire({
                    icon: 'error',
                    title: response.status,
                    text: response.statusText,
                    footer: '請洽詢網站管理者尋求協助'
                })
            }
            setLoading(false);

        }else{
            console.log("Data Modify Failed")
            Swal.fire({
                icon: 'error',
                title: '連線失敗...',
                text: '請檢查網路狀況',
            })
            setLoading(false);
        }
    }

    async function deleteRec (row_ID:number){
        setLoading(true);
        console.log("Try to Delete ID: ", row_ID)

        let url = "https://script.google.com/macros/s/AKfycbw2sQdscUlfVt7UkykCj8ptxGsRv2rR_SQtZRkeK1ZY_T_v7BUisCSbDmIccS15KFgw/exec"
        const response = await fetch(url,{
            method: 'POST',
            body: JSON.stringify({
                action: 'delete',
                row_id: row_ID,
            })
        }).catch((error)=>{console.log(error)});

        if (response){
            let dataPack = await response.json();
            if (dataPack !== undefined) {
                let newData = processDataPack(dataPack, searchParam)
                if (newData){
                    console.log(newData);
                    setWorkoutRecords(newData.data);
                    setTotalCost(newData.totalCost);
                }
            }
            let message = dataPack.message
            console.log(response.status)
            console.log(message)
            if (response.status===200){
                Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: '刪除完畢',
                    text: message,
                    showConfirmButton: true,
                    timer: 1000
                })
            }else {
                console.log(response.status)
                Swal.fire({
                    icon: 'error',
                    title: response.status,
                    text: response.statusText,
                    footer: '請洽詢網站管理者尋求協助'
                })
            }
            setLoading(false);
        }else{
            console.log("Data Modify Failed")
            Swal.fire({
                icon: 'error',
                title: '連線失敗...',
                text: '請檢查網路狀況',
            })
            setLoading(false);
        }
    }

    async function getRec (values: any){
        console.log(values)
        setLoading(true);
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
        setSearchParam({
            start: start,
            end: end,
        })

        // 抓取資料
        let url = `https://script.google.com/macros/s/AKfycbw2sQdscUlfVt7UkykCj8ptxGsRv2rR_SQtZRkeK1ZY_T_v7BUisCSbDmIccS15KFgw/exec?dRange=${[start, end]}`
        console.log(url)
        fetch(url)
            .then((res) => res.json())
            .then(
                (dataPack: WorkoutRecordPack) => {
                    console.log(dataPack);
                    if (dataPack !== undefined) {
                        let newData = processDataPack(dataPack, {start:start, end:end})
                        if (newData){
                            console.log(newData);
                            setWorkoutRecords(newData.data);
                            setTotalCost(newData.totalCost);
                        }
                    }
                })
            .then(
                ()=> {
                    console.log("Fetch Data Succeed")
                    setLoading(false);
                },
                (reason)=>{
                    console.log("FetchData Failed")
                    Swal.fire({
                        icon: 'error',
                        title: reason.title,
                        text: reason.text,
                    }).then(r =>{setLoading(false)} )
                })
        ;
        // setLoading(false);
    }

    const columns: ColumnsType<WorkoutRecordData>= [
        {
            title: 'ID',
            dataIndex: 'row_id',
            key: 'row_id',
            width:'60px',
            align: "center",
            render:((value:number, record:WorkoutRecordData)=>{
                return <Typography.Link underline={true} onClick={() => {
                    setOpenPopupForm(true)
                    setModifyFormKey(value)
                    let newData= {...record, date:dayjs(record.date),start_time:dayjs(record.start_time), end_time:record.end_time?dayjs(record.end_time):record.end_time}
                    modifyForm.setFieldsValue(newData)
                }} >{value}</Typography.Link>
            })
        },
        {
            title: '筆數',
            dataIndex: 'index',
            key: 'index',
            width:'60px',
            align: "center",
            render:((value)=>value+1),
            defaultSortOrder: "descend",
            sortDirections:["ascend", "descend", "ascend"],
            sorter: (a, b)=>a.index-b.index,
        },
        {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            width:'120px',
            align: "center",
            render: ((value: any)=>{
                if (dayjs(value).isValid()){
                    value = dayjs(value).format('MM-DD')
                }
                return value
            }),
            sortDirections:["ascend", "descend", "ascend"],
            sorter: (a, b)=>dayjs(a.date).diff(b.date, 'day'),
            // sorter:true
        },
        {
            title: '開始',
            dataIndex: 'start_time',
            key: 'start_time',
            width:'120px',
            align: "center",
            render: ((value: any)=>{
                if (dayjs(value).isValid()){
                    value = dayjs(value).format('HH:mm:ss')
                }
                return value
            })
        },
        {
            title: '結束',
            dataIndex: 'end_time',
            key: 'end_time',
            width:'120px',
            align: "center",
            render: ((value: any)=>{
                if (dayjs(value).isValid()){
                    value = dayjs(value).format('HH:mm:ss')
                }
                return value
            })
        },
        {
            title: '時間',
            dataIndex: 'end_time',
            key: 'end_time',
            width:'70px',
            align: "center",
            render: (value, record) => {
                let time_spent = 0
                if (value){
                    time_spent = dayjs(value).diff(dayjs(record.start_time), 'minute')
                }
                return time_spent
            },
        },
        {
            title: '費用',
            dataIndex: 'cost',
            key: 'cost',
            width:'70px',
            align: "center",
        },
        {
            title: '目前點數',
            dataIndex: 'points',
            key: 'points',
            width:'100px',
            align: "center",
        },
        {
            title: '本次使用',
            dataIndex: 'points',
            key: 'points',
            width:'70px',
            align: "center",
            render: (value, record, index) =>{
                let points_spent = NaN
                let idx = record.index
                // 若有紀錄本次點數, 上次的點數有資料且不為零
                if (value && (idx-1) >= 0 && workoutRecords[idx-1].points){
                    let prv_point = workoutRecords[idx-1].points
                    if (prv_point){
                        // 使用點數為上次剩餘點數加上本次儲值, 扣除當前剩餘點數
                        points_spent = prv_point + record.cost - value
                    }
                }
                // else if (typeof record.start_time!= "undefined" && typeof record.end_time!= "undefined") {
                //     points_spent = calPointsSpent(record.start_time, record.end_time)
                // }
                points_spent = roundTo(points_spent, 1)
                return points_spent
            },
        },
        {
            title: '本次使用(估計)',
            dataIndex: 'points',
            key: 'points',
            width:'100px',
            align: "center",
            render: (value, record, index) =>{
                let points_spent = 0
                if (record.start_time && record.end_time) {
                    points_spent = calPointsSpent(record.start_time, record.end_time)
                }
                return points_spent
            },
        },
        {
            title: 'Delete',
            dataIndex: 'operation',
            width: '90px',
            align: "center",
            render: (_: any, record) => {
                return (
                    <span>
                        <Popconfirm title="確定刪除嗎?" okText={"確定"} cancelText={"取消"} onConfirm={()=>{deleteRec(record.row_id)}}>
                            <Typography.Link type={"danger"}>刪除</Typography.Link>
                        </Popconfirm>
                    </span>
                )
            },
        },
    ];

    async function handleOK(){
        setOpenPopupForm(false)
        await modifyRec(modifyFormKey, modifyForm)
    }
    function handleCancel(){
        setOpenPopupForm(false)
    }

    return(
        <>
            <Modal title={"ID: "+modifyFormKey} open={openPopupForm} onOk={handleOK} onCancel={handleCancel}>
                <Form form={modifyForm} layout={"vertical"}>
                    <Form.Item name='date' label='Date' style={{ margin: 0 }}>
                        <DatePicker allowClear={false} needConfirm={false}/>
                    </Form.Item>
                    <Form.Item name='start_time' label='Start Time' style={{ margin: 0 }}>
                        <TimePicker allowClear={false} needConfirm={false}/>
                    </Form.Item>
                    <Form.Item name='end_time' label='End Time' style={{ margin: 0 }}>
                        <TimePicker needConfirm={false}/>
                    </Form.Item>
                    <Form.Item name='cost' label='Cost' style={{ margin: 0 }}>
                        <InputNumber min={0}/>
                    </Form.Item>
                    <Form.Item name='points' label='Points' style={{ margin: 0 }}>
                        <InputNumber min={0}/>
                    </Form.Item>
                </Form>
            </Modal>
            <div
                style={{
                    margin: '5px 10px',
                    background: '#ffffff',
                    minHeight: 280,
                    padding: 24,
                    borderRadius: 10,
                    overflow: "auto",
                }}
            >
                <Space direction={"horizontal"} align={"center"} size={"middle"}>
                    <Statistic loading={loading} title={"總計花費"} value={totalCost.cost}></Statistic>
                    <Statistic loading={loading} title={"總計時間(分鐘)"} value={totalCost.time}></Statistic>
                    <Statistic loading={loading} title={"總計點數(實際)"} value={totalCost.points_actual}></Statistic>
                    <Statistic loading={loading} title={"總計點數(估算)"} value={totalCost.points_cal}></Statistic>
                </Space>

                <Form size={"small"} onFinish={insertRec} form={insertForm} >
                    <Form.Item name="cost" label="花喙" initialValue={0}>

                        <Radio.Group >
                            <Radio value={0}>0</Radio>
                            <Radio value={100}>100</Radio>
                            <Radio value={200}>200</Radio>
                            <Radio value={cost}>
                                <InputNumber
                                    min={1}
                                    value={cost}
                                    changeOnWheel={true}
                                    controls={false}
                                    onChange={(v)=> {
                                        if (v === null) v = 0
                                        setCost(v)
                                    }
                                    }/>
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name='points' label='順於Damn樹' initialValue={null}>
                        <InputNumber min={0}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type={"primary"} icon={<PlusOutlined />} loading={loading} htmlType="submit">
                            開鼠計入
                        </Button>
                    </Form.Item>

                </Form>

                <Form size={"small"} onFinish={getRec} form={searchForm} layout={"inline"} >
                    <Form.Item
                        name="dateRange"
                        label={<p style={{textAlign:"left", fontSize:14}}>茶型入奇區詹</p>}
                        initialValue={[dayjs().add(-1, 'month'), dayjs()]}>
                        <RangePicker allowEmpty={[true,true]} presets={dateRangePresets} onChange={onDateRangeChange} />
                    </Form.Item>
                    <Form.Item>
                        <Button type={"primary"} icon={<SearchOutlined />} loading={loading} htmlType="submit">
                            茶型
                        </Button>
                    </Form.Item>
                </Form>

                <Table
                    scroll={{ x: 1200, y: 300 }}
                    // style={{maxWidth:1280}}
                    // tableLayout={"fixed"}
                    // size={"middle"}
                    // bordered={true}
                    dataSource={workoutRecords}
                    columns={columns}
                    loading={loading}
                    pagination={{defaultPageSize: 30}}
                />

            </div>

        </>
    )
}

export default WorkoutRecord;