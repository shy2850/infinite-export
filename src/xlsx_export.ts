import * as xlsx from 'xlsx';
import { ExportProps } from './interfaces';
import { defaultConfig, getFieldValue } from './config';

export const xslxExport = async <T extends object>(list: T[], options: ExportProps<T>) => {
    const {
        filename,
        sheet_name,
        columnsType,
        sheet_size,
        writingOptions,
    } = {
        ...defaultConfig,
        ...options
    }

    const get_sheet_name = typeof sheet_name === 'string' ? () => sheet_name : sheet_name
    const sheetTotal = Math.ceil(list.length / sheet_size)

    const wb = xlsx.utils.book_new()
    for (let i = 0; i < sheetTotal; i ++) {
        const ws = xlsx.utils.json_to_sheet(list.slice(i * sheet_size, (i + 1) * sheet_size).map((log, i) => columnsType.reduce((l, c) => {
            const value = getFieldValue(log, c.dataIndex)
            return { ...l, [c.title + '']: l.render ? l.render(value, log, i) : value}
        }, {} as any)), {
            header: columnsType.map(t => t.title + ''),
        })
        xlsx.utils.book_append_sheet(wb, ws, get_sheet_name(i, list.length))
    }
    xlsx.writeFile(wb, filename, writingOptions)
}