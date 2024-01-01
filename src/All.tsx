import { useEffect, useState } from 'react';
import App from './App.tsx';

const books = [
  { title: '美国反对美国', author: '王沪宁', filename: 'book1.txt' },
  { title: '正义论', author: '约翰·罗尔斯', filename: 'book2.json' },
  { title: '一九八四', author: '乔治·奥威尔', filename: 'book3.txt' },
  { title: '文明的冲突与世界秩序的重建', author: '萨缪尔·亨廷顿', filename: 'book4.txt' },
  { title: '菊与刀', author: '鲁思·本尼迪克特', filename: 'book5.txt' },
  { title: '乡土中国', author: '费孝通', filename: 'book6.txt' },
  { title: '国家为什么会失败——权力、富裕与贫困的根源', author: 'Daron Acemoglu and James A. Robinson', filename: 'book7.txt' },
  { title: '繁花', author: '金宇澄', filename: 'book8.txt' },
  { title: '剑来_part1', author: '烽火戏诸侯', filename: 'book9.txt' },
  { title: '剑来_part2', author: '烽火戏诸侯', filename: 'book10.txt' },
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
