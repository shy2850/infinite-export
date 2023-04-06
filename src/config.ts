import { ExportProps, FieldKey } from "./interfaces";

export const sheet_size = 10000
export const defaultConfig: Partial<ExportProps<{}>> = {
    sheet_name: function (i, total) {
        const start = i * sheet_size + 1
        const end = Math.min((i + 1) * sheet_size, total)
        return `${start}~${end}`
    },
    sheet_size,
}

export const getFieldValue = <T extends object>(o: T, key: FieldKey<T>) => {
    if (key in o) {
        return o?.[key as keyof T]
    }
    const [k1, k2] = (key.toString()).split('.')
    return o?.[k1]?.[k2]
}