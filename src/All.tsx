import { useEffect, useState } from 'react';
import App from './App.tsx';

const books = [
  { title: '美国反对美国', author: '王沪宁', filename: 'book1.txt' },
  { title: '正义论', author: '约翰·罗尔斯', filename: 'book2.txt' },
  { title: '一九八四', author: '乔治·奥威尔', filename: 'book3.txt' },
  {
    title: '文明的冲突与世界秩序的重建',
    author: '萨缪尔·亨廷顿',
    filename: 'book4.txt',
  },
  { title: '菊与刀', author: '鲁思·本尼迪克特', filename: 'book5.txt' },
  { title: '乡土中国', author: '费孝通', filename: 'book6.txt' },
  {
    title: '国家为什么会失败——权力、富裕与贫困的根源',
    author: 'Daron Acemoglu and James A. Robinson',
    filename: 'book7.txt',
  },
  { title: '繁花', author: '金宇澄', filename: 'book8.txt' },
  { title: '毛选', author: '毛泽东', filename: 'book33.txt' },
  { title: '穷查理宝典', author: '查理芒格', filename: 'poor.txt' },
  {
    title: '李自成（第1卷）',
    author: '姚雪垠',
    filename: '/formal/lizicheng1.txt',
  },
  {
    title: '李自成（第2卷）',
    author: '姚雪垠',
    filename: '/formal/lizicheng2.txt',
  },
  {
    title: '李自成（第3卷）',
    author: '姚雪垠',
    filename: '/formal/lizicheng3.txt',
  },
  {
    title: '李自成（第4卷）',
    author: '姚雪垠',
    filename: '/formal/lizicheng4.txt',
  },
  {
    title: '李自成（第5卷）',
    author: '姚雪垠',
    filename: '/formal/lizicheng5.txt',
  },
  { title: '雪山大地', author: '杨志军', filename: '/formal/xueshandadi.txt' },
  { title: '将军吟', author: '莫应丰', filename: '/formal/jiangjunyin.txt' },
  { title: '回响', author: '东西', filename: '/formal/huixiang.txt' },
  { title: '芙蓉镇', author: '古华', filename: '/formal/furongzhen.txt' },
  { title: '本巴', author: '刘亮程', filename: '/formal/benba.txt' },
  {
    title: '千里江山图',
    author: '孙甘露',
    filename: '/formal/qianlijiangshantu.txt',
  },
  {
    title: '李银河说爱情',
    author: '李银河',
    filename: '/formal/liyinheshuoaiqing.txt',
  },
  {
    title: '沉默的大多数',
    author: '王小波',
    filename: '/formal/chenmodedaduoshu.txt',
  },
  {
    title: '江村经济',
    author: '费孝通',
    filename: '/jcjj.txt',
  },
  {
    title: '红与黑',
    author: '司汤达',
    filename: '/hongyuhei.txt',
  },
  {
    title: '查拉图斯特拉如是说',
    author: '尼采',
    filename: '/chalatusitelarushishuo.txt',
  },
  {
    title: '太阳照常升起',
    author: '海明威',
    filename: '/taiyangzhaochangshengqi.txt',
  },
  {
    title: '人口原理',
    author: '马尔萨斯',
    filename: '/2025/人口原理.txt',
  },
  {
    title: '大众的反叛',
    author: '奥尔特加·加塞特',
    filename: '/2025/大众的反叛.txt',
  },
  {
    title: '乌合之众',
    author: '古斯塔夫•勒庞',
    filename: '/2025/乌合之众.txt',
  },
  {
    title: '王子与贫儿',
    author: '马克吐温',
    filename: '/2025/王子与贫儿.txt',
  },
  {
    title: '基督山伯爵',
    author: '大仲马',
    filename: '/2025/基督山伯爵.txt',
  },
  {
    title: '林家铺子',
    author: '茅盾',
    filename: '/2025/林家铺子.txt',
  },
  {
    title: 'radar-202504',
    author: '-',
    filename: '/2025/radar-202504.txt',
  },
  // { title: 'test', author: 'test', filename: 'test.txt' },
  // { title: '毛选1（大篇幅）', author: '毛泽东', filename: 'mx_1.txt' },
  // { title: '毛选2（大篇幅）', author: '毛泽东', filename: 'mx_2.txt' },
  // { title: '毛选3（大篇幅）', author: '毛泽东', filename: 'mx_3.txt' },
  // { title: '毛选4（大篇幅）', author: '毛泽东', filename: 'mx_4.txt' },
  // { title: '毛选5（大篇幅）', author: '毛泽东', filename: 'mx_5.txt' },
  // { title: '剑来1-2', author: '烽火戏诸侯', filename: 'book9.txt' },
  // { title: '剑来3-4', author: '烽火戏诸侯', filename: 'book11.txt' },
  // { title: '剑来5-6', author: '烽火戏诸侯', filename: 'book12.txt' },
  // { title: '剑来7-8', author: '烽火戏诸侯', filename: 'book13.txt' },
  // { title: '剑来9-10', author: '烽火戏诸侯', filename: 'book14.txt' },
  // { title: '剑来11-12', author: '烽火戏诸侯', filename: 'book15.txt' },
  // { title: '剑来13-14', author: '烽火戏诸侯', filename: 'book16.txt' },
  // { title: '剑来15-16', author: '烽火戏诸侯', filename: 'book17.txt' },
  // { title: '剑来17-18', author: '烽火戏诸侯', filename: 'book18.txt' },
  // { title: '剑来19-20', author: '烽火戏诸侯', filename: '/19-36/book20.txt' },
  // { title: '剑来21-22', author: '烽火戏诸侯', filename: '/19-36/book21.txt' },
  // { title: '剑来23-24', author: '烽火戏诸侯', filename: '/19-36/book22.txt' },
  // { title: '剑来25-26', author: '烽火戏诸侯', filename: '/19-36/book23.txt' },
  // { title: '剑来27-28', author: '烽火戏诸侯', filename: '/19-36/book24.txt' },
  // { title: '剑来29-30', author: '烽火戏诸侯', filename: '/19-36/book25.txt' },
  // { title: '剑来31-32', author: '烽火戏诸侯', filename: '/19-36/book26.txt' },
  // { title: '剑来33-34', author: '烽火戏诸侯', filename: '/19-36/book27.txt' },
  // { title: '剑来35', author: '烽火戏诸侯', filename: '/19-36/book28.txt' },
  // { title: '剑来36', author: '烽火戏诸侯', filename: '/37-/book29.txt' },
  // { title: '剑来37', author: '烽火戏诸侯', filename: '/37-/book30.txt' },
  // { title: '剑来38', author: '烽火戏诸侯', filename: '/37-/book31.txt' },
  // { title: '剑来39', author: '烽火戏诸侯', filename: '/37-/book32.txt' },
];

function All() {
  const [selectBook, setSelectBook] = useState<string>('');
  const [data, setData] = useState<string>('');
  const lastSelected = localStorage.getItem('last_selected');

  useEffect(() => {
    if (!selectBook) {
      return;
    }
    localStorage.setItem('last_selected', selectBook);
    (async () => {
      const res = await fetch(selectBook);
      const bookData = await res.text();
      setData(bookData);
    })();
  }, [selectBook]);

  if (!selectBook || !data) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {books.map((book) => (
          <div
            style={{
              border: '1px solid #000',
              padding: '4px 8px',
              cursor: 'pointer',
              borderRadius: '4px',
              backgroundColor:
                lastSelected === book.filename ? '#3366dd' : '#fff',
              color: lastSelected === book.filename ? '#fff' : '#000',
              textAlign: 'center',
            }}
            key={book.filename}
            onClick={() => setSelectBook(book.filename)}
          >
            <div>{book.title}</div>
            <div>{book.author}</div>
          </div>
        ))}
      </div>
    );
  }

  return <App book={data} id={selectBook} />;
}

export default All;
