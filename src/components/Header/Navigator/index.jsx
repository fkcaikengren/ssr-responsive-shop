
import React,{useState, useCallback} from 'react'
import {Link} from 'react-router-dom'
import ResponsiveImage from 'components/ResponsiveImage'
import style from './style.scss'

function Navigator() {
  const navs = ['汉服', '头饰', '婚纱', '旗袍', '鞋子']
  const [activeIndex, setActiveIndex] = useState('')
  const categories = {
    '0':['汉服秦制',
      '汉服汉制',
      '汉服唐制',
      '汉服宋制',
      '汉服明制',
      '清朝服饰'],
    '1':['发髻',
      '簪子',
      '纱巾',
      '蝴蝶结'],
    '2':['翘头鞋',
      '登云履',
      '皂靴',
      '布帛袜'],
    '3':['标准旗袍',
      '改良旗袍'],
    '4':[],
  }

  const onCategoryEnter = useCallback((e)=>{
    if(e.target ){
      const index = e.target.dataset.index
      if(categories[index] && categories[index].length>0){
        setActiveIndex(e.target.dataset.index)
      }else{
        setActiveIndex('')
      }
      
    }
  }, [setActiveIndex])
  const onCategoryLeave = useCallback(()=>{
    setActiveIndex('')
  }, [setActiveIndex])
  return (
    <nav className={`${style.navigator}`} onMouseLeave={onCategoryLeave}>
        <div className={`${style.navigator}__tabs`} >
          {navs.map((item,i)=>(
              <Link key={i} data-index={i} to='/' onMouseEnter={onCategoryEnter}>{item}</Link>
          ))}


        </div>
        {categories[activeIndex] &&
          <div className={`${style.navigator}__content`}> 
            { categories[activeIndex].map((item, i)=>(
              <a key={i} className={`${style.navigator}__category`}>
                <ResponsiveImage 
                  source='https://shop-1259360612.cos.ap-guangzhou.myqcloud.com/1.png'
                  name='汉服'
                  ratio={1}
                  width={100}
                />
              <span>{item}</span>
            </a>
            ))}
          </div>
        }
      </nav>
  )
}

export default Navigator
