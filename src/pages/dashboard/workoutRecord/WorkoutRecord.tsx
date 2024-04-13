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
import {ColumnsType} from "antd/es/table/interface";

interface WorkoutRecordPack {
    status: number
    data: WorkoutRecordData[]
}

interface WorkoutRecordData {
    key:    number;
    row_id:     number;
    date?:   string;
    start_time?:string;
    end_time?:  string;
    cost:      number;
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
    const [totalCost, setTotalCost] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    async function insertRec  (values: any){
        setLoading(true);
        let url = "https://script.google.com/macros/s/AKfycbw2sQdscUlfVt7UkykCj8ptxGsRv2rR_SQtZRkeK1ZY_T_v7BUisCSbDmIccS15KFgw/exec"
        const response = await fetch(url,{
            method: 'POST',
            body: JSON.stringify({
                action: 'insert',
                cost: values.cost,
            })
        }).catch((error)=>{console.log(error)});

        if (response){
            let {message} = await response.json();
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
                // setIsRefresh(true)

            }else {
                console.log(response.status)
                Swal.fire({
                    icon: 'error',
                    title: response.status,
                    text: response.statusText,
                    footer: '請洽詢網站管理者尋求協助'
                })
            }

        }else{
            console.log("Data Modify Failed")
            Swal.fire({
                icon: 'error',
                title: '連線失敗...',
                text: '請檢查網路狀況',
            })
        }

        // 更新資料
        await getRec(searchForm.getFieldsValue(true))
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

        console.log(({
            action: 'update',
            row_id: key,
            date: date,
            start_time: start_time,
            end_time: end_time,
            cost: row.cost,
        }))

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
            })
        }).catch((error)=>{console.log(error)});

        if (response){
            let {message} = await response.json();
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

        }else{
            console.log("Data Modify Failed")
            Swal.fire({
                icon: 'error',
                title: '連線失敗...',
                text: '請檢查網路狀況',
            })
        }

        // 更新資料
        await getRec(searchForm.getFieldsValue(true))
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
            let {message} = await response.json();
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

        }else{
            console.log("Data Modify Failed")
            Swal.fire({
                icon: 'error',
                title: '連線失敗...',
                text: '請檢查網路狀況',
            })
        }
        // 更新資料
        await getRec(searchForm.getFieldsValue(true))
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

        // 抓取資料
        let url = `https://script.google.com/macros/s/AKfycbw2sQdscUlfVt7UkykCj8ptxGsRv2rR_SQtZRkeK1ZY_T_v7BUisCSbDmIccS15KFgw/exec?dRange=${[start, end]}`
        console.log(url)
        fetch(url)
            .then((res) => res.json())
            .then(
                (dataPack: WorkoutRecordPack) => {
                    console.log(dataPack);
                    if (dataPack !== undefined) {
                        let newData = dataPack.data.filter((item)=>{
                            let result = true
                            if (start && item.date) result=result&& dayjs(item.date, 'YYYY-MM-DD')>=dayjs(start, 'YYYY-MM-DD')
                            if (end && item.date) result=result&& dayjs(item.date, 'YYYY-MM-DD')<=dayjs(end, 'YYYY-MM-DD')
                            return result
                        })
                        setWorkoutRecords(newData);
                        console.log(newData);

                        // 更新total cost, total time
                        let sum = 0
                        let time = 0
                        for (let i =0;i<newData.length;i++){
                            // Cost
                            let cost1= isNaN(newData[i].cost)?0:Number(newData[i].cost)
                            sum += cost1

                            // Time
                            if (newData[i].start_time && newData[i].end_time) {
                                let cost2 = dayjs(newData[i].end_time).diff(dayjs(newData[i].start_time), 'minute')
                                if (cost2>0) time += cost2
                            }
                        }
                        setTotalCost(sum)
                        setTotalTime(time)
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
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width:'120px',
            align: "center",
            render: ((value: any)=>{
                if (dayjs(value).isValid()){
                    value = dayjs(value).format('YYYY-MM-DD')
                }
                return value
            })
            // sorter:true
        },
        {
            title: 'Start Time',
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
            title: 'EndTime',
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
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
            width:'70px',
            align: "center",
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

    function handleOK(){
        modifyRec(modifyFormKey, modifyForm)
        setOpenPopupForm(false)
    }
    function handleCancel(){
        setOpenPopupForm(false)
    }

    return(
        <><Modal title={"ID: "+modifyFormKey} open={openPopupForm} onOk={handleOK} onCancel={handleCancel} >
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
                    <InputNumber/>
                </Form.Item>
            </Form>
        </Modal>
            {/*<div className={"bg-gray-50 py-5 lg:py-16"}>*/}
                {/*<div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between"}>*/}
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
                <Space direction={"vertical"} align={"center"} size={"small"}>
                    <Space direction={"horizontal"} align={"center"} size={"middle"}>
                        <Space direction={"vertical"} >
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
                                <Form.Item>
                                    <Button type={"primary"} icon={<PlusOutlined />} loading={loading} htmlType="submit">
                                        開鼠計入
                                    </Button>
                                </Form.Item>

                            </Form>

                            <Form size={"small"} onFinish={getRec} form={searchForm} layout={"inline"} >
                                <Form.Item name="dateRange" label={<p style={{textAlign:"left", fontSize:14}}>茶型入奇區詹</p>} initialValue={[dayjs().add(-30, 'd'), dayjs()]}>
                                    <RangePicker allowEmpty={[true,true]} presets={dateRangePresets} onChange={onDateRangeChange} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type={"primary"} icon={<SearchOutlined />} loading={loading} htmlType="submit">
                                        茶型
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Space>

                        <Statistic loading={loading} title={"總計花費"} value={totalCost}></Statistic>
                        <Statistic loading={loading} title={"總計時間(分鐘)"} value={totalTime}></Statistic>
                    </Space>

                    <Table
                        dataSource={workoutRecords}
                        columns={columns}
                        loading={loading}
                    />
                </Space>

            </div>

        </>
    )
}

export default WorkoutRecord;