import {Button, Col, ConfigProvider, Form, Input, InputNumber, Popconfirm, Row, Table, Typography} from 'antd';
import type {TableProps} from 'antd/es/table';
import Swal from "sweetalert2";
import {onExportBasicExcel} from "component/excelExport/ExcelExport";
import {EditableColumnsType} from "component/types";
import {updateDataFn, UserInfo} from "./PageUserInfo";
import {useState} from "react";
import dayjs from "dayjs";

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
    inputType: 'number' | 'text';
    record: UserInfo;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({editing, dataIndex, title,
                                                       inputType, record,
                                                       index, children,
                                                       ...restProps
                                                   }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <TextArea/>;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    // id={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
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


const TableUserInfo=(props:{loading:boolean, shownData: UserInfo[], updateUserInfoFn:updateDataFn<UserInfo>})=>{
    const {loading, shownData,updateUserInfoFn} = props;
const TableUserInfo=(props:{tableW:number, loading:boolean, shownData: UserInfo[], updateUserInfoFn:updateDataFn<UserInfo>})=>{
    const {tableW, loading, shownData,updateUserInfoFn} = props;
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<number>(-1);

    const isEditing = (record: UserInfo) => record.key === editingKey;

    const edit = (record: Partial<UserInfo> & { key: React.Key }) => {
        form.setFieldsValue({ ...record });
        // console.log(record.id)
        if (record.key) setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey(-1);
    };

    const save = async (key: string) => {
        try {
            const row = (await form.validateFields()) as UserInfo;

            const res =await updateUserInfoFn(key,row)
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
            // width:'127px',
            // sorter:true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            // width:'127px',
            // sorter:true,
        },
        {
            title: 'Birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            // width:'127px',
            // sorter:true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            // width:'127px',
            // sorter:true,
        },
        {
            title: 'RegisterDate',
            dataIndex: 'registerDate',
            key: 'registerDate',
            // width:'127px',
            // sorter:true,
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            // width:'127px',
            // sorter:true,
        },
        {
            title: 'Interest',
            dataIndex: 'interest',
            key: 'interest',
            width: '90px',
            // align:"right" as "right",
            // ellipsis: true,
            editable: true ,
            render:(text:string)=>{
                return <div style={{whiteSpace: 'pre-wrap'}}>{text}</div>
            },
            onCell: (record: UserInfo) => ({
                record,
                inputType: 'text',
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
            // ellipsis: true,
            editable: true ,
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
            render: (_: any, record: UserInfo) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
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

    return(
        <Form form={form}>
        <ConfigProvider
            theme={{
                components:{
                    Table: {
                        headerBg:'#4df87d',
                        headerSortActiveBg: '#3ccc65',
                        borderRadius: 1000,
                    }},
            }}
        >
            <Row>
                <Col push={21} span={1}>
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
    )
}

export default TableUserInfo