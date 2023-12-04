import {useState} from "react";
import dayjs from "dayjs";
import {
    ConfigProvider,
    Col,
    Row,
    Typography,
    Input,
    InputNumber,
    Button,
    DatePicker,
    Popconfirm,
    Modal,
    Form, FormInstance,
    Table,
} from 'antd';
import type {TableProps} from 'antd/es/table';
import {PlusOutlined} from "@ant-design/icons";
import Swal from "sweetalert2";
import {onExportBasicExcel} from "component/excelExport/ExcelExport";
import {EditableColumnsType} from "component/types";
import {updateDataFn, UserInfo} from "./PageUserInfo";

const { TextArea } = Input;
const tableProps: TableProps<UserInfo> = {
    tableLayout: "fixed",
    pagination: {position:["bottomRight"]},
    bordered: true,
    // size: "small",
    sortDirections: ["ascend","descend", "ascend"],
    // style: {width: "1200px"},
    // scroll : {x: '100vw'},
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    required?: boolean;
    inputType: 'number' | 'text' | 'date' | 'string';
    record: UserInfo;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({editing, dataIndex, title, required,
                                                       inputType, record,
                                                       index, children,
                                                       ...restProps
                                                   }) => {
    let inputNode:React.ReactNode
    switch (inputType){
        case "number":
            inputNode = <InputNumber />
            break
        case "string":
            inputNode = <Input/>
            break
        case "text":
            inputNode = <TextArea/>
            break
        case "date":
            inputNode = <DatePicker/>
            break
        default:
            inputNode = <Input/>
    }

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    // id={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: required,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


const TableUserInfo=(props:{tableW:number, loading:boolean, shownData: UserInfo[], updateUserInfoFn:updateDataFn<UserInfo>})=>{
    const {tableW, loading, shownData,updateUserInfoFn} = props;
    const [form] = Form.useForm();
    const [popupForm] = Form.useForm();
    const [openPopupForm, setOpenPopupForm] = useState(false);
    const [editingKey, setEditingKey] = useState<number>(-1);
    const [popupFormKey, setPopupFormKey] = useState<string>('');

    const isEditing = (record: UserInfo) => record.key === editingKey;

    const edit = (record: Partial<UserInfo> & { key: React.Key }) => {
        let newData= {...record,dateOfBirth:dayjs(record.dateOfBirth), registerDate:dayjs(record.registerDate)}
        form.setFieldsValue({ ...newData });
        // console.log(record.id)
        if (record.key) setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey(-1);
    };

    const addRow=async ()=>{
        try {
            let max = -1
            for (let i =0;i<shownData.length;i++){
                let comp= parseInt(shownData[i].id)
                if (!Number.isNaN(comp) && comp>max)max=comp
            }
            let id = String(max+1).padStart(4,"0")
            let registerDate= dayjs().format('YYYY-MM-DD')
            let level = 'Rookie'

            const newRow = {
                id: id,
                key: max+1,
                name: "Default",
                // age: 0,
                // dateOfBirth: "",
                // address: "",
                registerDate: registerDate,
                level: level,
                interest: "",
                memo: ""
            }

            const res =await updateUserInfoFn(id, newRow)
            if (res[0]===200){
                Swal.fire({
                    icon: 'success',
                    title: '新增成功',
                    showConfirmButton: true,
                    timer: 1000
                }).then(()=>{return 0})
            }else{
                Swal.fire({
                    icon: 'error',
                    title: res[0],
                    text: res[1],
                    footer: '請洽詢網站管理者尋求協助'
                })
            }
        }
        catch (errInfo){
            console.log('Add Row Failed:', errInfo);
            Swal.fire({
                icon: 'error',
                title: '新增欄位失敗' ,
                text: errInfo as string,
                footer: '請洽詢網站管理者尋求協助'
            }).then(()=>{return -1})
        }
    }

    const save = async (key: string, form:FormInstance) => {
        try {
            const row = (await form.validateFields());
            let newData= {...row}
            if (row.dateOfBirth) newData.dateOfBirth=(row.dateOfBirth as dayjs.Dayjs).format('YYYY-MM-DD')
            if (row.registerDate) newData.registerDate=(row.registerDate as dayjs.Dayjs)?.format('YYYY-MM-DD')

            const res =await updateUserInfoFn(key,newData)
            if (res[0]===200){
                Swal.fire({
                    icon: 'success',
                    title: '儲存成功',
                    showConfirmButton: true,
                    timer: 1000
                }).then(()=>{return 0})
            }else{
                Swal.fire({
                    icon: 'error',
                    title: res[0],
                    text: res[1],
                    footer: '請洽詢網站管理者尋求協助'
                })
            }
            // let url = ``
            //
            // const response = await fetch(url, {
            //     method: 'POST',
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({
            //         id: key,
            //         memo: row.memo,
            //     })
            // }).catch((error)=>{console.log(error)});
            //
            // if (response){
            //     let {status, message, work_order} = await response.json();
            //     console.log(response.status)
            //     console.log(status,message,work_order)
            //     if (status==="OK"){
            //         Swal.fire({
            //             // position: 'top-end',
            //             icon: 'success',
            //             title: '儲存成功',
            //             showConfirmButton: true,
            //             timer: 1000
            //         })
            //         // setIsRefresh(true)
            //
            //     }else {
            //         console.log(response.status)
            //         Swal.fire({
            //             icon: 'error',
            //             title: response.status,
            //             text: response.statusText,
            //             footer: '請洽詢網站管理者尋求協助'
            //         })
            //     }
            //
            // }else{
            //     console.log("Data Modify Failed")
            //     Swal.fire({
            //         icon: 'error',
            //         title: '連線失敗...',
            //         text: '請檢查網路狀況',
            //     })
            // }
            setEditingKey(-1);
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
            Swal.fire({
                icon: 'error',
                title: 'Error' ,
                text: errInfo as string,
                footer: '請洽詢網站管理者尋求協助'
            }).then(()=>{return -1})
        }
    };

    const columns: EditableColumnsType<UserInfo>= [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width:'60px',
            align: "center",
            render:((value, record, index)=>{
                return <Typography.Text style={{color:"#49a43b"}} underline={true} onClick={() => {
                    setOpenPopupForm(true)
                    setPopupFormKey(value)
                    let newData= {...record,dateOfBirth:dayjs(record.dateOfBirth), registerDate:dayjs(record.registerDate)}
                    popupForm.setFieldsValue(newData)
                }} >{value}</Typography.Text>
            })

            // sorter:true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width:'127px',
            align: "center",
            // sorter:true,
            onCell: (record: UserInfo) => ({
                record,
                inputType: 'string',
                dataIndex: 'name',
                title: 'Name',
                editing: isEditing(record),
            }),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width:'70px',
            align: "center",
            // sorter:true,
            onCell: (record: UserInfo) => ({
                record,
                inputType: 'number',
                dataIndex: 'age',
                title: 'Age',
                editing: isEditing(record),
            }),
        },
        {
            title: 'Birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            width:'120px',
            align: "center",
            // sorter:true
            onCell: (record: UserInfo) => ({
                record,
                inputType: 'date',
                dataIndex: 'dateOfBirth',
                title: 'Birth',
                editing: isEditing(record),
                width:'200px',
            }),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width:'80px',
            align: "center",
            // sorter:true,
            onCell: (record: UserInfo) => ({
                record,
                inputType: 'text',
                dataIndex: 'address',
                title: 'Address',
                editing: isEditing(record),
            }),
        },
        {
            title: 'RegisterDate',
            dataIndex: 'registerDate',
            key: 'registerDate',
            width:'120px',
            align: "center",
            // sorter:true,
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            width:'60px',
            align: "center",
            // sorter:true,
        },
        {
            title: 'Interest',
            dataIndex: 'interest',
            key: 'interest',
            width: '120px',
            align: "center",
            // ellipsis: true,
            render:(text:string)=>{
                return <div style={{whiteSpace: 'pre-wrap'}}>{text}</div>
            },
            onCell: (record: UserInfo) => ({
                record,
                inputType: 'string',
                dataIndex: 'interest',
                title: 'Interest',
                editing: isEditing(record),
            }),
        },
        {
            title: 'Memo',
            dataIndex: 'memo',
            key: 'memo',
            width: '200px',
            align: "center",
            // ellipsis: true,
            render:(text:string)=>{
                return <div style={{whiteSpace: 'pre-wrap'}}>{text}</div>
            },
            onCell: (record: UserInfo) => ({
                record,
                inputType: 'text',
                dataIndex: 'memo',
                title: 'Memo',
                editing: isEditing(record),
            }),
        },
        {
            title: 'Edit',
            dataIndex: 'operation',
            width: '90px',
            align: "center",
            render: (_: any, record: UserInfo) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.id, form)} style={{ marginRight: 8 }}>
                          儲存
                        </Typography.Link>
                        <Popconfirm title="確定取消嗎?" onConfirm={cancel} okText={"確定"} cancelText={"取消"}>
                          <a>取消</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <span>
                        {/*用 editingKey 鎖住編輯中以外的資料*/}
                        <Typography.Link disabled={editingKey !== -1} onClick={() => edit(record)} style={{ marginRight: 8 }}>
                            編輯
                        </Typography.Link>
                    </span>
                );
            },
        },
    ];

    function handleOK(){
        save(popupFormKey, popupForm)
        setOpenPopupForm(false)
    }
    function handleCancel(){
        setOpenPopupForm(false)
    }

    return(
        <>
            <Modal title={"ID: "+popupFormKey} open={openPopupForm} onOk={handleOK} onCancel={handleCancel} >
                <Form form={popupForm} layout={"vertical"}>
                    <Form.Item name='name' label='Name' style={{ margin: 0 }}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='age' label='Age' style={{ margin: 0 }}>
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item name='dateOfBirth' label='DateOfBirth' style={{ margin: 0 }}>
                        <DatePicker/>
                    </Form.Item>
                    <Form.Item name='address' label='Address' style={{ margin: 0 }}>
                        <TextArea/>
                    </Form.Item>
                    <Form.Item name='interest' label='Interest' style={{ margin: 0 }}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='memo' label='Memo' style={{ margin: 0 }}>
                        <TextArea/>
                    </Form.Item>
                </Form>
            </Modal>
        <Form form={form}>
        <ConfigProvider
            theme={{
                components:{
                    Table: {
                        headerBg:'#4df87d',
                        headerSortActiveBg: '#3ccc65',
                        borderRadius: 1000,
                        cellPaddingInline: 0,
                    }},
            }}
        >
            <Row>
                <Col span={1}>
                    <Button type={"primary"} icon={<PlusOutlined />} onClick={()=>addRow()}>
                        新增欄位~~~
                    </Button>
                </Col>
                <Col push={22} span={1} style={{display: "flex", justifyContent:"flex-end"}}>
                    <Button type={'primary'} style={{marginBottom: 10}}
                            onClick={()=>onExportBasicExcel(columns,shownData,'使用者資料表.xlsx')}>匯出Excel</Button>
                </Col>
            </Row>
            <Table {...tableProps}
                   style={{width: tableW-30, padding:'0'}}
                   scroll={{x:"80vw"}}
                   components={{
                       body: {
                           cell: EditableCell,
                       },}}
                   dataSource={shownData}
                   columns={columns}
                   loading={loading}
                   // onChange={(pagination, filters, sorter, extra) => {
                   //     if(!Array.isArray(sorter)){ changeOrder(sorter, sortData) }
                   // }}
            />
        </ConfigProvider>
        </Form>
        </>
    )
}

export default TableUserInfo