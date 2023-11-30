
import {ColumnsType} from "antd/lib/table/interface";
import * as ExcelJs from 'exceljs';
import {generateHeaders, saveWorkbook} from "../../utils";

export function onExportBasicExcel(columns:any, list:any[], fileName?:string, sheetName?:string) {
    if (!fileName) fileName='報表.xlsx'
    if (!sheetName) sheetName='sheet1'
    // 创建工作簿
    const workbook = new ExcelJs.Workbook();
    // 添加sheet
    const worksheet = workbook.addWorksheet(sheetName);
    // 设置 sheet 的默认行高
    worksheet.properties.defaultRowHeight = 20;
    // 設置列標題資訊
    worksheet.columns = generateHeaders(columns);
    // 如果有資料, 添加列資料
    if (list) worksheet.addRows(list);
    // 导出excel
    saveWorkbook(workbook, fileName);
}
