import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Avatar } from 'antd'
import { dayjs } from '../../../utils/js/timeTool.js'
import './index.css'

const { Meta } = Card

export default function UserPlaylists() {
  let navigate = useNavigate()

  const [userPlaylistsInfo, setUserPlaylistsInfo] = useState([])

  const getPlaylists = () => {
    React.$apis.getPlaylists(localStorage.getItem('id')).then((val) => {
      setUserPlaylistsInfo(val)
    })
  }

  useEffect(() => {
    getPlaylists()
  }, [])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px 0' }} className="userplaylists">
      {userPlaylistsInfo.map((item) => {
        return (
          <Card
            style={{ width: 300, position: 'relative' }}
            cover={<img alt="example" src={item.coverImgUrl} style={{ objectFit: 'cover' }} />}
            key={item.id}
            onClick={() => {
              navigate(`/home/playlist/${item.id}`)
            }}
          >
            <Meta avatar={<Avatar src={item.creator?.avatarUrl} />} title={item.name} description={item.description ? item.description : '这个人很懒 什么也没留下'} />
            <Meta className="createTime" description={`创建时间：${dayjs(item.createTime)}`} />
          </Card>
        )
      })}
    </div>
  )
}
