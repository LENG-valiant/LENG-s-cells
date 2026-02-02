'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/UI'
import { BookOpen, Utensils, GraduationCap, Bot, HeartPulse, ArrowRight } from 'lucide-react'

interface HomePageProps {
  onNavigate: (page: string) => void
}

// 细胞类型定义
interface Cell {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  iconBg: string
  description: string
  route: string
}

interface Quote {
  id: string
  content: string
  author: string
  category: string
}

// 新配色方案 - 基于提供的图片
const NEW_COLORS = {
  primary: '#197CBE', // 主蓝色
  secondary: '#59A3CF', // 浅蓝色
  accent: '#F88B7C', // 粉色
  warm: '#F5CB76', // 黄色
  light: '#EAEEEC', // 白色
  dark: '#197CBE', // 深蓝色
}

// 名人名言库
const QUOTES: Quote[] = [
  // 加缪
  { id: '1', content: '真正严肃的哲学问题只有一个，就是自杀。', author: '阿尔贝·加缪', category: '哲学' },
  { id: '2', content: '我反抗，故我存在。', author: '阿尔贝·加缪', category: '哲学' },
  { id: '3', content: '荒诞是人与世界之间的唯一联系。', author: '阿尔贝·加缪', category: '哲学' },
  
  // 莫言
  { id: '4', content: '文学和科学相比，的确没什么用处，但文学最大的用处，也许就是它没有用处。', author: '莫言', category: '文学' },
  { id: '5', content: '世界上的事情，最忌讳的就是个十全十美。', author: '莫言', category: '生活' },
  { id: '6', content: '真正的勇敢不是不害怕，而是害怕的时候你还能坚持去做。', author: '莫言', category: '勇气' },
  
  // 余华
  { id: '7', content: '人是为活着本身而活着，而不是为了活着之外的任何事物所活着。', author: '余华', category: '生活' },
  { id: '8', content: '死亡不是失去了生命，而是走出了时间。', author: '余华', category: '生命' },
  { id: '9', content: '没有什么比时间更具有说服力了，因为时间无需通知我们就可以改变一切。', author: '余华', category: '时间' },
  
  // 几米
  { id: '10', content: '人生总有许多意外，握在手里的风筝也会突然断了线。', author: '几米', category: '人生' },
  { id: '11', content: '我总是在最深的绝望里，遇见最美丽的惊喜。', author: '几米', category: '希望' },
  { id: '12', content: '向左走，向右走，我们都会错过。', author: '几米', category: '缘分' },
  
  // 胡适
  { id: '13', content: '大胆假设，小心求证。', author: '胡适', category: '学术' },
  { id: '14', content: '容忍比自由更重要。', author: '胡适', category: '宽容' },
  { id: '15', content: '醉过才知酒浓，爱过才知情重。', author: '胡适', category: '情感' },
  
  // 徐志摩
  { id: '16', content: '轻轻的我走了，正如我轻轻的来。', author: '徐志摩', category: '诗歌' },
  { id: '17', content: '我将于茫茫人海中访我唯一灵魂之伴侣；得之，我幸；不得，我命。', author: '徐志摩', category: '爱情' },
  { id: '18', content: '最是那一低头的温柔，像一朵水莲花不胜凉风的娇羞。', author: '徐志摩', category: '诗歌' },
  
  // 鲁迅
  { id: '19', content: '其实地上本没有路，走的人多了，也便成了路。', author: '鲁迅', category: '哲理' },
  { id: '20', content: '不在沉默中爆发，就在沉默中灭亡。', author: '鲁迅', category: '勇气' },
  { id: '21', content: '横眉冷对千夫指，俯首甘为孺子牛。', author: '鲁迅', category: '精神' },
  
  // 张爱玲
  { id: '22', content: '生命是一袭华美的袍，爬满了蚤子。', author: '张爱玲', category: '生命' },
  { id: '23', content: '喜欢一个人，会卑微到尘埃里，然后开出花来。', author: '张爱玲', category: '爱情' },
  { id: '24', content: '于千万人之中遇见你所要遇见的人，于千万年之中，时间的无涯的荒野里，没有早一步，也没有晚一步，刚巧赶上了。', author: '张爱玲', category: '缘分' },
  
  // 三毛
  { id: '25', content: '每想你一次，天上飘落一粒沙，从此形成了撒哈拉。', author: '三毛', category: '爱情' },
  { id: '26', content: '心，若没有栖息的地方，到哪里都是流浪。', author: '三毛', category: '心灵' },
  { id: '27', content: '岁月极美，在于它必然的流逝。春花、秋月、夏日、冬雪。', author: '三毛', category: '时光' },
  
  // 双雪涛
  { id: '28', content: '生活是一条狗，追着我们咬。', author: '双雪涛', category: '生活' },
  { id: '29', content: '人在年轻的时候，觉得到处都是人，别人的事就是你的事，到了中年以后，才觉得世界上除了家人已经一无所有了。', author: '双雪涛', category: '人生' },
  { id: '30', content: '命运是一条闪闪发光的金线，我们被它编织进各自的故事里。', author: '双雪涛', category: '命运' },
  
  // papi酱
  { id: '31', content: '独立不是特立独行，而是有选择的权利。', author: 'papi酱', category: '独立' },
  { id: '32', content: '女生最重要的是经济独立，精神独立，人格独立。', author: 'papi酱', category: '独立' },
  { id: '33', content: '人生没有白走的路，每一步都算数。', author: 'papi酱', category: '人生' },
  
  // 李雪琴
  { id: '34', content: '宇宙都有尽头，北京地铁没有。', author: '李雪琴', category: '幽默' },
  { id: '35', content: '我现在的人生态度就是，开心就好，别太勉强。', author: '李雪琴', category: '生活' },
  { id: '36', content: '人生是一场马拉松，不是短跑，你不用一开始就冲得太快。', author: '李雪琴', category: '人生' },
]

// 根据日期获取随机名言
function getDailyQuote(): Quote {
  const today = new Date().toDateString()
  const seed = today.split(' ').reduce((acc, part) => acc + part.charCodeAt(0), 0)
  const randomIndex = seed % QUOTES.length
  return QUOTES[randomIndex]
}

// 随机获取名言
function getRandomQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * QUOTES.length)
  return QUOTES[randomIndex]
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [quote, setQuote] = useState<Quote>({ 
    id: '1', 
    content: '开始你的成长之旅吧！', 
    author: 'LENG',
    category: '激励'
  })

  // 客户端加载时获取今日名言
  useEffect(() => {
    setQuote(getDailyQuote())
  }, [])

  // 点击刷新获取新的名言
  const refreshQuote = () => {
    setQuote({ ...quote, content: '...' })
    setTimeout(() => {
      setQuote(getRandomQuote())
    }, 300)
  }

  // 定义细胞数据
  const cells: Cell[] = [
    {
      id: 'reading',
      name: '阅读细胞',
      icon: <BookOpen size={27} />, // 缩小15%
      color: 'bg-[#EAEEEC] border-[#59A3CF]',
      iconBg: 'bg-[#197CBE] text-white',
      description: '探索知识的海洋，记录阅读心得',
      route: 'reading'
    },
    {
      id: 'food',
      name: '美食细胞',
      icon: <Utensils size={27} />, // 缩小15%
      color: 'bg-[#EAEEEC] border-[#F5CB76]',
      iconBg: 'bg-[#F5CB76] text-[#197CBE]',
      description: '品尝生活的味道，记录美食记忆',
      route: 'food'
    },
    {
      id: 'learning',
      name: '学习细胞',
      icon: <GraduationCap size={27} />, // 缩小15%
      color: 'bg-[#EAEEEC] border-[#F88B7C]',
      iconBg: 'bg-[#F88B7C] text-white',
      description: '成长的阶梯，知识的积累',
      route: 'learning'
    },
    {
      id: 'ai',
      name: 'AI细胞',
      icon: <Bot size={27} />, // 缩小15%
      color: 'bg-[#EAEEEC] border-[#4D613C]',
      iconBg: 'bg-[#4D613C] text-white',
      description: '探索人工智能的无限可能',
      route: 'ai'
    },
    {
      id: 'health',
      name: '健康细胞',
      icon: <HeartPulse size={27} />, // 缩小15%
      color: 'bg-[#EAEEEC] border-[#F1BBC9]',
      iconBg: 'bg-[#F1BBC9] text-[#197CBE]',
      description: '身体是革命的本钱，记录健康状态',
      route: 'health'
    }
  ]

  return (
    <div className="min-h-screen bg-[#197CBE] tech-background tech-grid tech-glow flex flex-col">
      {/* 几何艺术背景 */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* 几何图形 */}
            <rect x="5" y="5" width="90" height="90" fill="none" stroke="#EAEEEC" strokeWidth="0.3"/>
            <rect x="15" y="15" width="70" height="70" fill="none" stroke="#59A3CF" strokeWidth="0.2"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#F88B7C" strokeWidth="0.3"/>
            <circle cx="50" cy="50" r="20" fill="none" stroke="#F5CB76" strokeWidth="0.2"/>
            <polygon points="10,10 90,10 90,90 10,90" fill="none" stroke="#EAEEEC" strokeWidth="0.2"/>
            <polygon points="20,20 80,20 80,80 20,80" fill="none" stroke="#59A3CF" strokeWidth="0.1"/>
            <line x1="0" y1="33" x2="100" y2="33" stroke="#F88B7C" strokeWidth="0.1"/>
            <line x1="0" y1="66" x2="100" y2="66" stroke="#F88B7C" strokeWidth="0.1"/>
            <line x1="33" y1="0" x2="33" y2="100" stroke="#F5CB76" strokeWidth="0.1"/>
            <line x1="66" y1="0" x2="66" y2="100" stroke="#F5CB76" strokeWidth="0.1"/>
            <path d="M10,10 L90,90" fill="none" stroke="#EAEEEC" strokeWidth="0.2"/>
            <path d="M90,10 L10,90" fill="none" stroke="#59A3CF" strokeWidth="0.2"/>
          </svg>
        </div>
      </div>

      {/* 顶部区域 */}
      <div className="flex flex-col items-center justify-center px-4 py-6 relative z-10">
        <div className="text-center max-w-4xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 tracking-tight">
            LENG的第二大脑
          </h1>
          <p className="text-xs md:text-sm lg:text-base text-[#EAEEEC] max-w-2xl mx-auto leading-relaxed mb-4">
            由阅读、美食、学习、AI和健康细胞构成的成长路径
          </p>
          <div className="inline-block">
            <div className="w-32 h-1 bg-gradient-to-r from-[#F88B7C] to-[#F5CB76]"></div>
          </div>
        </div>
      </div>

      {/* 名言卡片 */}
      <div className="flex items-center justify-center px-4 py-4 relative z-10">
        <Card className="bg-[#EAEEEC] border border-[#59A3CF] rounded-2xl shadow-sm overflow-hidden relative max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#EAEEEC] to-[#f8fafc] opacity-70 pointer-events-none"></div>
          <div className="p-3 md:p-4">
            <div className="text-center">
                <div className="inline-block mb-2">
                  <div className="w-12 h-1 bg-gradient-to-r from-[#F88B7C] to-[#F5CB76]"></div>
                  <h3 className="text-sm md:text-base font-medium text-[#197CBE] mt-1 uppercase tracking-wider">今日名言</h3>
                </div>
                <div className="max-w-2xl mx-auto animate-fade-in">
                  <p className="text-sm md:text-base font-light text-[#197CBE] mb-2 leading-relaxed">
                    "{quote.content}"
                  </p>
                  <p className="text-sm text-[#59A3CF] font-medium">
                    —— {quote.author}
                  </p>
                </div>
                <div className="mt-2">
                  <button
                    onClick={refreshQuote}
                    className="px-3 py-1 bg-gradient-to-r from-[#197CBE] to-[#59A3CF] hover:from-[#156bb8] hover:to-[#4a93bf] text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md font-medium text-sm"
                  >
                    换一句名言
                  </button>
                </div>
              </div>
          </div>
        </Card>
      </div>

      {/* 中间弹性空间 */}
      <div className="flex-grow min-h-0"></div>

      {/* 卡片区 */}
      <div className="flex flex-col items-center justify-center px-4 py-6 relative z-10 mb-5">
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="w-16 h-1 bg-gradient-to-r from-[#F88B7C] to-[#F5CB76]"></div>
            <h2 className="text-sm md:text-base lg:text-lg font-bold text-white mt-2 mb-2">
              我的大脑细胞
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F88B7C] to-[#F5CB76]"></div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {cells.map((cell, index) => (
            <Card 
              key={cell.id}
              onClick={() => onNavigate(cell.route)}
              className={`${cell.color} rounded-xl shadow-sm hover:shadow-md transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden animate-fade-in relative flex flex-col justify-between flex-shrink-1 min-h-0`}
              style={{ animationDelay: `${index * 100}ms`, maxWidth: '220px', width: 'fit-content' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#EAEEEC] to-[#f8fafc] opacity-50 pointer-events-none"></div>
              <div className="p-4 text-center flex flex-col flex-1 justify-between flex-shrink-1 min-h-0">
                {/* 细胞图标 */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 shadow-sm transition-all duration-300 hover:scale-110 ${cell.iconBg} mx-auto`}>
                  {cell.icon}
                </div>
                
                {/* 细胞名称 */}
                <h3 className="text-sm md:text-base font-semibold mb-3 text-[#197CBE]">{cell.name}</h3>
                
                {/* 细胞描述 */}
                <p className="text-xs md:text-sm text-[#59A3CF] mb-4 leading-relaxed flex-1 whitespace-normal break-words flex-shrink-1 min-h-0">{cell.description}</p>
                
                {/* 进入按钮 */}
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#197CBE] rounded-full shadow-sm text-white font-medium transition-all duration-300 hover:shadow-md text-sm">
                  探索 <ArrowRight size={10} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="flex items-center justify-center px-4 py-4 relative z-10 mb-5">
        <div className="text-center">
          <p className="text-[#EAEEEC] text-xs md:text-sm">
            LENG的第二大脑 • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}