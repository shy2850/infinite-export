import * as xlsx from 'xlsx';
import { FetchExportProps } from './interfaces';
import { defaultConfig, getFieldValue } from './config';

export const fetchExport = <T extends object, F>(options: FetchExportProps<T, F>) => {
    let disabled = false
    const {
        filename,
        sheet_name,
        columnsType,
        sheet_size,
        writingOptions,
        fetch,
        onProcess,
    } = {
        ...defaultConfig,
        ...options
    }
    const get_sheet_name = typeof sheet_name === 'string' ? (
        () => sheet_name
    ) : (
        sheet_name
    )
    const wb = xlsx.utils.book_new()
    /** 当前页是第几页sheet */
    let index = 0
    /** 已经下载了多少条数据 */
    let lines: T[] = []
    const append_sheet = (name: string) => {
        const list = lines.slice(index * sheet_size, (index + 1) * sheet_size)
        const ws = xlsx.utils.json_to_sheet(list.map(((item, index) => {
            return columnsType.reduce((o, c) => {
                const value = getFieldValue(item, c.dataIndex)
                return {
                    ...o,
                    [c.title]: c.render ? c.render(value, item, index) : value
                }
            }, {})
        })), {
            header: columnsType.map(t => t.title),
        })
        xlsx.utils.book_append_sheet(wb, ws, name)
    }
    const loop = async function loop (body: F, callback: Function) {
        if (body && !disabled) {
            const [ res, next_body ] = await fetch(body)
            lines = lines.concat(res.list)
            while (lines.length >= (index + 1) * sheet_size) {
                // 过程中满一页追加
                append_sheet(get_sheet_name(index, res.total))
                index++
            }
            onProcess?.(lines.length, res.total, index * sheet_size)
            if (next_body) {
                loop(next_body, callback)
                return
            }
            if (lines.length > index * sheet_size) {
                // 结束后剩余的追加
                append_sheet(get_sheet_name(index, res.total))
                index++
            }
            callback?.()
        }
    }
    loop(options.body, function () {
        if (!disabled) {
            xlsx.writeFile(wb, filename, writingOptions)
        }
    })
    return {
        cancel: () => {
            disabled = true
        }
    }
}