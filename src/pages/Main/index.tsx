import { PasteManager } from '@/core/PasteManager'
import { usePasteManager } from '@/hooks/usePasteManager'
import List from '@/pages/Main/components/List'
import Search from '@/pages/Main/components/Search'
import { IpcEventEnum } from '@share/IpcEventEnum'
import { Button } from 'antd'
import { useLayoutEffect, useState } from 'react'
import styled from 'styled-components'

const MainWrapper = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
background-color: rgb(238, 238, 238);

.paster-list__container {
    flex: 1;
    overflow: hidden;
}

.footer {
    display: flex;
    justify-content: flex-end;
    padding: 0 12px 8px 12px;

    .ant-btn {
        min-width: 88px;
    }

    .ant-btn + .ant-btn {
        margin-left: 12px;
    }
}
`

const Main = () => {

    const { activeModel } = usePasteManager()
    const [keywords, setKeywords] = useState('')

    useLayoutEffect(() => {
        window.IpcRenderer.receive(IpcEventEnum.COPY, data => {
            PasteManager.getInstance().create(data as any)
        })
    })

    /* 复制 */
    const pasteData = () => {
        activeModel && window.IpcRenderer.pasteData(activeModel)
    }

    return (
        <MainWrapper className='main-app'>
            <Search keywords={ keywords } setKeywords={ setKeywords }></Search>
            <List></List>
            <div className="footer">
                <Button type='primary' danger>清空</Button>
                <Button type='primary'>保存修改内容</Button>
                <Button type='primary' onClick={ () => pasteData()}>复制</Button>
            </div>
        </MainWrapper>
    )
}

export default Main