export interface PostProps {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  columnId: number;
}

export interface ColumnProps {
  id: number;
  title: string;
  avator?: string;
  description: string;
}

export const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'asdasdasd',
    description:
      '你好啊数据库的乃是电脑发哈阿萨德哈us发大风鸟U盾事发后安抚爱的分红年度非阿道夫ad发',
    avator:
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1663794441,715812678&fm=26&gp=0.jpg',
  },
  {
    id: 2,
    title: 'asdasdasd',
    description:
      '你好啊数据库的乃是电脑发哈阿萨德哈us发大风鸟U盾事发后安抚爱的分红年度非阿道夫ad发',
    avator:
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1663794441,715812678&fm=26&gp=0.jpg',
  },
  {
    id: 3,
    title: 'asdasdasd',
    description:
      '你好啊数据库的乃是电脑发哈阿萨德哈us发大风鸟U盾事发后安抚爱的分红年度非阿道夫ad发',
    avator:
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1663794441,715812678&fm=26&gp=0.jpg',
  },
  {
    id: 4,
    title: 'asdasdasd',
    description:
      '你好啊数据库的乃是电脑发哈阿萨德哈us发大风鸟U盾事发后安抚爱的分红年度非阿道夫ad发',
    avator:
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1663794441,715812678&fm=26&gp=0.jpg',
  },
  {
    id: 5,
    title: 'asdasdasd',
    description:
      '你好啊数据库的乃是电脑发哈阿萨德哈us发大风鸟U盾事发后安抚爱的分红年度非阿道夫ad发',
    avator:
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1663794441,715812678&fm=26&gp=0.jpg',
  },
];

export const testPosts: PostProps[] = [
  {
    id: 1,
    title: '这是我的第一篇文章',
    content:
      '"this is a new post you Very often we will need to map routes with the given pattern to the same component. For example we may have a User component which should be rendered for all users but with dif..."',
    image:
      'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1954666794,1516124406&fm=15&gp=0.jpg',
    createdAt: '2020-02-11 10:34:22',
    columnId: 1,
  },
  {
    id: 2,
    title: '这是我的第二篇文章',
    content:
      '"this is a new post you Very often we will need to map routes with the given pattern to the same component. For example we may have a User component which should be rendered for all users but with dif..."',
    createdAt: '2020-07-1 13:34:22',
    columnId: 1,
  },
  {
    id: 3,
    title: '这是我的第三篇文章',
    content:
      '"this is a new post you Very often we will need to map routes with the given pattern to the same component. For example we may have a User component which should be rendered for all users but with dif..."',
    image:
      'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1954666794,1516124406&fm=15&gp=0.jpg',
    createdAt: '2020-09-11 16:34:22',
    columnId: 1,
  },
];
