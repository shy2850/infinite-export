import { fetchExport, ExportColumnType } from '../src'

interface EventObject {
    author: {
        id: number;
        name: string;
        nickname: string;
    };
    title: string;
    created_at: string;
    type: string;
    updated_at: string;
}

const columns: ExportColumnType<EventObject>[] = [
    {
        title: '用户id',
        dataIndex: 'author.id',
    },
    {
        title: '用户名',
        dataIndex: 'author.name',
    },
    {
        title: '用户昵称',
        dataIndex: 'author.nickname',
    },
    {
        title: '内容',
        dataIndex: 'title',
    },
    {
        title: '操作',
        dataIndex: 'type',
    },
    {
        title: '创建日期',
        dataIndex: 'created_at',
    },
    {
        title: '修改日期',
        dataIndex: 'updated_at',
    },
]

const button = document.querySelector<HTMLButtonElement>('.button')
const process = document.querySelector<HTMLDivElement>('.process')
const inner = document.querySelector<HTMLDivElement>('.inner')
const percent = document.querySelector<HTMLSpanElement>('.percent')
const cancel = document.querySelector<HTMLSpanElement>('.cancel')

let doCancel = function () {}
const doExport = () => {
    button?.setAttribute('disabled', 'disabled')
    if (process) {
        process.style.display = 'block'
    }
    let loaded = 0
    let total = 100
    const { cancel } = fetchExport({
        body: '/f2e-server/f2e-server/events.json',
        fetch: async function (body: string) {
            const { data }: {
                data: {
                    events: EventObject[],
                    load_more_url: string,
                }
            } = await fetch(body).then(res => res.json())
    
            loaded += data.events.length
            if (!data.load_more_url) {
                total = loaded
            }
            return [{
                list: data.events,
                total,
            }, data.load_more_url]
        },
        onProcess: function (loaded: number, total: number) {
            const per = loaded / total
            if (inner) {
                inner.style.width = per * 100 + '%'
            }
            if (percent) {
                percent.innerText = (per * 100).toFixed(2) + '%'
            }
            if (loaded >= total) {
                button?.removeAttribute('disabled')
            }
        },
        columnsType: columns,
        filename: 'f2e-server动态.xlsx',
    })
    doCancel = cancel
}

button?.addEventListener('click', doExport)
cancel?.addEventListener('click', function () {
    doCancel()
    button?.removeAttribute('disabled')
    process && (process.style.display = 'none')
})
