import * as xlsx from 'xlsx';

type _ValueOf<T> = T[keyof T]
type _FieldKey<T, F extends keyof T = keyof T> =
    F extends infer P extends keyof T
    ? P | (T[P] extends Record<string, any> ? _ValueOf<{
        [k in keyof T[P]]: P extends string ? (
            k extends string ? `${P}.${k}` : never
        ) : never
    }> : never)
    : never

export type FieldKey<T> = _FieldKey<T>

export type ExportColumnType<T extends object> = {
    title: string
    dataIndex: FieldKey<T>
    render?: (t?: any, record?: T, index?: number) => string
}
export interface ExportProps<T extends object> {
    /** 定义字段渲染 */
    columnsType: ExportColumnType<T>[]
    /** 导出文件名 */
    filename: string
    /** 导出设置 */
    writingOptions?: xlsx.WritingOptions
    /** 每个tab页最大数据条数
     * @default 10000 */
    sheet_size?: number
    /** 每个tab页名字
     * @default "${index * sheet_size + 1}~${Math.min(total, index * (sheet_size + 1))}" */
    sheet_name?: string | {(index: number, total: number): string}
}

export interface Page<T> {
    list: T[]
    total: number
}

export interface FetchExportProps<T extends object, F> extends ExportProps<T> {
    /** 初始化请求参数 */
    body?: F
    /**
     * @param body 请求参数
     * @returns 数据列表 + 下次请求参数 当请求参数为空时，停止循环
     */
    fetch: (body: F) => Promise<[result: Page<T>, body?: F]>
    /**
     * @param loaded 已下载
     * @param total 总条数
     * @param appended 已加入excel渲染
     */
    onProcess: (loaded: number, total: number, appended: number) => void
}