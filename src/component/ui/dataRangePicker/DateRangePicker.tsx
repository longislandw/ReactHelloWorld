import type { TimeRangePickerProps } from 'antd';
import {DatePicker} from "antd";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const dateRangePresets: TimeRangePickerProps['presets'] = [
    { label: '上一星期', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: '上一個月', value: [dayjs().add(-30, 'd'), dayjs()] },
];
const onDateRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
        // console.log('From: ', dates[0], ', to: ', dates[1]);
        // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
        console.log('Clear Date');
    }
};

// export  DateRangePicker;
export {RangePicker, dateRangePresets, onDateRangeChange};
// export default dateRangePresets, onDateRangeChange()