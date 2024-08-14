import { Input } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

const SearchWrapper = styled.div`
.search-container {
    padding: 16px 12px 8px 12px;
}
`

interface ISearchProps {
    keywords: string
    setKeywords: (keywords: string) => void
}

const Search = (props: ISearchProps) => {
    const { keywords, setKeywords } = props

    const [inputValue, setInputValue] = useState(keywords || '')

    useEffect(() => {
        setInputValue(keywords)
    }, [keywords])

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const searchHandler = useCallback((value: string) => {
        setKeywords(value)
    }, [setKeywords])

    return (
        <SearchWrapper>
            <div className="search-container">
                <Input.Search placeholder='请输入关键字进行搜索' allowClear enterButton="搜索" value={ inputValue } onChange={ changeHandler } onSearch={ searchHandler }></Input.Search>
            </div>
        </SearchWrapper>
    )
}

export default Search