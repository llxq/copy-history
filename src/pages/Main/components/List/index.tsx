import type { BaseModel } from '@/core/model/BaseModel'
import { usePasteManager } from '@/hooks/usePasteManager'
import './index.scss'

const List = () => {
    const { list, activeModel, updateActiveModel } = usePasteManager()

    return (
        <div className="paster-list__container">
            <div className="paster-list__content">
                {
                    list.map((item: BaseModel) => <div className={
                        `paster-item ${ activeModel?.id === item.id ? 'paster-item__active' : '' }`
                    } key={ item.id } onClick={ () => updateActiveModel({ activeModel: item }) }>
                        [<span className='paster-item__time'>{ item.time }</span>]：
                        { item.content }
                    </div>)
                }
            </div>
            <div className='tips'>修改后直接保存可以替换原来存储的内容</div>
            <div className="paster-list__real-content" contentEditable={ true } suppressContentEditableWarning={ true } dangerouslySetInnerHTML={ { __html: activeModel?.realContent || '' } }></div>
        </div>
    )
}

export default List
