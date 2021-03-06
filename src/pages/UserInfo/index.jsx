import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Avatar, Card, Comment, Menu, Divider, BackTop, Popover, Descriptions } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import { time, dayjs } from '../../utils/js/timeTool'
import { store } from '../../redux/store'
import { HearFromHomeInfo } from '../../redux/actions'
import UseMusic from '../../hooks/UseMusic'
import './index.css'

const { Meta } = Card
const style = {
  height: 40,
  width: 40,
  lineHeight: '40px',
  borderRadius: 4,
  backgroundColor: '#1088e9',
  color: '#fff',
  textAlign: 'center',
  fontSize: 14,
  marginLeft: 90,
}

export default function UserInfo() {
  let location = useLocation()
  let navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({})
  const [lovePlaylistsInfo, setLovePlaylistsInfo] = useState({})
  const [accountInfo, setAccountInfo] = useState({})
  const [nearMusic, setNearMusic] = useState([])
  const [userDetail, setUserDetail] = useState({})

  const getStatus = () => {
    React.$apis.loginStatus().then((val) => {
      setUserInfo(val)
    })
  }

  const getPlaylists = () => {
    React.$apis.getPlaylists(localStorage.getItem('id')).then((val) => {
      val && setLovePlaylistsInfo(val[0])
    })
  }

  const nearMusics = () => {
    React.$apis.nearMusic().then((val) => {
      setNearMusic(val.list)
    })
  }

  const toPlay = async (record) => {
    const info = await HearFromHomeInfo(record)
    store.dispatch(info)
  }

  const handleClick = (e) => {
    navigate(e.key)
  }

  const getDetailInfo = async () => {
    const val = await React.$apis.accountDetail()
    setAccountInfo(val)
  }

  const getUserDetail = async () => {
    const val = await React.$apis.vip()
    setUserDetail(val)
  }

  useEffect(() => {
    getStatus()
    getPlaylists()
    nearMusics()
    getDetailInfo()
    getUserDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const personInfo = (
    <Descriptions>
      <Descriptions.Item label="??????">{accountInfo.profile?.nickname}</Descriptions.Item>
      <Descriptions.Item label="??????">{accountInfo.profile?.gender === 1 ? '???' : accountInfo.profile?.gender === 2 ? '???' : '??????'}</Descriptions.Item>
      <Descriptions.Item label="??????">{dayjs(accountInfo.profile?.birthday)}</Descriptions.Item>
      <Descriptions.Item label="??????">{userDetail.level}</Descriptions.Item>
      <Descriptions.Item label="UID">{accountInfo.profile?.userId}</Descriptions.Item>
      <Descriptions.Item label="??????">{userDetail.createDays}&nbsp;???</Descriptions.Item>
      <Descriptions.Item label="????????????">{userDetail.listenSongs}&nbsp;???</Descriptions.Item>
      <Descriptions.Item label="????????????">{dayjs(accountInfo.profile?.createTime)}</Descriptions.Item>
      <Descriptions.Item label="LastLoginTime">{dayjs(accountInfo.profile?.lastLoginTime)}</Descriptions.Item>
      <Descriptions.Item label="????????????">{accountInfo.profile?.signature}</Descriptions.Item>
    </Descriptions>
  )

  return (
    <div className="userinfo">
      {/* ?????????????????? */}
      <div className="direction">
        <i
          className="iconfont icon-fl-jia"
          onClick={() => {
            navigate('/home/discovery')
          }}
        ></i>
        <i
          className="iconfont icon-right"
          onClick={() => {
            window.history.go(-1)
          }}
        ></i>
        <i
          className="iconfont icon-tubiaozhizuo--"
          onClick={() => {
            window.history.go(1)
          }}
        ></i>
      </div>
      <div className="info" style={{ marginBottom: 20 }}>
        <Popover placement="bottomLeft" title="????????????" content={personInfo} trigger="hover" overlayClassName={'pop'}>
          <Avatar size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }} src={userInfo.profile?.avatarUrl} style={{ marginRight: 20, cursor: 'pointer' }} />
        </Popover>
        <span style={{ fontSize: 25 }}>{userInfo.profile?.nickname}</span>
      </div>
      <div className="user-playlists">
        <Card
          style={{ width: 250, marginRight: 30, cursor: 'pointer' }}
          cover={<img alt="example" src={lovePlaylistsInfo.coverImgUrl} />}
          onClick={() => {
            navigate(`/home/playlist/${lovePlaylistsInfo.id}`)
          }}
        >
          <Meta avatar={<Avatar src={lovePlaylistsInfo.creator?.avatarUrl} />} title={lovePlaylistsInfo.name} description={lovePlaylistsInfo.description ? lovePlaylistsInfo.description : '??????????????? ??????????????????'} />
        </Card>
        <div className="near-music">
          <span>????????????-??????</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {nearMusic.map((item) => {
              return (
                <Comment
                  key={item.resourceId}
                  author={<span>{item.data?.al?.name}</span>}
                  avatar={<Avatar src={item.data?.al?.picUrl} alt="Han Solo" />}
                  content={<p>{item.data?.ar[0]?.name}</p>}
                  datetime={<span>{time(item.data?.dt)}</span>}
                  onClick={() => {
                    toPlay(item)
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
      <Divider />
      <div className="own">
        <Menu
          onClick={(e) => {
            handleClick(e)
          }}
          selectedKeys={[location.pathname]}
          mode="horizontal"
        >
          <Menu.Item key="/userinfo/playlists" icon={<i className="iconfont icon-a-2_wodegedan2" style={{ fontSize: 16 }} />}>
            ????????????
          </Menu.Item>
          <Menu.Item key="/userinfo/recent" icon={<i className="iconfont icon-zuijinliulan" style={{ fontSize: 16 }} />}>
            ??????
          </Menu.Item>
        </Menu>

        <div style={{ padding: '15px 10px' }}>
          <Outlet></Outlet>

          <div className="thanks" style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
            <div>
              <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_black">
                ???ICP???2021010497???-2
              </a>
            </div>
            <div>
              <a href="https://github.com/Binaryify/NeteaseCloudMusicApi" target="_black">
                ?????? <GithubOutlined />
                @binaryify
              </a>
            </div>
            <div>
              <a href="https://github.com/DIYgod/APlayer" target="_black">
                ?????? <GithubOutlined />
                @DIYgod
              </a>
            </div>
          </div>
        </div>
      </div>

      <UseMusic></UseMusic>

      <BackTop style={{ marginBottom: 40 }}>
        <div style={style}>UP</div>
      </BackTop>
    </div>
  )
}
