import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

const BlockDraggable = ({ Block, _id, index, move, save }) => {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: '*',
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      move(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: '*', _id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
	var propsToSend = {
		save: save,
		_id: _id
	};
  return (
    <div ref={ref} style={{ opacity }}>
      {<Block { ...propsToSend }/>}
    </div>
  )
}
export default BlockDraggable
