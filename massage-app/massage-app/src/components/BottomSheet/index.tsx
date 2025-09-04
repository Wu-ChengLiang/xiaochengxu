import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'

interface BottomSheetProps {
  visible: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  height?: string  // 可自定义高度，默认 70%
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  title,
  onClose,
  children,
  height = '70%'
}) => {
  const [animating, setAnimating] = useState(false)
  const [internalVisible, setInternalVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      setInternalVisible(true)
      setTimeout(() => setAnimating(true), 50)
    } else {
      setAnimating(false)
      setTimeout(() => setInternalVisible(false), 300)
    }
  }, [visible])

  const handleMaskClick = () => {
    onClose()
  }

  const handleContentClick = (e: any) => {
    e.stopPropagation()
  }

  if (!internalVisible) return null

  return (
    <View className="bottom-sheet" onClick={handleMaskClick}>
      <View 
        className={`bottom-sheet-mask ${animating ? 'active' : ''}`}
      />
      <View 
        className={`bottom-sheet-content ${animating ? 'active' : ''}`}
        style={{ height }}
        onClick={handleContentClick}
      >
        {/* 头部 */}
        <View className="sheet-header">
          <Text className="sheet-title">{title}</Text>
          <View className="close-btn" onClick={onClose}>
            <AtIcon value="close" size="20" color="#999" />
          </View>
        </View>
        
        {/* 内容区域 */}
        <View className="sheet-body">
          {children}
        </View>
      </View>
    </View>
  )
}

export default BottomSheet